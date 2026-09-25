import type { Metadata } from 'next';

import { DescriptionList } from '@/components/description-list';
import { EducationList } from '@/components/life/education-list';
import { GrowthList } from '@/components/life/growth-list';
import { Section } from '@/components/section';
import { getRequestContent } from '@/lib/content/server';
import { splitTemplate } from '@/lib/template';

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getRequestContent();
  return { title: content.nav.life };
}

export default async function LifePage() {
  const { content } = await getRequestContent();
  const { life, labels } = content;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 sm:px-8 lg:py-16">
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
                <a href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
                {link.by ? <Credit by={link.by} template={labels.linkBy} /> : null}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </div>
  );
}

/**
 * 别人做的东西要署上是谁做的。文案是 `由 {name} 制作` 这样的模板，
 * 名字本身是个链接 —— 所以不能先把整句拼成字符串。
 */
function Credit({
  by,
  template,
}: {
  by: { name: string; href: string };
  template: string;
}) {
  const [before, after] = splitTemplate(template, 'name');

  return (
    <span className="text-muted-foreground ml-2 text-[0.8rem]">
      {before}
      <a href={by.href} target="_blank" rel="noreferrer">
        {by.name}
      </a>
      {after}
    </span>
  );
}
