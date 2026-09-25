import { cn } from '@/lib/utils';

interface SectionProps {
  /** 小型大写标题；不传则不渲染标题行 */
  title?: string;
  /** 标题右侧的补充信息，如「4 段」 */
  aside?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * 学者风格的分节容器：一条细分隔线 + 小标题 + 内容。
 * 站内所有内容区块共用它，保证纵向节奏一致。
 */
export function Section({ title, aside, children, className }: SectionProps) {
  return (
    <section className={cn('border-border border-t pt-6', className)}>
      {title ? (
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h2 className="kicker">{title}</h2>
          {aside ? (
            <span className="text-muted-foreground text-[0.7rem] tabular-nums">{aside}</span>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
