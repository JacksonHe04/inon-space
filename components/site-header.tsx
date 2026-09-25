'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronDown } from 'lucide-react';

import { LocaleSwitch } from '@/components/locale-switch';
import { ThemeToggle } from '@/components/theme-toggle';
import type { GalleryCategory, Labels, Locale, Nav } from '@/lib/content/types';
import { NAV_ORDER, ROUTES } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface SiteHeaderProps {
  locale: Locale;
  labels: Labels;
  nav: Nav;
  worldHref: string;
  gallery: GalleryCategory[];
}

const navItemClass =
  'text-[0.72rem] tracking-[0.14em] uppercase no-underline transition-colors hover:no-underline';

export function SiteHeader({ locale, labels, nav, worldHref, gallery }: SiteHeaderProps) {
  const pathname = usePathname();
  const [galleryOpen, setGalleryOpen] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);

  // 点空白处或按 Esc 收起
  useEffect(() => {
    if (!galleryOpen) return;

    function onPointerDown(event: PointerEvent) {
      if (!galleryRef.current?.contains(event.target as Node)) setGalleryOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setGalleryOpen(false);
    }

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [galleryOpen]);

  return (
    <header className="border-border border-b">
      <div className="mx-auto flex max-w-6xl flex-wrap items-baseline gap-x-7 gap-y-2 px-6 py-5 sm:px-8">
        <nav className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
          {NAV_ORDER.map((key) => {
            const href = ROUTES[key];
            const active = key === 'home' ? pathname === href : pathname.startsWith(href);
            const activeClass = active
              ? 'text-foreground font-semibold'
              : 'text-muted-foreground hover:text-foreground';

            // GALLERY 拆成两个热区：文字进分类总览，右侧箭头只管展开
            if (key === 'gallery' && gallery.length > 0) {
              return (
                <div key={key} ref={galleryRef} className="relative flex items-baseline gap-0.5">
                  {/* 点进分类总览后菜单要收起，否则它挂在刚打开的页面上方 */}
                  <Link href={href} onClick={() => setGalleryOpen(false)} className={cn(navItemClass, activeClass)}>
                    {nav[key]}
                  </Link>
                  <button
                    type="button"
                    aria-expanded={galleryOpen}
                    aria-label={nav[key]}
                    onClick={() => setGalleryOpen((open) => !open)}
                    className={cn('inline-flex cursor-pointer items-center', activeClass)}
                  >
                    <ChevronDown
                      className={cn(
                        'size-3 transition-transform duration-150',
                        galleryOpen && 'rotate-180'
                      )}
                      aria-hidden
                    />
                  </button>

                  {galleryOpen ? (
                    <div className="border-border bg-background absolute top-full left-0 z-50 mt-2 min-w-36 border py-1">
                      {gallery.map((category) => (
                        <Link
                          key={category.id}
                          href={`${ROUTES.gallery}/${category.id}`}
                          onClick={() => setGalleryOpen(false)}
                          className={cn(
                            navItemClass,
                            'block px-3 py-1.5',
                            pathname.startsWith(`${ROUTES.gallery}/${category.id}`)
                              ? 'text-foreground font-semibold'
                              : 'text-muted-foreground hover:text-foreground'
                          )}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            }

            return (
              <Link key={key} href={href} className={cn(navItemClass, activeClass)}>
                {nav[key]}
              </Link>
            );
          })}

          {/* 离站，与站内项视觉上区分开 */}
          <a
            href={worldHref}
            target="_blank"
            rel="noreferrer"
            className={cn(
              navItemClass,
              'text-muted-foreground hover:text-foreground inline-flex items-baseline gap-0.5'
            )}
          >
            {nav.world}
            <ArrowUpRight className="size-3" aria-hidden />
          </a>
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <LocaleSwitch current={locale} />
          <ThemeToggle labels={labels} />
        </div>
      </div>
    </header>
  );
}
