'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

import { recordSiteView } from '@/lib/analytics/actions';
import { getSessionId } from '@/lib/analytics/session';

/**
 * 访问统计的入口。挂在根布局上，所以每次路由变化都会经过这里。
 *
 * 用 `usePathname` 而不是窗口的 load 事件：客户端导航不会重新加载页面，
 * 只监听 load 的话，站内跳转就全都漏掉了。
 *
 * `enabled` 由服务端传进来，因为「要不要计数」取决于 `VERCEL_ENV` —— 那是服务端变量，
 * 客户端组件里读 `process.env` 只会拿到 undefined（Next 只内联 `NEXT_PUBLIC_*`）。
 */
export function PageViewTracker({ enabled }: { enabled: boolean }) {
  const pathname = usePathname();
  const recordedRef = useRef<string | null>(null);
  /** 上一次 page_view 发生的时刻，用来算「上一页停留了多久」 */
  const enteredAtRef = useRef(0);

  useEffect(() => {
    if (!enabled || !pathname) return;
    // 同一路径不重复记：严格模式下 effect 会跑两遍，重挂载也会再跑一遍
    if (recordedRef.current === pathname) return;

    // 停留时间归属「上一页」：这一次记录带着上一次的停留时长。
    // 最后一页的停留会丢失 —— 页面卸载时无法再走 Server Action，
    // 要补就得加一个 beacon 接口，而那样会把 PV 记重，不值。
    const dwell = enteredAtRef.current ? Date.now() - enteredAtRef.current : 0;

    recordedRef.current = pathname;
    enteredAtRef.current = Date.now();

    void recordSiteView(pathname, getSessionId(), dwell);
  }, [enabled, pathname]);

  return null;
}
