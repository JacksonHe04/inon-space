import { contentEn } from '@/data/content.en';
import { contentZh } from '@/data/content.zh';
import type { Content, Locale } from '@/lib/content/types';
import { DEFAULT_LOCALE } from '@/lib/i18n';

/**
 * 站点全部静态内容的唯一入口。
 *
 * 新增语言 = 在这里加一行 + 新建 data/content.<locale>.ts，
 * 组件里不得出现任何硬编码文案。
 * 未注册的语言自动回落到默认语言，不会 404。
 */
const CONTENT: Partial<Record<Locale, Content>> = {
  zh: contentZh,
  en: contentEn,
};

export function getContent(locale: Locale = DEFAULT_LOCALE): Content {
  const found = CONTENT[locale] ?? CONTENT[DEFAULT_LOCALE];
  if (!found) {
    throw new Error(`缺少内容文件：${locale}（且默认语言 ${DEFAULT_LOCALE} 未注册）`);
  }
  return found;
}

export type { Content, Locale };
