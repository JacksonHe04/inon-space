import type { MetadataRoute } from 'next';

import { GALLERY_CATEGORY_IDS } from '@/lib/content/types';
import { galleryTabs } from '@/lib/gallery/tabs';
import { ROUTES } from '@/lib/i18n';
import { SITE_URL } from '@/lib/site-meta';

/**
 * sitemap.xml。
 *
 * **只列真正会渲染内容的地址。** `/gallery` 与 `/gallery/<category>` 都只是跳转，
 * 把跳转地址写进 sitemap 等于请搜索引擎去抓一堆 307，没有好处。
 *
 * 分栏从 `galleryTabs()` 推导而不是手写：分类和分栏本来就是那两处定义的，
 * 手抄一份迟早与页面上的链接对不上。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const galleryPages = GALLERY_CATEGORY_IDS.flatMap((category) =>
    galleryTabs(category).map((tab) => `${ROUTES.gallery}/${category}/${tab.id}`)
  );

  return [ROUTES.home, ROUTES.life, ...galleryPages].map((path) => ({
    url: `${SITE_URL}${path}`,
  }));
}
