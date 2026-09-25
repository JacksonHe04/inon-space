import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/site-meta';

/**
 * robots.txt。
 *
 * `/api/` 整段挡掉：那里只有群聊的读写接口，对爬虫没有任何意义，
 * 被爬到只会白白消耗函数调用与模型费用。
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
