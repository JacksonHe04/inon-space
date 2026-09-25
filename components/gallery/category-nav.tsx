import Link from 'next/link';
import type { GalleryCategory, GalleryCategoryId } from '@/lib/content/types';
import { cn } from '@/lib/utils';

/**
 * GALLERY 的一级分类：当前那一个就是**这一页的标题**。
 *
 * 之前分类导航下面还单独渲染一行 `<h1>HIPHOP</h1>`，而分类导航里 HIPHOP 本来就是
 * 高亮的那一个 —— 同一个词在一屏里出现两遍，纯属重复。所以把两者并成一行：
 * 选中的分类按标题的字号渲染，其余仍是小字链接。
 *
 * 分类顺序保持不变。把选中的那个提到最前面会让每次切分类时整行重排，看着更乱。
 *
 * 标题放在 nav 里面确实不常见，但这里它就是这个列表的标题 —— 拆到外面就又变成两行了。
 */
export function GalleryCategoryNav({
  categories,
  current,
}: {
  categories: GalleryCategory[];
  current: GalleryCategoryId;
}) {
  return (
    <nav className="border-border flex flex-wrap items-baseline gap-x-5 gap-y-2 border-b pb-3">
      {categories.map((category) =>
        category.id === current ? (
          <h1
            key={category.id}
            className="text-[1.3rem] font-semibold tracking-[0.02em]"
            aria-current="page"
          >
            {category.name}
          </h1>
        ) : (
          <Link
            key={category.id}
            href={`/gallery/${category.id}`}
            className={cn(
              'text-[0.72rem] tracking-[0.14em] uppercase no-underline transition-colors',
              'text-muted-foreground hover:text-foreground hover:no-underline'
            )}
          >
            {category.name}
          </Link>
        )
      )}
    </nav>
  );
}
