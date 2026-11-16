import { createHash } from 'node:crypto';

/**
 * 访问统计的隐私与解析工具。
 *
 * 与 world-engineering 的 `lib/analytics/hash.ts` 保持同一套实现：
 * 两个站写的是同一张 `page_view_events` 表，哈希口径和字段填法必须一致，
 * 否则同一批数据里会出现两种风格，将来合起来看就废了。
 */

/**
 * 读取并校验 IP 哈希盐。
 *
 * 缺失时**直接抛错**，不退化成无盐哈希 —— 无盐意味着任何人都能枚举 IPv4 空间
 * 反推出访客 IP，那样 `ip_hash` 就失去了「只做去重、不做身份」的意义。
 * 宁可让请求失败得明显一点。
 */
export function getIpSalt(): string {
  const salt = process.env.ANALYTICS_IP_SALT;
  if (!salt || salt.length < 16) {
    throw new Error(
      'ANALYTICS_IP_SALT 未设置或过短（需 ≥ 16 字符）。请在 .env.local 中生成：openssl rand -hex 32'
    );
  }
  return salt;
}

/** 取客户端 IP。多层代理时取最左侧（最原始的那个）；取不到返回 null */
export function extractClientIp(headers: Headers): string | null {
  const forwarded = headers.get('x-forwarded-for');
  const first = forwarded?.split(',')[0]?.trim();
  if (first) return first;

  const realIp = headers.get('x-real-ip');
  return realIp?.trim() || null;
}

/** SHA-256(ip + salt) → hex。没有 IP 时返回空串，不阻塞写库 */
export function hashIp(ip: string | null, salt: string): string {
  if (!ip) return '';
  return createHash('sha256').update(`${ip}${salt}`).digest('hex');
}

