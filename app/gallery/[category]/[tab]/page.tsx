import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PageContainer, ReadingColumn } from '@/components/container';
import { GalleryCategoryNav } from '@/components/gallery/category-nav';
import { GalleryItemList, GalleryItemListSkeleton } from '@/components/gallery/item-list';
import { GalleryTabNav } from '@/components/gallery/tab-nav';
import { getRequestContent } from '@/lib/content/server';
import type { GalleryCategoryId } from '@/lib/content/types';
import { fetchGalleryItems } from '@/lib/gallery/queries';
import { findGalleryTab, isGalleryCategory } from '@/lib/gallery/tabs';
import type { GalleryItem, GalleryItemKind } from '@/lib/gallery/types';
import { ROUTES } from '@/lib/i18n';

// 这里**不要**写 `revalidate`：页面读 cookie 取语言，必然是动态渲染，页面级 revalidate 不生效。
// 收藏条目的缓存落在 lib/gallery/queries.ts 的 unstable_cache 里。

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
  const tabName = content.labels[activeTab.labelKey];

  return {
    title: [content.nav.gallery, categoryName, tabName].filter(Boolean).join(' · '),
    description: `${[categoryName, tabName].filter(Boolean).join(' · ')} — ${content.identity.tagline}`,
    // 每个分栏都有自己的地址，canonical 指自己而不是指分类 —— 它们内容不同
    alternates: { canonical: `${ROUTES.gallery}/${category}/${activeTab.id}` },
  };
}

/**
 * 桌面端这一页**不居中**，跟着顶栏走。
 *
 * 一级分类那行与顶栏的四个 tab 是同一档字号、同一种小型大写，两者相距不到一百像素；
 * 一个居中一个居左，两排字的左边缘对不上，看着就是没对齐。所以外层走与顶栏同一个
 * PageContainer，第一个分类的左端与顶栏 HOME 的左端落在同一条竖线上。
 *
 * 条目列表则收到 `max-w-3xl`：一行铺满 1152px 就太长了，眼睛回行会累。
 * 收窄之后整块仍然贴着左边缘 —— 这是「偏左」而不是「居中」。
 *
 * 分类导航底下那条横线跟着容器走全宽，与顶栏那条线等长且平行，像一页的版心线；
 * 内容里的线（含 LIFE 页 Section 的分隔线）只跟着内容列的宽度走。
 */
export default async function GalleryTabPage({ params }: GalleryTabPageProps) {
  const { category, tab } = await params;
  if (!isGalleryCategory(category)) notFound();

  const activeTab = findGalleryTab(category, tab);
  if (!activeTab) notFound();

  const { content } = await getRequestContent();
  const { labels } = content;

  return (
    <PageContainer className="pt-8 pb-12 lg:pt-10 lg:pb-16">
      {/* 分类导航自己带标题：选中的分类就按标题渲染，这里不再单独占一行 */}
      <GalleryCategoryNav categories={content.gallery} current={category} />

      <div className="mt-6">
        <GalleryTabNav category={category} current={activeTab.id} labels={labels} />
      </div>

      <ReadingColumn className="mt-8">
        {/*
          分类与分栏都由内容文件驱动，不等数据库 —— 所以整页的导航先出来，
          只有条目那一块在等。切换分栏时同理：导航纹丝不动，换的只是下面的列表。
        */}
        <Suspense fallback={<GalleryItemListSkeleton />}>
          <GalleryItems
            category={category}
            kind={activeTab.kind}
            emptyLabel={labels.galleryEmpty}
          />
        </Suspense>
      </ReadingColumn>
    </PageContainer>
  );
}

/**
 * 条目单独一层，为的是能把它放进 Suspense 边界里 —— 与首页的 ChatPanel 同一个理由：
 * 跨区域查一次 Supabase 是整页最慢的一步，摆在页面顶层 await 就等于整页一起等，
 * 白屏期间连分类导航都看不见。
 *
 * 淡入是给「切分栏」用的：预取让新内容几乎瞬间就到，没有过渡的话整块会硬生生换掉。
 */
async function GalleryItems({
  category,
  kind,
  emptyLabel,
}: {
  category: GalleryCategoryId;
  kind: GalleryItemKind;
  emptyLabel: string;
}) {
  // 数据库不可用时退化成空态，而不是整页 500
  let items: GalleryItem[] = [];
  try {
    items = await fetchGalleryItems(category);
  } catch (error) {
    console.error('[gallery] 条目加载失败', error);
  }

  // 分栏在这一层做：取数那层不知道音乐与读书对同一类东西的叫法不一样
  const visible = items.filter((item) => item.kind === kind);

  return (
    <div className="animate-in fade-in duration-300">
      {visible.length === 0 ? (
        <p className="text-muted-foreground text-[0.88rem]">{emptyLabel}</p>
      ) : (
        <GalleryItemList items={visible} />
      )}
    </div>
  );
}
