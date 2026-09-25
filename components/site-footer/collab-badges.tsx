'use client';

import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';

interface CollabBadgeProps {
  /** 品牌彩色 logo（icon） */
  logo: string;
  /** 品牌字标（fill 为 currentColor 的 SVG 走 mask 染成文字色） */
  text: string;
  /**
   * 字标的尺寸类。宽高比必须写在这里（Tailwind 任意值要静态字面量才会被编译），
   * mask 按 contain 缩放，不给比例会塌成正方形。
   */
  textClass: string;
  href: string;
  /** 无障碍名称；也用作 hover 提示 */
  label: string;
}

/**
 * 「与谁协作构建」的一枚徽章：彩色 icon + 单色字标，横排。
 *
 * 字标走 mask 单色（跟随文字色、明暗自适应）；icon 保留品牌色。
 * 品牌名不写成文字，字标本身就是可读的。
 */
function CollabBadge({ logo, text, textClass, href, label }: CollabBadgeProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      className="text-muted-foreground inline-flex items-center gap-1.5 no-underline hover:no-underline"
    >
      <Logo src={logo} alt={label} className="size-3.5" />
      <Logo src={text} alt="" monochrome className={textClass} />
    </a>
  );
}

/**
 * OpenCode 与 Go **横着拼成一枚**：两个 wordmark 并排、整体一个链接。
 * 高度对齐两侧徽章的 icon。
 */
function OpenCodeGoBadge() {
  return (
    <a
      href="https://opencode.ai"
      target="_blank"
      rel="noreferrer"
      aria-label="Built with OpenCode and Go"
      title="Built with OpenCode & Go"
      className="text-muted-foreground inline-flex items-center gap-1.5 no-underline hover:no-underline"
    >
      <Logo
        src="/logos/tech/opencode_light.svg"
        darkSrc="/logos/tech/opencode_dark.svg"
        alt="OpenCode"
        className="h-3"
      />
      <Logo
        src="/logos/tech/go_light.svg"
        darkSrc="/logos/tech/go_dark.svg"
        alt="Go"
        className="h-2"
      />
    </a>
  );
}

/**
 * 底栏的 AI 协作署名。
 *
 * 与 TECH_STACK（构建于其上）**不在同一排**是刻意的：那一排说的是
 * 「本站构建在什么之上」，这一排说的是「本站与谁协作构建」—— 两件不同的事，
 * 挤在一排会把语义搅在一起。
 */
export function CollabBadges({ className }: { className?: string }) {
  return (
    <span className={cn('flex flex-wrap items-center gap-x-3 gap-y-2', className)}>
      <CollabBadge
        logo="/logos/tech/claudecode-color.svg"
        text="/logos/tech/claudecode-text.svg"
        // 字标是两行排版，单行字高只有容器的一半，容器要给到单行字 ~10px 才看得清
        textClass="h-5 aspect-[56/24]"
        href="https://www.anthropic.com/claude-code"
        label="Built with Claude Code"
      />
      <OpenCodeGoBadge />
      <CollabBadge
        logo="/logos/tech/deepseek-color.svg"
        text="/logos/tech/deepseek-text.svg"
        textClass="h-3 aspect-[131/24]"
        href="https://www.deepseek.com"
        label="Built with DeepSeek"
      />
    </span>
  );
}
