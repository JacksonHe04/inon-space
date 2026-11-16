import { CN_PROVINCES } from '@/lib/chat/china-provinces';
import type { IpLookup } from '@/lib/analytics/ip-lookup';
import type { VisitorGeo } from '@/lib/analytics/geo';

/**
 * 把地理头 + 区县查询拼成一个可读的地名，例如「中国北京海淀」「日本东京」。
 *
 * 规则来自聊天面板的既有约束：
 * - 城市只在它本身已是本地语言时才用（中文/日文），否则只保留国家 ——
 *   否则会出现「来自中国Beijing的访客」这种中英混排；
 * - 省与市同名（直辖市）时去重，别读成「中国北京北京」；
 * - 单字后缀（市 / 省 / 区 / 县）去掉，「北京市海淀区」读作「北京海淀」。
 */
export function composePlace(geo: VisitorGeo, lookup: IpLookup | null): string {
  const country = countryName(geo.country);
  const province = provinceName(geo.country, geo.region);

  const parts: string[] = [];
  const push = (raw: string) => {
    const part = cleanPart(raw);
    if (!part) return;
    // 已收录的部分能互相包含就跳过：北京 / 北京市 只留一个
    if (parts.some((kept) => kept.includes(part) || part.includes(kept))) return;
    parts.push(part);
  };

  push(province);

  // 查询结果比头更细，优先用它；没有就退回 Vercel 的城市
  const city = localized(lookup?.city) || localized(geo.city);
  push(city);
  push(localized(lookup?.district));

  const region = parts.join('');
  if (country && region) return `${country}${region}`;
  return country || region;
}

/**
 * 省份只在有中文对照表时才有意义 —— 目前只做了中国。
 * 别的国家 Vercel 给的是州/省代码（`CA`、`BY`…），没有名称可用，
 * 与其贴代码上去，不如只显示国家。
 */
export function provinceName(countryCode: string, regionCode: string): string {
  if (!countryCode || !regionCode || countryCode.toUpperCase() !== 'CN') return '';
  return CN_PROVINCES[regionCode.toUpperCase()] ?? '';
}

let regionNames: Intl.DisplayNames | null = null;

export function countryName(code: string): string {
  if (!code) return '';
  try {
    regionNames ??= new Intl.DisplayNames(['zh-CN'], { type: 'region' });
    const name = regionNames.of(code.toUpperCase());
    // 未知代码时 Intl 会原样返回代码本身，视同没有
    return name && name !== code.toUpperCase() ? name : '';
  } catch {
    return '';
  }
}

/** 非 ASCII 说明它本身就是本地语言的地名，可以直接用 */
function localized(value: string | null | undefined): string {
  if (!value) return '';
  return /[^\x00-\x7F]/.test(value) ? value : '';
}

function cleanPart(value: string): string {
  return value
    .trim()
    .replace(/[省市縣县区區]$/u, '')
    .trim();
}
