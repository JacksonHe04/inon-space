import { ArrowUpRight, MoreHorizontal } from 'lucide-react';

import { Logo } from '@/components/logo';
import type { Project } from '@/lib/content/types';
import { GITHUB_REPOS_HREF } from '@/lib/site-meta';
import { cn } from '@/lib/utils';

/**
 * 项目卡片墙。
 *
 * 每张卡片有两个去处：标题进项目本身，右上角的 GitHub 图标进仓库 ——
 * 项目没开源（content 里 `github` 留空）时那个图标不渲染，
 * 而不是画一个灰色不可点的，那会让人以为点错了。
 */
export function ProjectList({ items, moreLabel }: { items: Project[]; moreLabel: string }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((project) => (
        <li
          key={project.id}
          className="border-border flex flex-col border p-4 transition-colors hover:border-foreground/25"
        >
          <div className="flex items-start justify-between gap-3">
            <a
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-baseline gap-1 text-[0.92rem] font-medium"
            >
              {project.name}
              <ArrowUpRight className="text-muted-foreground size-3 shrink-0 self-center" aria-hidden />
            </a>

            {project.github ? (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                title="GitHub"
                aria-label={`${project.name} 的 GitHub 仓库`}
                className="text-muted-foreground hover:text-foreground -mt-0.5 inline-flex no-underline transition-colors hover:no-underline"
              >
                <Logo
                  src="/logos/contacts/github.svg"
                  alt="GitHub"
                  monochrome
                  className="size-3.5"
                />
              </a>
            ) : null}
          </div>

          <p className="text-muted-foreground mt-1.5 text-[0.82rem] leading-relaxed text-pretty">
            {project.description}
          </p>
        </li>
      ))}

      {/* 省略号卡片：通向 GitHub 的仓库列表 */}
      <li>
        <a
          href={GITHUB_REPOS_HREF}
          target="_blank"
          rel="noreferrer"
          title={moreLabel}
          className={cn(
            'border-border text-muted-foreground hover:text-foreground hover:border-foreground/25',
            'flex h-full min-h-[5.5rem] flex-col items-center justify-center gap-1.5 border border-dashed',
            'no-underline transition-colors hover:no-underline'
          )}
        >
          <MoreHorizontal className="size-4" aria-hidden />
          <span className="text-[0.75rem]">{moreLabel}</span>
        </a>
      </li>
    </ul>
  );
}
