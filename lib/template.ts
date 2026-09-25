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

/** 模板里的一段：要么是纯文本，要么是一个留给调用方填节点的占位符 */
export type TemplatePart = { kind: 'text'; text: string } | { kind: 'slot'; key: string };

/**
 * 把模板切成「文本 / 占位符」交替的片段。
 *
 * 链接没法先拼成字符串再插进去，所以只能切开、由调用方在占位符的位置塞 React 节点。
 * 支持**多个**占位符是刻意的：语录那行里「万竞屹」和「语录网站」都是链接，
 * 一个模板只能插一个节点就写不出那句话。
 *
 * 用不到的 key 直接留在文本里，调用方一眼能看出模板和实际传的对不上。
 */
export function parseTemplate(template: string, keys: readonly string[]): TemplatePart[] {
  if (keys.length === 0) return [{ kind: 'text', text: template }];

  const pattern = new RegExp(`\\{(${keys.map(escapeRegExp).join('|')})\\}`, 'g');
  const parts: TemplatePart[] = [];
  let cursor = 0;

  for (const match of template.matchAll(pattern)) {
    const at = match.index;
    if (at > cursor) parts.push({ kind: 'text', text: template.slice(cursor, at) });
    parts.push({ kind: 'slot', key: match[1] });
    cursor = at + match[0].length;
  }

  if (cursor < template.length) parts.push({ kind: 'text', text: template.slice(cursor) });
  return parts;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
