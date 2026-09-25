import Link from 'next/link';

import type { GalleryCategoryId, Labels } from '@/lib/content/types';
import { galleryTabs } from '@/lib/gallery/tabs';
import type { GalleryTabId } from '@/lib/gallery/types';
import { ROUTES } from '@/lib/i18n';
import { cn } from '@/lib/utils';

/**
 * GALLERY 的二级分栏：音乐是「专辑 / 单曲 / 创作者」，读书影视是「作品 / 创作者」。
 *
 * 一级是分类（固定英文），二级是中文小字 —— 两层字号和字距都不同，
 * 不然并排看会以为是同一层。
 */
export function GalleryTabNav({
  category,
  current,
  labels,
}: {
  category: GalleryCategoryId;
  current: GalleryTabId;
  labels: Labels;
}) {
  return (
    <nav className="flex flex-wrap gap-x-5 gap-y-2">
      {galleryTabs(category).map((tab) => (
        <Link
          key={tab.id}
          href={`${ROUTES.gallery}/${category}/${tab.id}`}
          className={cn(
            'text-[0.85rem] no-underline transition-colors hover:no-underline',
            tab.id === current
              ? 'text-foreground font-medium underline decoration-1 underline-offset-4'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {labels[tab.labelKey]}
        </Link>
      ))}
    </nav>
  );
}
