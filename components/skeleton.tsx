import type { CSSProperties } from 'react';

import { cn } from '@/lib/utils';

interface SkeletonBarProps {
  /** 尺寸与位置由调用方给 —— 骨架必须照着真实内容的盒子画，这里不预设 */
  className?: string;
  /**
   * 错峰延迟（毫秒）。同一个骨架里的几条不要同步呼吸 ——
   * 一起明灭看起来像在闪，错开之后才像在等。
   */
  delay?: number;
}

/**
 * 骨架屏的一条占位。
 *
 * 全站只有这一个占位形状：群聊的消息骨架、GALLERY 的条目骨架都由它拼出来，
 * 「等待中」在站内处处长得一样。样式在 globals.css 的 `.skeleton`。
 *
 * 延迟写成内联 style 而不是 class：它是「第几条」的函数，写成 class 就得为每个
 * 位置手写一个，反而不可复用。
 */
export function SkeletonBar({ className, delay }: SkeletonBarProps) {
  return (
    <span
      aria-hidden
      style={delay ? ({ animationDelay: `${delay}ms` } as CSSProperties) : undefined}
      className={cn('skeleton block', className)}
    />
  );
}
