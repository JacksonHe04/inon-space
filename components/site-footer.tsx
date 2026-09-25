import { Fragment } from 'react';

import { PageContainer } from '@/components/container';
import { Logo } from '@/components/logo';
import { CollabBadges } from '@/components/site-footer/collab-badges';
import type { SiteViewTotals } from '@/lib/analytics/queries';
import type { Labels } from '@/lib/content/types';
import { BUILT_ON, TECH_STACK } from '@/lib/site-meta';
import { fillTemplate } from '@/lib/template';

export function SiteFooter({
  name,
  labels,
  stats,
}: {
  name: string;
  labels: Labels;
  stats: SiteViewTotals;
}) {
  return (
    <footer className="border-border mt-auto border-t">
      <PageContainer className="space-y-3 py-8">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2">
          {/* 本站构建其上的两个：logo 与文字栈同色，避免抢眼 */}
          <span className="flex items-center gap-2.5">
            {BUILT_ON.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                title={item.name}
                aria-label={item.name}
                className="text-muted-foreground hover:text-foreground inline-flex no-underline transition-colors hover:no-underline"
              >
                <Logo
                  src={item.src}
                  alt={item.name}
                  monochrome
                  className={item.name === 'Vercel' ? 'h-3 w-3' : 'h-3 w-[3.7rem]'}
                />
              </a>
            ))}
          </span>

          <span className="text-muted-foreground text-xs">{labels.footerBuiltWith}</span>

          <span className="text-xs">
            {TECH_STACK.map((tech, index) => (
              <Fragment key={tech.name}>
                {index > 0 ? <span className="text-muted-foreground"> · </span> : null}
                <a href={tech.href} target="_blank" rel="noreferrer">
                  {tech.name}
                </a>
              </Fragment>
            ))}
          </span>
        </div>

        {/*
          AI 协作单独一行：它与上面那排「构建在什么之上」是两件事，
          挤在一排会把「技术栈」和「协作署名」的语义搅在一起。
        */}
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2">
          <span className="text-muted-foreground text-xs">{labels.footerCoBuilt}</span>
          <CollabBadges />
        </div>

        <p className="text-muted-foreground text-xs">
          © {new Date().getFullYear()} {name} · {labels.footerRights}
          {/* 一条都还没记到时就不显示，免得刚上线就挂着「0 位访客」 */}
          {stats.pv > 0 ? (
            <>
              {' · '}
              {fillTemplate(labels.footerVisits, { visitors: stats.uv, views: stats.pv })}
            </>
          ) : null}
        </p>
      </PageContainer>
    </footer>
  );
}
