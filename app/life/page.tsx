import { Fragment } from 'react';
import type { Metadata } from 'next';

import { PageContainer, ReadingColumn } from '@/components/container';
import { DescriptionList } from '@/components/description-list';
import { EducationList } from '@/components/life/education-list';
import { GrowthList } from '@/components/life/growth-list';
import { Section } from '@/components/section';
import type { ExternalLink } from '@/lib/content/types';
import { getRequestContent } from '@/lib/content/server';
import { ROUTES } from '@/lib/i18n';
import { parseTemplate } from '@/lib/template';

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getRequestContent();
  const { identity, labels } = content;

  return {
    title: content.nav.life,
    // 描述由各区块标题拼出来 —— 这页放的就是这几类东西，不必再手写一句并列的文案
    description: `${identity.name} · ${[
      labels.growth,
      labels.education,
      labels.preferences,
      labels.beliefs,
    ].join(' · ')}`,
    alternates: { canonical: ROUTES.life },
  };
}

export default async function LifePage() {
  const { content } = await getRequestContent();
  const { identity, life, labels } = content;

  return (
    // 版心与顶栏同源（PageContainer），正文列再收窄到左缘 —— 与 GALLERY 的条目列同一条线
    <PageContainer className="py-12 lg:py-16">
      <ReadingColumn>
        {/*
          这一页的可见标题都被设计去掉了（条目本身说明了它是什么），但页面必须有 h1：
          否则整页的标题层级从 h2 起，搜索引擎与读屏软件都拿不到「这是什么页」。
          所以留一个只给机器看的 h1。
        */}
        <h1 className="sr-only">
          {identity.name} · {content.nav.life}
        </h1>

        {life.growth.length > 0 ? (
          <Section title={labels.growth} className="border-t-0 pt-0">
            <GrowthList items={life.growth} />
          </Section>
        ) : null}

        {life.education.length > 0 ? (
          <Section title={labels.education} className="mt-10">
            <EducationList items={life.education} advisorLabel={labels.advisor} />
          </Section>
        ) : null}

        <Section title={labels.tags} className="mt-10">
          <DescriptionList
            rows={[
              { label: labels.keywords, values: life.tags.keywords },
              { label: labels.selfTags, values: life.tags.tags },
              { label: labels.values, values: life.tags.values },
            ]}
          />
        </Section>

        <Section title={labels.preferences} className="mt-10">
          <div className="space-y-6">
            {life.preferences.map((group) => (
              <div key={group.id}>
                <h3 className="mb-2 text-[0.88rem] font-medium">{group.title}</h3>
                <DescriptionList rows={group.items} />
              </div>
            ))}
          </div>
        </Section>

        <Section title={labels.beliefs} className="mt-10">
          <DescriptionList
            rows={life.beliefs.map((belief) => ({ label: belief.title, values: belief.items }))}
          />
        </Section>

        {life.links.length > 0 ? (
          <Section title={labels.links} className="mt-10 pb-4">
            <ul className="space-y-1.5">
              {life.links.map((link) => (
                <li key={link.href} className="text-[0.88rem]">
                  {link.by ? (
                    <Credit
                      link={link}
                      template={
                        link.byTemplate === 'owner' ? labels.linkByOwner : labels.linkByMade
                      }
                    />
                  ) : (
                    <a href={link.href} target="_blank" rel="noreferrer">
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </Section>
        ) : null}
      </ReadingColumn>
    </PageContainer>
  );
}

/**
 * 别人做的东西要署上是谁做的。
 *
 * 整行就是 labels.linkByMade / linkByOwner 那一句话（形如 `我的朋友 {name} 给我做的{site}`），
 * 两个占位符都是链接：{name} 指向作者主页，{site} 指向站点本身。
 * 所以这里不再单独渲染 label —— 它已经被填进句子里了。
 */
function Credit({ link, template }: { link: ExternalLink; template: string }) {
  const parts = parseTemplate(template, ['name', 'site']);

  return (
    <>
      {parts.map((part, index) => {
        if (part.kind === 'text') return <Fragment key={index}>{part.text}</Fragment>;
        if (part.key === 'name' && link.by) {
          return (
            <a key={index} href={link.by.href} target="_blank" rel="noreferrer">
              {link.by.name}
            </a>
          );
        }
        return (
          <a key={index} href={link.href} target="_blank" rel="noreferrer">
            {link.label}
          </a>
        );
      })}
    </>
  );
}