/** 取 referrer 的域名；空串表示直接访问。非完整 URL 也尽量兜底 */
export function extractReferrerDomain(referrer: string | null | undefined): string {
  if (!referrer) return '';
  try {
    return new URL(referrer).hostname.toLowerCase().slice(0, 128);
  } catch {
    const matched = referrer.match(/^(?:https?:\/\/)?([^/?#]+)/i);
    return (matched?.[1] ?? '').toLowerCase().slice(0, 128);
  }
}

export type DeviceType = 'desktop' | 'mobile' | 'tablet' | 'bot' | '';

export interface ParsedUserAgent {
  device_type: DeviceType;
  /** 真实浏览器名，或 webview 的宿主 App（WeChat / QQ / …） */
  browser: string;
  os: string;
  os_version: string;
  /** Android 的机型代码（M332BF / PLQ110）；iOS 的 UA 里没有机型，留空 */
  device_model: string;
  /** 宿主 App 的机器名（wechat / qq / …），真实浏览器为 '' */
  webview: string;
  /** 微信/QQ 的 UA 会带 NetType：4G / 5G / WIFI */
  network_type: string;
}

export const EMPTY_USER_AGENT: ParsedUserAgent = {
  device_type: '',
  browser: '',
  os: '',
  os_version: '',
  device_model: '',
  webview: '',
  network_type: '',
};

/**
 * webview 宿主识别。顺序有意义：微信、QQ 的 UA 里同时含 `wv`，
 * 必须先命中具体 App，再由 `wv` 兜底到通用 WebView。
 */
const WEBVIEW_HOSTS: Array<[RegExp, string, string]> = [
  [/micromessenger/i, 'wechat', 'WeChat'],
  [/alipayclient/i, 'alipay', 'Alipay'],
  [/dingtalk/i, 'dingtalk', 'DingTalk'],
  [/weibo/i, 'weibo', 'Weibo'],
  [/\baweme\b|bytedancewebview|toutiao/i, 'douyin', 'Douyin'],
  [/baiduboxapp/i, 'baidu', 'Baidu'],
  [/xiaohongshu/i, 'xiaohongshu', 'Xiaohongshu'],
  [/qq\/[\d.]+/i, 'qq', 'QQ'],
  [/\bwv\b/i, 'generic', 'WebView'],
];

const BROWSERS: Array<[RegExp, string]> = [
  [/edg\//i, 'Edge'],
  [/opr\/|opera/i, 'Opera'],
  [/mqqbrowser|qqbrowser/i, 'QQBrowser'],
  [/ucbrowser/i, 'UCBrowser'],
  [/quark/i, 'Quark'],
  [/firefox|fxios/i, 'Firefox'],
  [/chrome|chromium|crios/i, 'Chrome'],
  [/safari/i, 'Safari'],
];

/**
 * 极简 UA 解析：只认统计要用的那几样。
 *
 * 当初只解析 device_type / browser / os 三个字段，所以没有引 ua-parser-js。
 * 现在要多识别 webview 宿主、机型、网络制式 —— 这三样它都不给（NetType 和
 * 微信/QQ 的宿主标识是国产 App 自己塞的），因此仍然用一个文件搞定，
 * 不额外引入依赖。
 */
export function parseUserAgent(ua: string | null | undefined): ParsedUserAgent {
  const raw = ua ?? '';
  if (!raw) return EMPTY_USER_AGENT;

  const lower = raw.toLowerCase();
  const host = WEBVIEW_HOSTS.find(([pattern]) => pattern.test(raw));
  const os = readOs(raw);

  return {
    device_type: readDeviceType(raw, lower),
    // webview 里报宿主 App 名更有用：「来自微信的访客」比「来自 Chrome 的访客」信息量大
    browser: (host ? host[2] : readBrowser(raw)).slice(0, 64),
    os: os.name,
    os_version: os.version.slice(0, 16),
    device_model: readDeviceModel(raw),
    webview: host?.[1] ?? '',
    network_type: readNetworkType(raw),
  };
}

function readDeviceType(raw: string, lower: string): DeviceType {
  if (/bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|preview/i.test(raw)) {
    return 'bot';
  }
  if (/ipad|tablet|playbook|silk/i.test(raw)) return 'tablet';
  if (/iphone|ipod|android.*mobile|windows phone|blackberry|opera mini|mobile/i.test(lower)) {
    return 'mobile';
  }
  // Android 平板不带 Mobile 标记，落到这里
  if (/android/i.test(lower)) return 'tablet';
  if (/mozilla|chrome|safari|firefox|edge/i.test(lower)) return 'desktop';
  return '';
}

function readOs(raw: string): { name: string; version: string } {
  // iOS 必须排在 macOS 之前：iPhone 的 UA 里也写着 "like Mac OS X"
  const ios = raw.match(/OS (\d+(?:_\d+)*)/);
  if (/iphone|ipad|ipod/i.test(raw)) {
    return { name: 'iOS', version: ios?.[1].replace(/_/g, '.') ?? '' };
  }

  const android = raw.match(/Android ([\d.]+)/);
  if (/harmonyos|openharmony/i.test(raw)) {
    return { name: 'HarmonyOS', version: android?.[1] ?? '' };
  }
  if (android) return { name: 'Android', version: android[1] };

  const windows = raw.match(/Windows NT ([\d.]+)/i);
  if (windows) return { name: 'Windows', version: windows[1] };
  if (/cros/i.test(raw)) return { name: 'ChromeOS', version: '' };

  const mac = raw.match(/Mac OS X ([\d_]+)/i);
  if (mac) {
    // Chrome 在 macOS 上把版本冻结成 10_15_7，这个值没有信息量，别入库
    const version = mac[1].replace(/_/g, '.');
    return { name: 'macOS', version: version === '10.15.7' ? '' : version };
  }

  if (/linux/i.test(raw)) return { name: 'Linux', version: '' };
  return { name: '', version: '' };
}

function readBrowser(raw: string): string {
  for (const [pattern, name] of BROWSERS) {
    if (pattern.test(raw)) return name;
  }
  return '';
}

/** Android 的 UA 里机型写在 "Android x.y; <model> Build/" 中间 */
function readDeviceModel(raw: string): string {
  const matched = raw.match(/;\s*([^;()]+?)\s+Build\//i);
  if (!matched) return '';

  const model = matched[1].trim();
  if (!model || /android|linux|windows|ios/i.test(model)) return '';
  return model.slice(0, 64);
}

function readNetworkType(raw: string): string {
  const matched = raw.match(/NetType\/([A-Za-z0-9]+)/i);
  return matched ? matched[1].toUpperCase().slice(0, 8) : '';
}
