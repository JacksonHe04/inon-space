import { Fragment } from 'react';

import { Logo } from '@/components/logo';
import type { Labels } from '@/lib/content/types';
import { BUILT_ON, TECH_STACK } from '@/lib/site-meta';

export function SiteFooter({ name, labels }: { name: string; labels: Labels }) {
  return (
    <footer className="border-border mt-auto border-t">
      <div className="mx-auto max-w-6xl space-y-3 px-6 py-8 sm:px-8">
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

        <p className="text-muted-foreground text-xs">
          © {new Date().getFullYear()} {name} · {labels.footerRights}
        </p>
      </div>
    </footer>
  );
}
