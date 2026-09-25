import Link from 'next/link';
import type { GalleryCategory, GalleryCategoryId } from '@/lib/content/types';
import { cn } from '@/lib/utils';

export function GalleryCategoryNav({
  categories,
  current,
}: {
  categories: GalleryCategory[];
  current: GalleryCategoryId;
}) {
  return (
    <nav className="border-border flex flex-wrap gap-x-6 gap-y-2 border-b pb-3">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/gallery/${category.id}`}
          className={cn(
            'text-[0.72rem] tracking-[0.14em] uppercase no-underline transition-colors hover:no-underline',
            category.id === current
              ? 'text-foreground font-semibold'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {category.name}
        </Link>
      ))}
    </nav>
  );
}
