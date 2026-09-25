import { cookies } from 'next/headers';

import { getContent } from '@/lib/content';
import type { Content, Locale } from '@/lib/content/types';
import { DEFAULT_LOCALE, LOCALES, LOCALE_COOKIE, resolveLocale } from '@/lib/i18n';

/**
 * 服务端读语言：来源是 cookie，不是 URL。
 *
 * 只有一种语言时不读 cookie —— 读 cookie 会让整站退化成动态渲染，
 * 而这时候读与不读的结果完全一样。等第二种语言进来会自动开始读。
 */
export async function getRequestLocale(): Promise<Locale> {
  if (LOCALES.length < 2) return DEFAULT_LOCALE;

  const store = await cookies();
  return resolveLocale(store.get(LOCALE_COOKIE)?.value);
}

/**
 * 页面里取内容的唯一入口。
 * 页面都是 Server Component，所以内容在服务端就渲染进 HTML，首屏没有额外请求。
 */
export async function getRequestContent(): Promise<{ locale: Locale; content: Content }> {
  const locale = await getRequestLocale();
  return { locale, content: getContent(locale) };
}
