/**
 * GALLERY 的数据形状。
 *
 * 单独放一个文件是因为它同时被「取数」（queries.ts）和「分栏配置」（tabs.ts）用到，
 * 谁都不该拥有它。
 */

/** 对应 `library_items.subtype`。同一张表里 work 在音乐下是专辑、在读书下是作品 */
export type GalleryItemKind = 'work' | 'song' | 'creator';

export interface GalleryItem {
  id: string;
  kind: GalleryItemKind;
  name: string;
  /** 作者 / 歌手 / 导演。creator 类型的条目此字段为空，名字本身在 name 里 */
  creator: string;
  comment: string;
  link: string;
  imageUrl: string | null;
}

/** GALLERY 的二级 tab。歌单里的「专辑 / 单曲 / 创作者」，读书影视里的「作品 / 创作者」 */
export type GalleryTabId = 'albums' | 'songs' | 'works' | 'creators';
