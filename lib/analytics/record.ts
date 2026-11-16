import { headers } from 'next/headers';

import { readContinent, readVisitorGeo } from '@/lib/analytics/geo';
import {
  extractClientIp,
  extractReferrerDomain,
  getIpSalt,
  hashIp,
  parseUserAgent,
} from '@/lib/analytics/hash';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { SITE_PROFILE_ID, SITE_VIEW_EVENT } from '@/lib/site-meta';

/** 超过 6 小时的「停留」只会是标签页开着没关，截断掉免得污染均值 */
const MAX_DWELL_MS = 6 * 60 * 60 * 1000;

export interface PageViewInput {
  urlPath: string;
  sessionId?: string;
  /** 距上一次 page_view 的毫秒数 —— 即上一页的停留时间 */
  dwellMs?: number;
}

/**
 * 记录一次访问。
 *
 * 只记录、不返回任何东西，也**从不抛错**：统计是副产品，不该让任何人因为
 * 统计失败而看不到页面。失败只写服务端日志。
 *
 * 写库走服务端密钥：`page_view_events` 对匿名是 deny-all，
 * 而事件里带着原始 IP 与坐标，不能由浏览器直接写。
 */
export async function recordPageView(input: PageViewInput): Promise<void> {
  try {
    const requestHeaders = await headers();

    const userAgent = requestHeaders.get('user-agent') ?? '';
    const ua = parseUserAgent(userAgent);
    const geo = readVisitorGeo(requestHeaders);
    const ip = extractClientIp(requestHeaders);
    const referer = requestHeaders.get('referer') ?? '';

    const supabase = getSupabaseServerClient();
    const { error } = await supabase.rpc('page_view_record', {
      p_profile_id: SITE_PROFILE_ID,
      p_event_name: SITE_VIEW_EVENT,
      p_url_path: input.urlPath.slice(0, 256),
      p_referrer: extractReferrerDomain(referer),
      p_referrer_url: referer.slice(0, 512),
      p_country: geo.country,
      p_geo_continent: readContinent(requestHeaders),
      p_geo_region: geo.region,
      p_geo_city: geo.city,
      p_geo_timezone: geo.timezone,
      p_geo_postal: geo.postal,
      p_geo_lat: geo.latitude,
      p_geo_lon: geo.longitude,
      p_device_type: ua.device_type,
      p_browser: ua.browser,
      p_os: ua.os,
      p_device_model: ua.device_model,
      p_webview: ua.webview,
      p_network_type: ua.network_type,
      p_ip: ip ?? '',
      p_ip_hash: hashIp(ip, getIpSalt()),
      p_session_id: (input.sessionId ?? '').slice(0, 64),
      p_user_agent: userAgent.slice(0, 512),
      p_dwell_ms: Math.min(Math.max(input.dwellMs ?? 0, 0), MAX_DWELL_MS),
    });

    if (error) console.error('[analytics] 记录访问失败', error.message);
  } catch (error) {
    console.error('[analytics] 记录访问异常', error);
  }
}
