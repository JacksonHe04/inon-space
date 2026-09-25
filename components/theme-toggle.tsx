'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

import type { Labels } from '@/lib/content/types';
import { cn } from '@/lib/utils';

/**
 * 主题切换。
 *
 * 图标的显隐完全交给 CSS 的 `dark:` 变体 —— 不用「先挂载、再判断」那套，
 * 否则会先渲染一个空按钮、挂载后再闪出图标。
 *
 * `resolvedTheme` 只参与点击时的一次判断，不参与渲染，所以它在挂载前是
 * undefined 也不要紧；aria-label 特意写成与主题无关的固定文案，
 * 免得服务端和客户端渲染出不同的属性值。
 */
export function ThemeToggle({ labels }: { labels: Labels }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label={labels.themeToggle}
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className={cn(
        'text-muted-foreground hover:text-foreground inline-flex size-6 cursor-pointer items-center justify-center',
        'transition-colors'
      )}
    >
      <Sun className="hidden size-3.5 dark:block" aria-hidden />
      <Moon className="block size-3.5 dark:hidden" aria-hidden />
    </button>
  );
}
