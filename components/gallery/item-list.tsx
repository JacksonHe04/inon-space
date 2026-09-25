/* eslint-disable @next/next/no-img-element -- 封面来自 Supabase Storage，尺寸已由容器限定 */

import type { GalleryItem } from '@/lib/gallery/types';

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
