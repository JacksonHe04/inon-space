/**
 * IP → 区县级的补充查询。
 *
 * Vercel 的 `x-vercel-ip-city` 只到市一级，要显示「北京海淀」得再查一次。
 * 用的是 ip-api 的免费接口：它对国内 IP 有时能返回到区县甚至街道
 * （例如 202.106.0.20 → city=金融街 / district=Xicheng District）。
 *
 * 三条硬约束：
 * - **失败必须静默**：这是个装饰性查询，查不到就退回 Vercel 给的城市；
 * - **超时 2.5 秒**：它挡在发消息的主链路上，不能把回复拖垮；
 * - **只查一次**：同一 IP 在实例内存里缓存，map 有上限，不会无限涨。
 */
export interface IpLookup {
  city: string;
  district: string;
}

const ENDPOINT = 'http://ip-api.com/json/';
const TIMEOUT_MS = 2500;
const CACHE_LIMIT = 500;

const cache = new Map<string, IpLookup | null>();

export async function lookupIpRegion(ip: string | null): Promise<IpLookup | null> {
  if (!ip || isPrivateIp(ip)) return null;
  if (cache.has(ip)) return cache.get(ip) ?? null;

  try {
    const response = await fetch(
      `${ENDPOINT}${encodeURIComponent(ip)}?lang=zh-CN&fields=status,city,district`,
      { signal: AbortSignal.timeout(TIMEOUT_MS), cache: 'no-store' }
    );
    if (!response.ok) throw new Error(String(response.status));

    const data = (await response.json()) as {
      status?: string;
      city?: unknown;
      district?: unknown;
    };

    const result =
      data.status === 'success'
        ? { city: text(data.city), district: text(data.district) }
        : null;

    remember(ip, result);
    return result;
  } catch {
    remember(ip, null);
    return null;
  }
}

function remember(ip: string, value: IpLookup | null): void {
  if (cache.size >= CACHE_LIMIT) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(ip, value);
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim().slice(0, 32) : '';
}

/** 内网、回环、本地开发用的占位串都没有查的意义 */
function isPrivateIp(ip: string): boolean {
  return (
    ip === 'local-unknown' ||
    ip.startsWith('10.') ||
    ip.startsWith('127.') ||
    ip.startsWith('192.168.') ||
    ip.startsWith('169.254.') ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(ip) ||
    ip === '::1' ||
    ip.startsWith('fc') ||
    ip.startsWith('fd') ||
    ip.startsWith('fe80')
  );
}
