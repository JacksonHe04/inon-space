import Link from 'next/link';
import type { GalleryCategory, GalleryCategoryId } from '@/lib/content/types';
import { cn } from '@/lib/utils';

/**
 * GALLERY 的一级分类：当前那一个就是**这一页的标题**。
 *
 * 之前分类导航下面还单独渲染一行 `<h1>HIPHOP</h1>`，而分类导航里 HIPHOP 本来就是
 * 高亮的那一个 —— 同一个词在一屏里出现两遍，纯属重复。所以把两者并成一行，
 * 选中项保留 `<h1>`，但**不放大字号**。
 *
 * 字号刻意与顶栏的四个 tab 同档（0.72rem）：这一行的正上方就是顶栏，
 * 两排文字相隔不到一百像素，字号一旦不同就会互相打架。层级改用字重与颜色表达，
 * 和顶栏标记当前 tab 的方式一致。
 *
 * 分类顺序保持不变。把选中的那个提到最前面会让每次切分类时整行重排，看着更乱。
 */
export function GalleryCategoryNav({
  categories,
  current,
}: {
  categories: GalleryCategory[];
  current: GalleryCategoryId;
}) {
  const itemClass =
    'text-[0.72rem] tracking-[0.14em] uppercase no-underline transition-colors';

  return (
    <nav className="border-border flex flex-wrap items-baseline gap-x-5 gap-y-2 border-b pb-2.5">
      {categories.map((category) =>
        category.id === current ? (
          <h1
            key={category.id}
            className={cn(itemClass, 'text-foreground font-semibold')}
            aria-current="page"
          >
            {category.name}
          </h1>
        ) : (
          <Link
            key={category.id}
            href={`/gallery/${category.id}`}
            prefetch
            className={cn(itemClass, 'text-muted-foreground hover:text-foreground hover:no-underline')}
          >
            {category.name}
          </Link>
        )
      )}
    </nav>
  );
}
