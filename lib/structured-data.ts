import type { Content } from '@/lib/content/types';
import { SITE_URL } from '@/lib/site-meta';

/**
 * schema.org 的 Person 结构化数据。
 *
 * 从内容文件推导而不是手写一份：姓名、方向、经历本来就是站点唯一的真相，
 * 抄第二遍迟早会漂移。搜索引擎读到的东西应该和访客看到的是同一份。
 *
 * 用 `sameAs` 把散落在各平台的账号串起来，是让搜索引擎确认「这些是同一个人」的
 * 主要手段；`knowsAbout` 则直接对应那排方向标签。
 */
export function buildPersonSchema(content: Content): Record<string, unknown> {
  const { identity, experiences, contacts, projects } = content;

  const schools = experiences.filter((item) => item.kind === 'education');
  const works = experiences.filter((item) => item.kind === 'work');

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: identity.name,
    description: identity.tagline,
    url: SITE_URL,
    image: `${SITE_URL}/opengraph-image`,
    jobTitle: identity.tagline,
    knowsAbout: identity.directions,
    // 只收站外的个人主页，邮件与二维码不算「同一身份的其他地址」
    sameAs: contacts
      .filter((contact) => contact.kind === 'link' && contact.href?.startsWith('http'))
      .map((contact) => contact.href as string),
    // 去重：同一个人在东南大学读了两段（转专业），但那是同一所学校
    alumniOf: [...new Set(schools.map((school) => school.org))].map((name) => ({
      '@type': 'CollegeOrUniversity',
      name,
    })),
    worksFor: works.map((work) => ({
      '@type': 'Organization',
      name: work.org,
    })),
    // 作品本身就是最实在的「我做过什么」，指向项目而不是罗列形容词
    subjectOf: projects.map((project) => ({
      '@type': 'CreativeWork',
      name: project.name,
      url: project.href,
      description: project.description,
    })),
  };
}
