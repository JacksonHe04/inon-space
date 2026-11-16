/**
 * Vercel 注入的地理头。
 *
 * 这些值全部来自 IP 库，不是 GPS —— 经纬度是城市质心，误差以公里计，
 * 用来判断「在哪一片」够用，指认到具体位置不现实。
 *
 * 城市与省份是 RFC 3986 编码的（中文会变成 %E5%8C%97%E4%BA%AC），
 * 入库前必须解码，否则聚合时会按编码后的字符串分组。
 */
export interface VisitorGeo {
  /** ISO 3166-1 alpha-2，例如 CN */
  country: string;
  /** ISO 3166-2 的一级行政区代码，例如 BJ */
  region: string;
  /** 城市名（已解码） */
  city: string;
  /** IANA 时区，例如 Asia/Shanghai */
  timezone: string;
  postal: string;
  latitude: number | null;
  longitude: number | null;
}

export const EMPTY_GEO: VisitorGeo = {
  country: '',
  region: '',
  city: '',
  timezone: '',
  postal: '',
  latitude: null,
  longitude: null,
};

export function readVisitorGeo(requestHeaders: Headers): VisitorGeo {
  return {
    country: (requestHeaders.get('x-vercel-ip-country') ?? '').slice(0, 8),
    region: decode(requestHeaders.get('x-vercel-ip-country-region')).slice(0, 16),
    city: decode(requestHeaders.get('x-vercel-ip-city')).slice(0, 64),
    timezone: (requestHeaders.get('x-vercel-ip-timezone') ?? '').slice(0, 64),
    postal: (requestHeaders.get('x-vercel-ip-postal-code') ?? '').slice(0, 16),
    latitude: readCoordinate(requestHeaders.get('x-vercel-ip-latitude'), 90),
    longitude: readCoordinate(requestHeaders.get('x-vercel-ip-longitude'), 180),
  };
}

export function readContinent(requestHeaders: Headers): string {
  return (requestHeaders.get('x-vercel-ip-continent') ?? '').slice(0, 8);
}

function decode(raw: string | null): string {
  if (!raw) return '';
  try {
    return decodeURIComponent(raw).trim();
  } catch {
    // 值里带孤立的 % 时 decodeURIComponent 会抛错，原样返回即可
    return raw.trim();
  }
}

function readCoordinate(raw: string | null, limit: number): number | null {
  if (!raw) return null;
  const value = Number(raw);
  if (!Number.isFinite(value) || Math.abs(value) > limit) return null;
  return value;
}
