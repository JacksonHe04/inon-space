'use client';

import { ClaudeCode, DeepSeek } from '@lobehub/icons';

import { cn } from '@/lib/utils';

interface CollabBadgeProps {
  /** 品牌 logo + 文字组合图标；尺寸给 16px，与旁边 Vercel / Next.js 的小 logo 同档 */
  icon: React.ReactNode;
  href: string;
  /** 无障碍名称；Combine 组件自带 aria-label，这里覆盖成更明确的说法 */
  label: string;
}

/**
 * 「与谁协作构建」的一枚徽章。
 *
 * 品牌名不写成文字，直接用 @lobehub/icons 的 Combine（logo + 字标一体）——
 * 它本身就是可读的，再补一段文字只会把一行说两遍。
 *
 * 客户端组件是包的硬要求：子组件标了 'use client'，入口文件没有标。
 */
function CollabBadge({ icon, href, label }: CollabBadgeProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      className="text-muted-foreground hover:text-foreground inline-flex items-center no-underline transition-colors hover:no-underline [&_svg]:h-3 [&_svg]:w-auto"
    >
      {icon}
    </a>
  );
}

/**
 * 底栏的 AI 协作署名。
 *
 * 与 BUILT_ON（Vercel / Next.js）同一排、同一档尺寸：这一排的含义就是
 * 「本站由什么构成」，模型的协作属于同一种事实，混在 TECH_STACK 文字里反而不清楚。
 */
export function CollabBadges({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <CollabBadge
        icon={<ClaudeCode.Combine size={16} type="color" />}
        href="https://www.anthropic.com/claude-code"
        label="Built with Claude Code"
      />
      <CollabBadge
        icon={<DeepSeek.Combine size={16} type="color" />}
        href="https://www.deepseek.com"
        label="Built with DeepSeek"
      />
    </span>
  );
}
