import { headers } from 'next/headers';

import { readVisitorGeo, type VisitorGeo } from '@/lib/analytics/geo';
import { extractClientIp, getIpSalt, hashIp, parseUserAgent } from '@/lib/analytics/hash';
import { lookupIpRegion } from '@/lib/analytics/ip-lookup';
import { composePlace } from '@/lib/analytics/place';
import { fetchSessionEntry } from '@/lib/chat/queries';

export interface VisitorIdentity {
  /** 匿名访客标识：IP 加盐哈希的前 16 位，用来判断「是不是同一个人」 */
  key: string;
  /** 访客自己填的名字；没填就是空串，由前端按当前语言拼「来自某地的访客」 */
  displayName: string;
  /** 已经拼好的地名，例如「中国北京海淀」；没有地理头时为 null */
  locationLabel: string | null;
  avatarSeed: string;
  /** 原始 IP；本地开发没有这个头，为 null */
  ip: string | null;
  userAgent: string;
  geo: VisitorGeo;
  /** 「iOS 27.3」「Android 17」，取不到版本就只留系统名 */
  os: string;
  /** 入口：webview 宿主（wechat / qq …）、站外域名，或 direct */
  entry: string;
  /** 4G / 5G / WIFI，仅 App 内浏览器会带 */
  network: string;
}

/**
 * 从 Vercel 注入的地理头推导出访客身份。
 *
 * 头像种子与节流键用哈希，原始 IP 只进 `chat_visitor_meta`（匿名不可读），
 * 不进任何对外可见的行 —— 群聊是公开的，Realtime 会把整行广播给所有人。
 *
 * 地名会多走一次区县查询（`lookupIpRegion`），失败就退回城市，不阻塞发言。
 */
export async function getVisitorIdentity(sessionId = ''): Promise<VisitorIdentity> {
  const requestHeaders = await headers();

  /*
   * 与访问统计共用同一套哈希（见 lib/analytics/hash.ts）——「同一个访客」
   * 这件事不该有两套口径。盐缺失时 getIpSalt() 会抛错，不复用那个公开的兜底值。
   * 本地开发没有这些头，退回一个固定串，保证节流键仍然稳定。
   */
  const ip = extractClientIp(requestHeaders);
  const key = hashIp(ip ?? 'local-unknown', getIpSalt()).slice(0, 16);
  const geo = readVisitorGeo(requestHeaders);
  const ua = parseUserAgent(requestHeaders.get('user-agent'));

  const lookup = await lookupIpRegion(ip);
  const place = composePlace(geo, lookup);

  // 入口优先级：App 内浏览器 → 这次会话的落地来源 → 直接访问
  const entry = ua.webview || (await fetchSessionEntry(sessionId)) || 'direct';

  return {
    key,
    displayName: '',
    locationLabel: place || null,
    avatarSeed: key,
    ip,
    userAgent: requestHeaders.get('user-agent') ?? '',
    geo,
    os: [ua.os, ua.os_version].filter(Boolean).join(' '),
    entry,
    network: ua.network_type,
  };
}
