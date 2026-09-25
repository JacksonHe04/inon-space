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
 * 反推出访客 IP，那样「不存原始 IP」这个承诺就是空的。宁可让请求失败得明显一点。
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

/**
 * 极简 UA 解析：只认 device_type / browser / os 三样。
 * 不引 ua-parser-js —— 为了三个字段装一个依赖不划算。命中失败留空，读取层会归到「未知」。
 */
export function parseUserAgent(ua: string | null | undefined): {
  device_type: 'desktop' | 'mobile' | 'tablet' | 'bot' | '';
  browser: string;
  os: string;
} {
  if (!ua) return { device_type: '', browser: '', os: '' };

  const lower = ua.toLowerCase();
  let device_type: 'desktop' | 'mobile' | 'tablet' | 'bot' | '' = '';

  if (/bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|preview/i.test(ua)) {
    device_type = 'bot';
  } else if (/ipad|tablet|playbook|silk/i.test(ua)) {
    device_type = 'tablet';
  } else if (/iphone|ipod|android.*mobile|windows phone|blackberry|opera mini|mobile/i.test(lower)) {
    device_type = 'mobile';
  } else if (/mozilla|chrome|safari|firefox|edge/i.test(lower)) {
    device_type = 'desktop';
  }

  let browser = '';
  if (/edg\//i.test(ua)) browser = 'Edge';
  else if (/opr\/|opera/i.test(ua)) browser = 'Opera';
  else if (/chrome|chromium|crios/i.test(ua)) browser = 'Chrome';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
  else if (/safari/i.test(ua)) browser = 'Safari';

  let os = '';
  if (/windows nt/i.test(ua)) os = 'Windows';
  else if (/mac os x|macintosh/i.test(ua)) os = 'macOS';
  else if (/iphone os|ipad os/i.test(ua)) os = 'iOS';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/cros/i.test(ua)) os = 'ChromeOS';
  else if (/linux/i.test(ua)) os = 'Linux';

  return { device_type, browser: browser.slice(0, 64), os };
}
