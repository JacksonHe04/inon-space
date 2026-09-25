import { GALLERY_CATEGORY_IDS, type GalleryCategoryId } from '@/lib/content/types';
import type { GalleryItemKind, GalleryTabId } from '@/lib/gallery/types';

/**
 * GALLERY 二级 tab 的分栏规则。
 *
 * 音乐（INDIE/ROCK、HIPHOP）按「专辑 / 单曲 / 创作者」分，
 * 读书与影视按「作品 / 创作者」分 —— 数据库里的 work 在音乐下叫专辑、
 * 在别处叫作品，所以 subtype → tab 的映射是随分类变的，不是固定的。
 *
 * 分类名固定英文，tab 名走 labels（会随语言变）。
 */
export interface GalleryTab {
  id: GalleryTabId;
  /** Labels 里对应的字段名 */
  labelKey: 'galleryAlbums' | 'gallerySongs' | 'galleryWorks' | 'galleryCreators';
  /** 这个 tab 收 `library_items.subtype` 的哪一类 */
  kind: GalleryItemKind;
}

const MUSIC_TABS: readonly GalleryTab[] = [
  { id: 'albums', labelKey: 'galleryAlbums', kind: 'work' },
  { id: 'songs', labelKey: 'gallerySongs', kind: 'song' },
  { id: 'creators', labelKey: 'galleryCreators', kind: 'creator' },
];

const MEDIA_TABS: readonly GalleryTab[] = [
  { id: 'works', labelKey: 'galleryWorks', kind: 'work' },
  { id: 'creators', labelKey: 'galleryCreators', kind: 'creator' },
];

/** 音乐的两个分类：有「单曲」这一层的就是音乐 */
const MUSIC_CATEGORIES: readonly GalleryCategoryId[] = ['indie-rock', 'hiphop'];

/** URL 段是不是一个真的分类 —— 分类页和分栏页都要挡这个，别各写一遍 */
export function isGalleryCategory(value: string): value is GalleryCategoryId {
  return (GALLERY_CATEGORY_IDS as readonly string[]).includes(value);
}

export function galleryTabs(category: GalleryCategoryId): readonly GalleryTab[] {
  return MUSIC_CATEGORIES.includes(category) ? MUSIC_TABS : MEDIA_TABS;
}

export function findGalleryTab(
  category: GalleryCategoryId,
  tabId: string
): GalleryTab | undefined {
  return galleryTabs(category).find((tab) => tab.id === tabId);
}

export function isGalleryTabId(category: GalleryCategoryId, value: string): boolean {
  return findGalleryTab(category, value) !== undefined;
}

/** 进分类时落到哪个 tab —— 始终是第一个，避免「同一内容两个 URL」 */
export function defaultGalleryTab(category: GalleryCategoryId): GalleryTab {
  return galleryTabs(category)[0];
}
