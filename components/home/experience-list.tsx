import { Logo } from '@/components/logo';
import type { Experience } from '@/lib/content/types';

/** 院校在前、实习在后，各自按内容里的顺序（实习已是倒序） */
export function ExperienceList({ items }: { items: Experience[] }) {
  const education = items.filter((item) => item.kind === 'education');
  const work = items.filter((item) => item.kind === 'work');

  return (
    <div className="space-y-5">
      {education.length > 0 ? <ExperienceGroup items={education} /> : null}
      {/* 院校与实习之间断开，否则一串单位名读下来分不清哪段是哪类 */}
      {education.length > 0 && work.length > 0 ? (
        <div className="border-border border-t" role="presentation" />
      ) : null}
      {work.length > 0 ? <ExperienceGroup items={work} /> : null}
    </div>
  );
}

function ExperienceGroup({ items }: { items: Experience[] }) {
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
