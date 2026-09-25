import type { EducationStage } from '@/lib/content/types';

/** 学历链：本科 → 小学。比 HOME 的经历多条「导师」，时间也更早 */
export function EducationList({
  items,
  advisorLabel,
}: {
  items: EducationStage[];
  /** 已经是「导师：」这样带分隔符的完整前缀，组件里不再拼标点 */
  advisorLabel: string;
}) {
  if (items.length === 0) return null;

  return (
    <ul className="space-y-4">
      {items.map((stage) => (
        <li key={stage.id}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <span className="text-[0.95rem] leading-snug">
              {stage.institution}
              {stage.major ? <span className="text-muted-foreground">，{stage.major}</span> : null}
              {/* 学历放括号里：它是学校的注解，不是并列信息 ——「2班 · 高中」读着别扭 */}
              <span className="text-muted-foreground">（{stage.degree}）</span>
            </span>
            <span className="text-muted-foreground text-[0.78rem] tabular-nums">{stage.period}</span>
          </div>

          {stage.advisors && stage.advisors.length > 0 ? (
            <p className="text-muted-foreground mt-0.5 text-[0.82rem]">
              {advisorLabel}
              {stage.advisors.join(' · ')}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
