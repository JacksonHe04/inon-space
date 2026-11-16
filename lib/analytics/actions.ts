'use server';

import { recordPageView } from '@/lib/analytics/record';

/**
 * 访问统计的写入入口（Server Action 版本）。
 *
 * 本体在 `lib/analytics/record.ts` —— 拆出来是因为记录逻辑需要能被多处复用，
 * 而 `'use server'` 文件只能导出异步函数。
 */
export async function recordSiteView(
  pathname: string,
  sessionId: string,
  dwellMs: number
): Promise<void> {
  await recordPageView({ urlPath: pathname, sessionId, dwellMs });
}
