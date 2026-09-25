'use client';

import { useRouter } from 'next/navigation';
import type { Locale } from '@/lib/content/types';
import { LOCALES, LOCALE_COOKIE } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const LABELS: Record<Locale, string> = {
  zh: '中',
  en: 'EN',
};

const ONE_YEAR = 60 * 60 * 24 * 365;

/** 写 cookie 这一步放在组件外：React Compiler 不允许在渲染逻辑里改全局对象 */
function persistLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=${ONE_YEAR};samesite=lax`;
}

/**
 * 语言切换：写 cookie 后刷新服务端组件。
 * 不改 URL —— 地址栏始终保持原样，这是刻意的。
 *
 * 只有一个语言时不渲染；等 'en' 进了 LOCALES 会自动出现。
 */
export function LocaleSwitch({ current }: { current: Locale }) {
  const router = useRouter();

  // 只有一种语言时没有可切的目标，整块不渲染
  if (LOCALES.length < 2) return null;

  function pick(next: Locale) {
    if (next === current) return;
    persistLocale(next);
    router.refresh();
  }

  return (
    <div className="text-muted-foreground flex items-center gap-2 text-[0.7rem] tracking-wider uppercase">
      {LOCALES.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => pick(locale)}
          className={cn(
            'transition-colors',
            locale === current ? 'text-foreground font-semibold' : 'hover:text-foreground'
          )}
        >
          {LABELS[locale] ?? locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
