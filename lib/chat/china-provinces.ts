/**
 * 中国省级行政区对照表：ISO 3166-2 的 subdivision 码 → 中文名。
 *
 * Vercel 的 `x-vercel-ip-country-region` 只给代码（`BJ`、`JS`…），不给名称；
 * 而 `Intl.DisplayNames` 能解析的是国家，解析不了行政区划。所以只能自带一份。
 *
 * 覆盖 34 个省级行政区。查不到就当作没有——宁可只显示「中国」，
 * 也不要把一个代码原样贴到访客名字里。
 */
export const CN_PROVINCES: Readonly<Record<string, string>> = {
  BJ: '北京',
  TJ: '天津',
  HE: '河北',
  SX: '山西',
  NM: '内蒙古',
  LN: '辽宁',
  JL: '吉林',
  HL: '黑龙江',
  SH: '上海',
  JS: '江苏',
  ZJ: '浙江',
  AH: '安徽',
  FJ: '福建',
  JX: '江西',
  SD: '山东',
  HA: '河南',
  HB: '湖北',
  HN: '湖南',
  GD: '广东',
  GX: '广西',
  HI: '海南',
  CQ: '重庆',
  SC: '四川',
  GZ: '贵州',
  YN: '云南',
  XZ: '西藏',
  SN: '陕西',
  GS: '甘肃',
  QH: '青海',
  NX: '宁夏',
  XJ: '新疆',
  TW: '台湾',
  HK: '香港',
  MO: '澳门',
};
