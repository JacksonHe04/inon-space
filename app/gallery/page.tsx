import { redirect } from 'next/navigation';

import { GALLERY_CATEGORY_IDS } from '@/lib/content/types';
import { defaultGalleryTab } from '@/lib/gallery/tabs';
import { ROUTES } from '@/lib/i18n';

/**
 * 收藏没有「总览」这一层：进来就落到第一个分类的第一个分栏。
 * 这里只做跳转，不渲染内容 —— 否则同一批条目会有两个 URL。
 */
export default function GalleryIndexPage() {
  const category = GALLERY_CATEGORY_IDS[0];
  redirect(`${ROUTES.gallery}/${category}/${defaultGalleryTab(category).id}`);
}
