import { Logo } from '@/components/logo';
import type { Experience } from '@/lib/content/types';

/**
 * 一组经历（院校或实习）。
 *
 * 只负责把给到它的一串渲染出来 —— 院校与实习在首页是两个独立板块、各有自己的分隔线，
 * 所以这里不再自己插分隔线，也不负责筛选。调用方决定给它哪一类。
 */
export function ExperienceList({ items }: { items: Experience[] }) {
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item.id} className="flex gap-3">
          <Logo src={item.logo} alt={item.org} className="mt-[3px] h-4 w-4 shrink-0 object-contain" />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <span className="text-[0.95rem] leading-snug">
                {item.org}
                {item.branch ? <span className="text-muted-foreground">，{item.branch}</span> : null}
                {item.role ? <span className="text-muted-foreground">，{item.role}</span> : null}
              </span>
              <span className="text-muted-foreground text-[0.78rem] tabular-nums">{item.period}</span>
            </div>

            {item.location || item.description ? (
              <p className="text-muted-foreground mt-0.5 text-[0.82rem] leading-relaxed text-pretty">
                {item.location ? <span className="tabular-nums">{item.location}</span> : null}
                {item.location && item.description ? ' · ' : null}
                {item.description}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
