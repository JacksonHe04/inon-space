/**
 * labels 里只能放纯数据 —— 函数跨不过 Server / Client Component 的边界
 * （写错会在运行时抛 "Functions cannot be passed directly to Client Components"）。
 * 所以需要插值的文案统一写成 `{name}` 这样的占位符，由这里填。
 */

/** 纯文本插值。找不到对应 key 的占位符原样保留，方便一眼看出模板和值对不上 */
export function fillTemplate(
  template: string,
  values: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (token, key: string) =>
    key in values ? String(values[key]) : token
  );
}

/**
 * 把模板从 `{key}` 处切成两半，中间留给调用方塞一个 React 节点 ——
 * 链接没法先拼成字符串再插进去。
 *
 * 模板里没有占位符时返回 `[template, '']`，调用方不用额外判空。
 */
export function splitTemplate(template: string, key: string): [string, string] {
  const token = `{${key}}`;
  const at = template.indexOf(token);
  if (at === -1) return [template, ''];
  return [template.slice(0, at), template.slice(at + token.length)];
}
