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

  // 院校与实习是两个独立板块，各有一条自己的分隔线
  const education = experiences.filter((item) => item.kind === 'education');
  const work = experiences.filter((item) => item.kind === 'work');

  // 数据库抖一下不该让整页挂掉，群聊退回空态即可
  let initial: ChatSnapshot = { messages: [], suggested: [] };
  try {
    initial = await fetchSnapshot();
  } catch (error) {
    console.error('[home] 群聊快照加载失败', error);
  }

  return (
    <div className="mx-auto max-w-6xl px-6 sm:px-8">
      {/*
        首屏：左侧信息，右侧群聊。
        行高由**左栏内容**决定，右栏只负责填满它（min-h 给一个下限）——
        所以不要去固定这个 grid 的高度：它带 py 内边距，border-box 下会算错内容区，
        而写死一个值又会在左栏内容变长时溢出。群聊自己不给行高做任何贡献（见下），
        否则消息一多就把整行撑高、左栏跟着被拉伸、底部留出大片空白。
      */}
      <div className="grid gap-x-14 gap-y-10 py-12 lg:grid-cols-2 lg:py-16">
        {/*
          自上而下：标题 / 自我介绍 / 联系方式 / 感兴趣方向 / 教育经历 / 实习经历。
          前四块是一件事（我是谁），只用间距分开、不画线；分隔线只画两条 ——
          一条在「感兴趣方向」之后，一条在院校与实习之间。

          线的节奏统一是「上方 24px（mt-6）+ 下方 24px（Section 自带 pt-6）」。
          别再往这里叠外层的 gap，那正是之前显乱的原因。
        */}
        <div>
          <div className="space-y-4">
            <h1 className="text-[1.55rem] leading-tight font-semibold tracking-tight">
              {identity.greeting}
            </h1>

            <p className="text-muted-foreground text-[0.95rem] leading-relaxed text-pretty">
              {identity.tagline}
            </p>

            <ContactRow items={contacts} closeLabel={labels.close} />

            <ul className="flex flex-wrap gap-1.5">
              {identity.directions.map((direction) => (
                <li key={direction} className="chip">
                  {direction}
                </li>
              ))}
            </ul>
          </div>

          {education.length > 0 ? (
            <Section className="mt-6">
              <ExperienceList items={education} />
            </Section>
          ) : null}

          {work.length > 0 ? (
            <Section className="mt-6">
              <ExperienceList items={work} />
            </Section>
          ) : null}
        </div>

        {/*
          h-[30rem] 给窄屏（这里是上下堆叠，没有兄弟元素可以对齐）；lg 下 h-auto 让它
          作为 grid item 被拉伸到行高，min-h-[36rem] 保证左栏很短时群聊也不会太矮。
          移动端微信式的固定高度就是这个意思：高度不随消息条数变。
        */}
        <div className="flex h-[30rem] min-h-0 flex-col lg:h-auto lg:min-h-[36rem]">
          <GroupChat initial={initial} labels={labels} locale={locale} />
        </div>
      </div>

      <Section className="pb-16">
        <ProjectList items={projects} moreLabel={labels.projectsMore} />
      </Section>
    </div>
  );
}
