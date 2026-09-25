import { ContactRow } from '@/components/home/contact-row';
import { ExperienceList } from '@/components/home/experience-list';
import { GroupChat } from '@/components/home/group-chat';
import { ProjectList } from '@/components/home/project-list';
import { Section } from '@/components/section';
import { fetchSnapshot } from '@/lib/chat/queries';
import type { ChatSnapshot } from '@/lib/chat/types';
import { getRequestContent } from '@/lib/content/server';

// 群聊是活的，首屏必须每次请求重新取
export const dynamic = 'force-dynamic';

/**
 * HOME 的各区块不带标题 —— 靠细分隔线和内容本身的形式区分就够了。
 * 「方向」是一行关键词、「经历」带机构 logo 与年份、「联系」是一排图标，
 * 加标题只会把首屏撑高、稀释掉 5 秒内该被看到的东西。
 */
export default async function HomePage() {
  const { locale, content } = await getRequestContent();
  const { identity, experiences, contacts, projects, labels } = content;

  // 数据库抖一下不该让整页挂掉，群聊退回空态即可
  let initial: ChatSnapshot = { messages: [], suggested: [] };
  try {
    initial = await fetchSnapshot();
  } catch (error) {
    console.error('[home] 群聊快照加载失败', error);
  }

  return (
    <div className="mx-auto max-w-6xl px-6 sm:px-8">
      {/* 首屏：左侧信息，右侧群聊 */}
      <div className="grid gap-x-14 gap-y-10 py-12 lg:grid-cols-2 lg:py-16">
        <div className="space-y-8">
          <header>
            <h1 className="text-[1.55rem] leading-tight font-semibold tracking-tight">
              {identity.greeting}
            </h1>
            <p className="text-muted-foreground mt-2 text-[0.95rem] leading-relaxed text-pretty">
              {identity.tagline}
            </p>
          </header>

          <Section>
            <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
              {identity.directions.map((direction) => (
                <li key={direction} className="text-muted-foreground text-[0.85rem]">
                  {direction}
                </li>
              ))}
            </ul>
          </Section>

          <Section>
            <ExperienceList items={experiences} />
          </Section>

          <Section>
            <ContactRow items={contacts} closeLabel={labels.close} />
          </Section>
        </div>

        <div className="flex flex-col lg:min-h-[34rem]">
          <GroupChat initial={initial} labels={labels} locale={locale} />
        </div>
      </div>

      <Section className="pb-16">
        <ProjectList items={projects} moreLabel={labels.projectsMore} />
      </Section>
    </div>
  );
}
