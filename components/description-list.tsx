import { Fragment } from 'react';
import { cn } from '@/lib/utils';

export interface DescriptionRow {
  label: string;
  values: string[];
}

/**
 * 「标签：值 · 值 · 值」的统一样式。
 * LIFE 页里的标签、偏好、观念三块都是这个形状，共用一份 —— 别各自写一遍。
 */
export function DescriptionList({
  rows,
  className,
}: {
  rows: DescriptionRow[];
  className?: string;
}) {
  return (
    <dl className={cn('grid gap-x-8 gap-y-2.5 sm:grid-cols-[7.5rem_1fr]', className)}>
      {rows.map((row) => (
        <Fragment key={row.label}>
          <dt className="text-muted-foreground text-[0.82rem]">{row.label}</dt>
          <dd className="text-[0.88rem] leading-relaxed text-pretty">
            {row.values.join(' · ')}
          </dd>
        </Fragment>
      ))}
    </dl>
  );
}
