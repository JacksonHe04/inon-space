import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { GalleryCategoryNav } from '@/components/gallery/category-nav';
import { GalleryItemList } from '@/components/gallery/item-list';
import { GalleryTabNav } from '@/components/gallery/tab-nav';
import { getRequestContent } from '@/lib/content/server';
import { fetchGalleryItems } from '@/lib/gallery/queries';
import { findGalleryTab, isGalleryCategory } from '@/lib/gallery/tabs';
import type { GalleryItem } from '@/lib/gallery/types';

// 收藏条目变化频率是「天」级，缓存一小时足够
export const revalidate = 3600;

interface GalleryTabPageProps {
  params: Promise<{ category: string; tab: string }>;
}

export async function generateMetadata({ params }: GalleryTabPageProps): Promise<Metadata> {
  const { category, tab } = await params;
  if (!isGalleryCategory(category)) return {};

  const activeTab = findGalleryTab(category, tab);
  if (!activeTab) return {};

  const { content } = await getRequestContent();
  const categoryName = content.gallery.find((item) => item.id === category)?.name;

  return {
    title: [content.nav.gallery, categoryName, content.labels[activeTab.labelKey]]
      .filter(Boolean)
      .join(' · '),
  };
}

export default async function GalleryTabPage({ params }: GalleryTabPageProps) {
  const { category, tab } = await params;
  if (!isGalleryCategory(category)) notFound();

  const activeTab = findGalleryTab(category, tab);
  if (!activeTab) notFound();

  const { content } = await getRequestContent();
  const { labels } = content;
  const categoryName = content.gallery.find((item) => item.id === category)?.name ?? category;

  // 数据库不可用时退化成空态，而不是整页 500
  let items: GalleryItem[] = [];
  try {
    items = await fetchGalleryItems(category);
  } catch (error) {
    console.error('[gallery] 条目加载失败', error);
  }

  // 分栏在这一层做：取数那层不知道音乐与读书对同一类东西的叫法不一样
  const visible = items.filter((item) => item.kind === activeTab.kind);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 sm:px-8 lg:py-16">
      <GalleryCategoryNav categories={content.gallery} current={category} />

      <h1 className="mt-8 text-[1.3rem] font-semibold tracking-[0.02em]">{categoryName}</h1>

      <div className="mt-5">
        <GalleryTabNav category={category} current={activeTab.id} labels={labels} />
      </div>

      <div className="mt-8">
        {visible.length === 0 ? (
          <p className="text-muted-foreground text-[0.88rem]">{labels.galleryEmpty}</p>
        ) : (
          <GalleryItemList items={visible} />
        )}
      </div>
    </div>
  );
}
