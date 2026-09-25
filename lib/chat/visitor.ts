import { createHash } from 'node:crypto';
import { headers } from 'next/headers';

export interface VisitorIdentity {
  /** 匿名访客标识：IP 加盐哈希，只用来区分「是不是同一个人」，不存原始 IP */
  key: string;
  /** 「来自中国北京的访客」 */
  displayName: string;
  locationLabel: string | null;
  avatarSeed: string;
}

/**
 * 从 Vercel 注入的地理头推导出访客身份。
 *
 * 城市名只在其本身已是本地语言时才用（非 ASCII），否则只保留国家 ——
 * 否则会出现「来自中国Beijing的访客」这种中英混排。本地开发没有这些头，
 * 落到「一位路过的访客」。
 */
export async function getVisitorIdentity(): Promise<VisitorIdentity> {
  const requestHeaders = await headers();

  const forwarded = requestHeaders.get('x-forwarded-for');
  const ip =
    forwarded?.split(',')[0]?.trim() || requestHeaders.get('x-real-ip') || 'local-unknown';

  const salt = process.env.ANALYTICS_IP_SALT ?? 'inon-v3-chat';
  const key = createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 16);

  const locationLabel = readLocation(requestHeaders);

  return {
    key,
    displayName: locationLabel ? `来自${locationLabel}的访客` : '一位路过的访客',
    locationLabel,
    avatarSeed: key,
  };
}

function readLocation(requestHeaders: Headers): string | null {
  const countryCode = requestHeaders.get('x-vercel-ip-country');
  const cityRaw = requestHeaders.get('x-vercel-ip-city');

  const country = countryCode ? regionName(countryCode) : null;
  const city = cityRaw ? decodeSafe(cityRaw) : null;
  // 已经是本地语言的城市名才值得展示
  const localizedCity = city && /[^\x00-\x7F]/.test(city) ? city : null;

  if (country && localizedCity) return `${country}${localizedCity}`;
  return country ?? localizedCity;
}

let regionNames: Intl.DisplayNames | null = null;

function regionName(code: string): string | null {
  try {
    regionNames ??= new Intl.DisplayNames(['zh-CN'], { type: 'region' });
    const name = regionNames.of(code.toUpperCase());
    // 未知代码时 Intl 会原样返回代码本身，视同没有
    return name && name !== code.toUpperCase() ? name : null;
  } catch {
    return null;
  }
}

function decodeSafe(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
