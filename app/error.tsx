'use client';

import { useEffect } from 'react';
import Link from 'next/link';

/**
 * 页面级错误边界。数据层的失败已经在各自组件里兜住了，
 * 这里接的是真正的渲染错误 —— 至少让访客看到一句人话和两个出口，而不是 Next 的默认错误页。
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-2xl flex-col justify-center px-6 py-16">
      <p className="text-muted-foreground text-[0.72rem] tracking-[0.14em] uppercase">Error</p>
      <h1 className="mt-3 text-xl font-semibold">页面暂时没能打开</h1>
      <p className="text-muted-foreground mt-3 text-[0.95rem] leading-relaxed">
        可能是网络或服务短暂波动。可以重试，或稍后再来。
      </p>
      <p lang="en" className="text-muted-foreground mt-1 text-[0.85rem] leading-relaxed">
        Something went wrong. Please try again.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="border-border hover:border-foreground/40 rounded-xs border px-4 py-2 text-sm transition-colors"
        >
          再试一次
        </button>
        <Link
          href="/"
          className="border-border hover:border-foreground/40 rounded-xs border px-4 py-2 text-sm no-underline transition-colors"
        >
          回到首页
        </Link>
      </div>
    </div>
  );
}
