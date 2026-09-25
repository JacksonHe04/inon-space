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

/**
 * 取一个分类下的全部条目，已按 sort_order 排好。
 *
 * 分栏（专辑 / 单曲 / 创作者）由页面按 kind 过滤 —— 取数这层不掺和 UI 怎么摆，
 * 因为它不知道音乐和读书对同一类东西的叫法不一样。
 */
export async function fetchGalleryItems(category: GalleryCategoryId): Promise<GalleryItem[]> {
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
}
