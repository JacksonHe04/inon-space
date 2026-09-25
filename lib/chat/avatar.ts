/**
 * 头像不存图片，只存一个 seed，渲染时确定性推导出「一个颜色 + 一个图形」。
 * 同一个 seed 永远得到同一个头像，刷新、换设备、换语言都不变。
 */

export const AVATAR_SHAPES = [
  'circle',
  'square',
  'diamond',
  'triangle',
  'hexagon',
  'quarter',
] as const;

export type AvatarShape = (typeof AVATAR_SHAPES)[number];

export interface AvatarSpec {
  hue: number;
  shape: AvatarShape;
}

/** FNV-1a：短、稳定、够散，不需要密码学强度 */
function hash(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function avatarFromSeed(seed: string): AvatarSpec {
  const h = hash(seed);
  return {
    hue: h % 360,
    shape: AVATAR_SHAPES[(h >>> 9) % AVATAR_SHAPES.length],
  };
}

/** 小缨缨自己：固定一个颜色，形状固定为圆，在人群里一眼可辨 */
export const ASSISTANT_AVATAR: AvatarSpec = {
  hue: 12,
  shape: 'circle',
};

/** 落库时用的标记。渲染时按 role 取 ASSISTANT_AVATAR，不参与推导 */
export const ASSISTANT_AVATAR_SEED = 'assistant';
