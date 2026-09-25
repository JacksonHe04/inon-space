import type { Locale } from '@/lib/content/types';

/**
 * 站点语言。
 *
 * 语言存在 cookie 里，不体现在 URL 上 —— 切语言时不跳转、不改地址栏。
 * 服务端用 `getRequestLocale()`（见 lib/content/server.ts）读取，因此页面是 SSR 的。
 *
 * 新增英文版要做三件事：
 *   1. 'en' 加进 LOCALES
 *   2. 新建 data/content.en.ts
 *   3. 在 lib/content/index.ts 的 CONTENT 里注册
 * 顶栏的语言切换器会自动出现，其他代码不用动。
 */
export const LOCALES = ['zh', 'en'] as const satisfies readonly Locale[];

export const DEFAULT_LOCALE: Locale = 'zh';

export const LOCALE_COOKIE = 'inon_locale';

/** 站内路由。HOME 与 WORLD 之外每个 tab 都有自己的路由 */
export const ROUTES = {
  home: '/',
  life: '/life',
  gallery: '/gallery',
} as const;

export type RouteKey = keyof typeof ROUTES;

export const NAV_ORDER: RouteKey[] = ['home', 'life', 'gallery'];

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** 未知或缺失的语言一律回落到默认语言，不报错、不 404 */
export function resolveLocale(value: string | undefined | null): Locale {
  return value && isLocale(value) ? value : DEFAULT_LOCALE;
}

/** <html lang> 用的 BCP-47 标签 */
export function htmlLang(locale: Locale): string {
  return locale === 'zh' ? 'zh-CN' : 'en';
}
