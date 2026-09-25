import { PageContainer } from '@/components/container';
import { Logo } from '@/components/logo';
import { CollabBadges } from '@/components/site-footer/collab-badges';
import type { SiteViewTotals } from '@/lib/analytics/queries';
import { FOOTER, GITHUB_PROFILE_HREF, GITHUB_PROFILE_NAME, TECH_STACK } from '@/lib/site-meta';
import { fillTemplate, parseTemplate } from '@/lib/template';

/*
 * 底栏全部走 site-meta 的 FOOTER 常量：文案刻意固定英文，不随站点语言变（理由见常量处注释）。
 * 所以这里不再接收 labels —— 底栏是站点元信息，不是「随语言的内容」。
 */
export function SiteFooter({ stats }: { stats: SiteViewTotals }) {
  return (
    <footer className="border-border mt-auto border-t">
      <PageContainer className="space-y-3 py-8">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2">
          <span className="text-muted-foreground text-xs">{FOOTER.builtWith}</span>

          {/* 技术栈整排是 logo：名字在 title 与 aria-label 里，不重复写文字 */}
          <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
            {TECH_STACK.map((tech) => (
              <a
                key={tech.name}
                href={tech.href}
                target="_blank"
                rel="noreferrer"
                title={tech.name}
                aria-label={tech.name}
                // 灰色打底（全局 a 样式会把 mask 字标染成站点链接色，必须压掉），hover 一律不变色
                className="text-muted-foreground inline-flex no-underline hover:no-underline"
              >
                <Logo
                  src={tech.src}
                  darkSrc={tech.darkSrc}
                  alt={tech.name}
                  monochrome={tech.monochrome}
                  className={tech.className}
                />
              </a>
            ))}
          </span>
        </div>

        {/*
          AI 协作单独一行：它与上面那排「构建在什么之上」是两件事，
          挤在一排会把「技术栈」和「协作署名」的语义搅在一起。

          引导语是模板（形如「Built in collaboration with {models}」），{models} 槽位放
          协作徽章 —— 与 LIFE 页署名句是同一个做法（parseTemplate）。
        */}
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
          {parseTemplate(FOOTER.coBuiltWith, ['models']).map((part, index) =>
            part.kind === 'text' ? (
              <span key={index} className="text-muted-foreground text-xs">
                {part.text}
              </span>
            ) : (
              <CollabBadges key={index} />
            )
          )}
        </div>

        <p className="text-muted-foreground text-xs">
          © {new Date().getFullYear()}{' '}
          <a href={GITHUB_PROFILE_HREF} target="_blank" rel="noreferrer">
            {GITHUB_PROFILE_NAME}
          </a>
          {' · '}
          {FOOTER.rights}
          {/* 一条都还没记到时就不显示，免得刚上线就挂着「0 位访客」 */}
          {stats.pv > 0 ? (
            <>
              {' · '}
              {fillTemplate(FOOTER.visits, { visitors: stats.uv, views: stats.pv })}
            </>
          ) : null}
        </p>
      </PageContainer>
    </footer>
  );
}
