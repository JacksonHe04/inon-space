import { notFound, redirect } from 'next/navigation';

import { defaultGalleryTab, isGalleryCategory } from '@/lib/gallery/tabs';
import { ROUTES } from '@/lib/i18n';

interface GalleryCategoryPageProps {
  params: Promise<{ category: string }>;
}

/** 分类本身不是终点，落到它的第一个分栏 */
export default async function GalleryCategoryPage({ params }: GalleryCategoryPageProps) {
  const { category } = await params;
  if (!isGalleryCategory(category)) notFound();

  redirect(`${ROUTES.gallery}/${category}/${defaultGalleryTab(category).id}`);
}
