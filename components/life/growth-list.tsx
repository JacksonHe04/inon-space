import type { GrowthStage } from '@/lib/content/types';

export function GrowthList({ items }: { items: GrowthStage[] }) {
  if (items.length === 0) return null;

  return (
    <ul className="space-y-5">
      {items.map((stage) => (
        <li key={`${stage.city}-${stage.period}`}>
          <div className="flex flex-wrap items-baseline gap-x-3">
            <span className="text-[0.95rem] font-medium">{stage.city}</span>
            <span className="text-muted-foreground text-[0.75rem] tabular-nums">
              {stage.period}
            </span>
          </div>
          <p className="text-muted-foreground mt-0.5 text-[0.85rem] leading-relaxed text-pretty">
            {stage.description}
          </p>
        </li>
      ))}
    </ul>
  );
}
