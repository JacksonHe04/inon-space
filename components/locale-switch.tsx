'use client';

import { useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';

import type { Labels, Locale } from '@/lib/content/types';
import { LOCALES, LOCALE_COOKIE } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const ONE_YEAR = 60 * 60 * 24 * 365;

/** 写 cookie 这一步放在组件外：React Compiler 不允许在渲染逻辑里改全局对象 */
function persistLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=${ONE_YEAR};samesite=lax`;
}

/**
 * 语言切换。
 *
 * 不写成「中 / EN」—— 那是在显示「当前语言叫什么」，而访客要的是「换个语言」这个动作，
 * 还得先看懂缩写才知道能点。地球图标本身就是国际化的通用符号，点一下就换。
 *
 * 尺寸与相邻的主题切换按钮保持一致：同一个位置上的两个控件长得不一样会很扎眼。
 * 语言多于两种时这里要改成菜单，两三种用循环点击是合理的。
 */
export function LocaleSwitch({ current, labels }: { current: Locale; labels: Labels }) {
  const router = useRouter();

  // 只有一种语言时没有可切的目标，整块不渲染
  if (LOCALES.length < 2) return null;

  function cycle() {
    const next = LOCALES[(LOCALES.indexOf(current) + 1) % LOCALES.length];
    persistLocale(next);
    router.refresh();
  }

  return (
    <button
      type="button"
      aria-label={labels.switchLanguage}
      onClick={cycle}
      className={cn(
        'text-muted-foreground hover:text-foreground inline-flex size-6 cursor-pointer items-center justify-center',
        'transition-colors'
      )}
    >
      <Globe className="size-3.5" aria-hidden />
    </button>
  );
}
