import { headers } from 'next/headers';

import { readVisitorGeo, type VisitorGeo } from '@/lib/analytics/geo';
import { extractClientIp, getIpSalt, hashIp } from '@/lib/analytics/hash';
import { CN_PROVINCES } from '@/lib/chat/china-provinces';

export interface VisitorIdentity {
  /** 匿名访客标识：IP 加盐哈希的前 16 位，用来判断「是不是同一个人」 */
  key: string;
  /** 「来自中国北京的访客」 */
  displayName: string;
  locationLabel: string | null;
  avatarSeed: string;
  /** 原始 IP；本地开发没有这个头，为 null */
  ip: string | null;
  userAgent: string;
  geo: VisitorGeo;
}

/**
 * 从 Vercel 注入的地理头推导出访客身份。
 *
 * 头像种子与节流键用哈希，原始 IP 只进 `chat_visitor_meta`（匿名不可读），
 * 不进任何对外可见的行 —— 群聊是公开的，Realtime 会把整行广播给所有人。
 */
export async function getVisitorIdentity(): Promise<VisitorIdentity> {
  const requestHeaders = await headers();

  /*
   * 与访问统计共用同一套哈希（见 lib/analytics/hash.ts）——「同一个访客」
   * 这件事不该有两套口径。盐缺失时 getIpSalt() 会抛错，不复用那个公开的兜底值。
   * 本地开发没有这些头，退回一个固定串，保证节流键仍然稳定。
   */
  const ip = extractClientIp(requestHeaders);
  const key = hashIp(ip ?? 'local-unknown', getIpSalt()).slice(0, 16);
  const geo = readVisitorGeo(requestHeaders);
  const locationLabel = buildLocationLabel(geo);

  return {
    key,
    displayName: locationLabel ? `来自${locationLabel}的访客` : '一位路过的访客',
    locationLabel,
    avatarSeed: key,
    ip,
    userAgent: requestHeaders.get('user-agent') ?? '',
    geo,
  };
}

/**
 * 城市名只在其本身已是本地语言时才用（非 ASCII），否则只保留国家 ——
 * 否则会出现「来自中国Beijing的访客」这种中英混排。
 * 本地开发没有这些头，落到「一位路过的访客」。
 */
function buildLocationLabel(geo: VisitorGeo): string | null {
  const country = geo.country ? regionName(geo.country) : null;
  const province = readProvince(geo.country, geo.region);
  const city = /[^\x00-\x7F]/.test(geo.city) ? geo.city : null;

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
function readProvince(countryCode: string, regionCode: string): string | null {
  if (!countryCode || !regionCode || countryCode.toUpperCase() !== 'CN') return null;
  return CN_PROVINCES[regionCode.toUpperCase()] ?? null;
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
