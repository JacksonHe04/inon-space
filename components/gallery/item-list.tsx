/* eslint-disable @next/next/no-img-element -- 封面来自 Supabase Storage，尺寸已由容器限定 */

import { SkeletonBar } from '@/components/skeleton';
import type { GalleryItem } from '@/lib/gallery/types';
import { cn } from '@/lib/utils';

/**
 * 收藏条目列表，带序号。
 *
 * 序号是**排位**，不是数据库里的 sort_order —— 后者是全局排序值
 * （0/2/4…，各分类穿插），直接拿出来当名次会跳号。
 */
export function GalleryItemList({ items }: { items: GalleryItem[] }) {
  return (
    <ol className="space-y-4">
      {items.map((item, index) => {
        const hasLink = item.link.startsWith('http');

        return (
          <li key={item.id} className="flex gap-4">
            <span className="text-muted-foreground w-7 shrink-0 pt-[3px] text-right text-[0.78rem] tabular-nums">
              {String(index + 1).padStart(2, '0')}
            </span>

            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt=""
                loading="lazy"
                className="border-border h-16 w-16 shrink-0 border object-cover"
              />
            ) : (
              <span aria-hidden className="border-border h-16 w-16 shrink-0 border" />
            )}

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2.5">
                {hasLink ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[0.92rem] font-medium"
                  >
                    {item.name}
                  </a>
                ) : (
                  <span className="text-[0.92rem] font-medium">{item.name}</span>
                )}
                {item.creator ? (
                  <span className="text-muted-foreground text-[0.8rem]">{item.creator}</span>
                ) : null}
              </div>

              {item.comment ? (
                <p className="text-muted-foreground mt-0.5 text-[0.82rem] leading-relaxed text-pretty">
                  {item.comment}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * 条目还没到时的占位，**与上面那个列表同构**：同一个序号列宽、同一个 64px 方块、
 * 同样的标题行 + 注释行。放在同一个文件里是为了让它跟着真实列表一起改 ——
 * 盒子一旦对不上，骨架换成内容的那一刻版面就会跳。
 *
 * 条数固定五条，标题与注释的长短各排一遍：每条都一样长会像表格，不像「条目在陆续到达」。
 */
const SKELETON_ROWS = [
  { title: 'w-[42%]', comment: 'w-[78%]' },
  { title: 'w-[56%]', comment: 'w-[64%]' },
  { title: 'w-[34%]', comment: 'w-[86%]' },
  { title: 'w-[48%]', comment: 'w-[70%]' },
  { title: 'w-[38%]', comment: 'w-[58%]' },
] as const;

export function GalleryItemListSkeleton() {
  return (
    <ol className="space-y-4" aria-hidden>
      {SKELETON_ROWS.map((row, index) => (
        <li key={row.title} className="flex gap-4">
          <span className="w-7 shrink-0 pt-[5px]">
            <SkeletonBar className="ml-auto h-2.5 w-4" delay={index * 120} />
          </span>

          <SkeletonBar className="h-16 w-16 shrink-0" delay={index * 120} />

          <div className="min-w-0 flex-1 space-y-2 pt-0.5">
            <SkeletonBar className={cn('h-3.5', row.title)} delay={index * 120} />
            <SkeletonBar className={cn('h-3', row.comment)} delay={index * 120} />
          </div>
        </li>
      ))}
    </ol>
  );
}
