'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';

import { LocaleSwitch } from '@/components/locale-switch';
import { ThemeToggle } from '@/components/theme-toggle';
import type { Labels, Locale, Nav } from '@/lib/content/types';
import { NAV_ORDER, ROUTES, type RouteKey } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface SiteHeaderProps {
  locale: Locale;
  labels: Labels;
  nav: Nav;
  worldHref: string;
}

const navItemClass =
  'text-[0.72rem] tracking-[0.14em] uppercase no-underline transition-colors hover:no-underline';

/**
 * 首页不预取，其余站内页都预取。
 *
 * 本站每个路由都是动态的（语言存在 cookie 里），Next 对动态路由**默认不预取、也不进客户端
 * 缓存** —— 实测每点一次 tab 都要等 ~400ms 服务端往返，换来的是整块内容突兀地被替换。
 * 打开 prefetch 后，链接一进视口就把 RSC 载荷取好，点击是瞬时的。
 *
 * 首页不能这么做：它带着群聊的首屏快照，缓存下来的话，回访时会「回放」成旧快照，
 * 而 Realtime 只推新增消息、不补历史，中间那几条就永远看不到了。宁可让它慢一点，也要它是对的。
 */
const FRESH_ROUTES: readonly RouteKey[] = ['home'];

export function SiteHeader({ locale, labels, nav, worldHref }: SiteHeaderProps) {
  const pathname = usePathname();

  return (
    /*
     * 顶栏常驻：sticky 而不是 fixed，这样它仍然占位，页面内容不会被它盖住。
     * 半透明 + 模糊是必要的 —— 底下的正文会从它下面滑过，不糊一层会打架。
     */
    <header className="border-border bg-background/85 sticky top-0 z-40 border-b backdrop-blur-md">
      {/*
        单行不换行：导航本身会缩，右侧那组控件不缩（shrink-0）。
        之前移动端会换行，是因为整体 flex-wrap 且没有约束，右侧那组被挤到第二行。
      */}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4 sm:px-8">
        <nav className="flex min-w-0 items-center gap-x-4 sm:gap-x-5">
          {NAV_ORDER.map((key) => {
            const href = ROUTES[key];
            const active = key === 'home' ? pathname === href : pathname.startsWith(href);

            return (
              <Link
                key={key}
                href={href}
                prefetch={!FRESH_ROUTES.includes(key)}
                className={cn(
                  navItemClass,
                  'shrink-0',
                  active
                    ? 'text-foreground font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
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
              'text-muted-foreground hover:text-foreground inline-flex shrink-0 items-center gap-0.5'
            )}
          >
            {nav.world}
            <ArrowUpRight className="size-3" aria-hidden />
          </a>
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <LocaleSwitch current={locale} labels={labels} />
          <ThemeToggle labels={labels} />
        </div>
      </div>
    </header>
  );
}
