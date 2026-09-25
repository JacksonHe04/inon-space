import { cn } from '@/lib/utils';

/**
 * 页面版心：全站**唯一**一处定义内容宽度与左右内边距的地方。
 *
 * 顶栏、页脚、每一页的内容都走它。之所以必须共用而不是各写各的，是因为
 * 「页面内容与顶栏左对齐」这件事完全依赖于两者用同一个容器 —— 任何一处
 * 单独改宽度或内边距，对齐就会悄悄失效，而且只有盯着看才发现。
 *
 * 纵向的内边距各页不同，由调用方通过 className 给。
 */
export function PageContainer({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn('mx-auto max-w-6xl px-6 sm:px-8', className)}>{children}</div>;
}

/**
 * 阅读列：正文内容再收一道宽度。
 *
 * 版心是 1152px，给导航和版面用；一行文字铺满这么宽，眼睛回行会累，
 * 所以正文再收到 768px。
 *
 * **收到左边，不是居中** —— 版心与顶栏对齐之后，正文列继续贴着它的左边缘，
 * 于是全站从顶栏到正文共用一条竖线（见 GALLERY 与 LIFE）。
 */
export function ReadingColumn({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn('max-w-3xl', className)}>{children}</div>;
}
