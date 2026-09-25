import { unstable_cache } from 'next/cache';

import type { GalleryCategoryId } from '@/lib/content/types';
import type { GalleryItem, GalleryItemKind } from '@/lib/gallery/types';
import { getSupabaseServerClient } from '@/lib/supabase/server';

/**
 * GALLERY 的条目存在数据库里 —— 它会持续增长，不适合放进内容文件。
 * 内容文件只负责「有哪四类」，条目本身一律从这里取。
 */

interface LibraryItemRow {
  id: string;
  subtype: string;
  name: string;
  creator: string;
  comment: string;
  link: string;
  image_url: string | null;
}

const KINDS: readonly string[] = ['work', 'song', 'creator'];

function toKind(value: string): GalleryItemKind {
  return KINDS.includes(value) ? (value as GalleryItemKind) : 'work';
}

/** 收藏条目的变化频率是「天」级，缓存一小时足够 */
const REVALIDATE_SECONDS = 3600;

/**
 * 需要立刻看到改动时用它失效：`revalidateTag(GALLERY_CACHE_TAG)`
 */
export const GALLERY_CACHE_TAG = 'library-items';

/**
 * 取一个分类下的全部条目，已按 sort_order 排好。
 *
 * 分栏（专辑 / 单曲 / 创作者）由页面按 kind 过滤 —— 取数这层不掺和 UI 怎么摆，
 * 因为它不知道音乐和读书对同一类东西的叫法不一样。
 *
 * **缓存落在这一层是刻意的**：页面读 cookie 取语言，所以整站都是按请求渲染的，
 * 页面级 `revalidate` 在动态路由上不生效。想省掉每次请求都打一次 Supabase，
 * 只能把缓存下沉到这里。改回页面级 revalidate 是无效的，只会让人误判。
 */
export const fetchGalleryItems = unstable_cache(
  async (category: GalleryCategoryId): Promise<GalleryItem[]> => {
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from('library_items')
      .select('id, subtype, name, creator, comment, link, image_url')
      .eq('category', category)
      .order('sort_order', { ascending: true });

    if (error) throw error;

    return ((data ?? []) as LibraryItemRow[]).map((row) => ({
      id: row.id,
      kind: toKind(row.subtype),
      name: row.name,
      creator: row.creator,
      comment: row.comment,
      link: row.link,
      imageUrl: row.image_url,
    }));
  },
  ['gallery-items'],
  { revalidate: REVALIDATE_SECONDS, tags: [GALLERY_CACHE_TAG] }
);
