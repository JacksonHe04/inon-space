'use client';

import { ClaudeCode, DeepSeek } from '@lobehub/icons';

import { cn } from '@/lib/utils';

interface CollabBadgeProps {
  /** 彩色 logo（如 Claude 的星芒、DeepSeek 的鲸鱼） */
  logo: React.ReactNode;
  /** 品牌字标 SVG；fill 为 currentColor，颜色跟着文字走 */
  text: React.ReactNode;
  href: string;
  /** 无障碍名称；也用作 hover 提示 */
  label: string;
}

/**
 * 「与谁协作构建」的一枚徽章。
 *
 * **不用 Combine**：它内部 logo 与字标的横排样式由 @lobehub/ui 的 CSS-in-JS
 * 注入，在这里没有生效、退化成了上下堆叠。所以改用 Color + Text 两个原子件
 * 自己拼横排 —— 布局收在自己的 className 里，不依赖外部样式库。
 *
 * 品牌名不写成文字，字标 SVG 本身就是可读的；文字颜色继承外层（muted，hover 提亮），
 * logo 保留品牌色。
 */
function CollabBadge({ logo, text, href, label }: CollabBadgeProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 no-underline transition-colors hover:no-underline"
    >
      {logo}
      {text}
    </a>
  );
}

/**
 * 底栏的 AI 协作署名。
 *
 * 与 BUILT_ON（Vercel / Next.js）**不在同一排**是刻意的：那一排说的是
 * 「本站构建在什么之上」，这一排说的是「本站与谁协作构建」—— 两件不同的事，
 * 挤在一排会把语义搅在一起。
 */
export function CollabBadges({ className }: { className?: string }) {
  return (
    <span className={cn('flex flex-wrap items-center gap-x-4 gap-y-2', className)}>
      <CollabBadge
        logo={<ClaudeCode.Color size={14} />}
        text={<ClaudeCode.Text size={11} />}
        href="https://www.anthropic.com/claude-code"
        label="Built with Claude Code"
      />
      <CollabBadge
        logo={<DeepSeek.Color size={14} />}
        text={<DeepSeek.Text size={11} />}
        href="https://www.deepseek.com"
        label="Built with DeepSeek"
      />
    </span>
  );
}
