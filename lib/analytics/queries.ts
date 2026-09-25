import { unstable_cache } from 'next/cache';

import { getSupabaseServerClient } from '@/lib/supabase/server';
import { SITE_PROFILE_ID, SITE_VIEW_EVENT } from '@/lib/site-meta';

export interface SiteViewTotals {
  /** 累计浏览量 */
  pv: number;
  /** 累计访客数：按 ip_hash 去重 */
  uv: number;
}

const CACHE_TAG = 'site-view-totals';

/** 底栏那个数字不需要实时，五分钟足够，也免得每次请求都去读一次事件表 */
const REVALIDATE_SECONDS = 300;

/**
 * 底栏的访问统计。
 *
 * 走 `page_view_site_totals` 而不是现成的 `page_view_totals`：后者读的是按
 * (profile_id, stat_date) 归并的日聚合表，而 world.inon.space 与本站在同一个 profile 下，
 * 两个站的流量会混在一起。这里按事件名读原始事件流，只数本站自己的。
 *
 * 数据库不可用时返回 0 而不是抛错 —— 底栏少一个数字不该让整页挂掉。
 */
export const getSiteViewTotals = unstable_cache(
  async (): Promise<SiteViewTotals> => {
    try {
      const supabase = getSupabaseServerClient();
      const { data, error } = await supabase.rpc('page_view_site_totals', {
        p_profile_id: SITE_PROFILE_ID,
        p_event_name: SITE_VIEW_EVENT,
      });

      if (error) throw error;

      const row = (data ?? [])[0] as { total_pv?: number; total_uv?: number } | undefined;
      return { pv: Number(row?.total_pv ?? 0), uv: Number(row?.total_uv ?? 0) };
    } catch (error) {
      console.error('[analytics] 读取访问统计失败', error);
      return { pv: 0, uv: 0 };
    }
  },
  ['site-view-totals'],
  { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAG] }
);
