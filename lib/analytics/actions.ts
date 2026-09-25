'use server';

import { headers } from 'next/headers';

import {
  extractClientIp,
  extractReferrerDomain,
  getIpSalt,
  hashIp,
  parseUserAgent,
} from '@/lib/analytics/hash';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { SITE_PROFILE_ID, SITE_VIEW_EVENT } from '@/lib/site-meta';

/**
 * 记一次访问。
 *
 * 只记录、不返回任何东西，也**从不抛错**：统计是副产品，不该让任何人因为
 * 统计失败而看不到页面。失败只写服务端日志。
 *
 * 写库走服务端密钥：`page_view_events` 对匿名是 deny-all，
 * 而事件里带着哈希后的 IP，不能由浏览器直接写。
 */
export async function recordSiteView(urlPath: string): Promise<void> {
  try {
    const requestHeaders = await headers();
    const userAgent = requestHeaders.get('user-agent') ?? '';
    const { device_type, browser, os } = parseUserAgent(userAgent);

    const supabase = getSupabaseServerClient();
    const { error } = await supabase.rpc('page_view_record', {
      p_profile_id: SITE_PROFILE_ID,
      p_event_name: SITE_VIEW_EVENT,
      p_url_path: urlPath.slice(0, 256),
      p_referrer: extractReferrerDomain(requestHeaders.get('referer')),
      p_country: (requestHeaders.get('x-vercel-ip-country') ?? '').slice(0, 8),
      p_device_type: device_type,
      p_browser: browser,
      p_os: os,
      p_ip_hash: hashIp(extractClientIp(requestHeaders), getIpSalt()),
      p_user_agent: userAgent.slice(0, 512),
    });

    if (error) console.error('[analytics] 记录访问失败', error.message);
  } catch (error) {
    console.error('[analytics] 记录访问异常', error);
  }
}
