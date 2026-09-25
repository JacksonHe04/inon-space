import { headers } from 'next/headers';

import { extractClientIp, getIpSalt, hashIp } from '@/lib/analytics/hash';
import { CN_PROVINCES } from '@/lib/chat/china-provinces';

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

  /*
   * 与访问统计共用同一套哈希（见 lib/analytics/hash.ts）——「不存原始 IP」这件事
   * 不该有两套口径。盐缺失时 getIpSalt() 会抛错，不复用那个公开的兜底值。
   * 本地开发没有这些头，退回一个固定串，保证节流键仍然稳定。
   */
  const ip = extractClientIp(requestHeaders) ?? 'local-unknown';
  const key = hashIp(ip, getIpSalt()).slice(0, 16);

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
  const regionCode = requestHeaders.get('x-vercel-ip-country-region');
  const cityRaw = requestHeaders.get('x-vercel-ip-city');

  const country = countryCode ? regionName(countryCode) : null;
  const province = readProvince(countryCode, regionCode);
  // 已经是本地语言的城市名才值得展示
  const city = readLocalizedCity(cityRaw);

  // 直辖市会返回「北京 + Beijing」这种省市同名的情况，去重一次
  // 否则会读成「来自中国北京北京的访客」
  const region =
    province && city && province === city
      ? province
      : [province, city].filter(Boolean).join('') || null;

  if (country && region) return `${country}${region}`;
  return country ?? region;
}

/**
 * 省份只在有中文对照表时才有意义 —— 目前只做了中国。
 * 别的国家 Vercel 给的是州/省代码（`CA`、`BY`…），没有名称可用，
 * 与其贴代码上去，不如只显示国家。
 */
function readProvince(countryCode: string | null, regionCode: string | null): string | null {
  if (!countryCode || !regionCode || countryCode.toUpperCase() !== 'CN') return null;
  return CN_PROVINCES[regionCode.toUpperCase()] ?? null;
}

function readLocalizedCity(raw: string | null): string | null {
  if (!raw) return null;
  const city = decodeSafe(raw);
  return /[^\x00-\x7F]/.test(city) ? city : null;
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
