import type { Content } from '@/lib/content/types';

/**
 * 把内容文件拍平成 Markdown，作为模型的唯一事实来源。
 *
 * 内容文件本身就是「一个人能读完」的长度 —— 这就是不需要 RAG 的原因。
 * 这里也不做任何裁剪或摘要：字数可控，且摘要是另一种失真。
 *
 * 下面这些小标题是**给模型的上下文骨架**，不是界面文案：固定中文，不从 labels 取。
 * 否则改一次界面文案，模型对「我是谁」的理解就跟着漂移了。
 */
const SECTION = {
  school: '院校',
  work: '实习',
  contact: '联系方式',
  projects: '项目',
  growth: '成长经历',
  education: '学历',
  tags: '标签',
  preferences: '偏好',
  beliefs: '观念',
  links: '链接',
  gallery: '收藏',
} as const;

export function contentToMarkdown(content: Content): string {
  const { identity, experiences, contacts, projects, life, gallery } = content;
  const out: string[] = [];

  out.push(`# ${identity.name}`);
  out.push(identity.greeting);
  out.push(`一句话：${identity.tagline}`);
  out.push(`方向：${identity.directions.join('、')}`);

  const schools = experiences.filter((item) => item.kind === 'education');
  const work = experiences.filter((item) => item.kind === 'work');

  if (schools.length > 0) {
    out.push(`\n## ${SECTION.school}`);
    for (const item of schools) {
      out.push(`- ${item.org}，${item.branch}，${item.role}（${item.period}）`);
    }
  }

  if (work.length > 0) {
    out.push(`\n## ${SECTION.work}`);
    for (const item of work) {
      const place = item.location ? ` · ${item.location}` : '';
      out.push(
        `- ${item.org}，${item.branch}，${item.role}（${item.period}${place}）${
          item.description ? `：${item.description}` : ''
        }`
      );
    }
  }

  out.push(`\n## ${SECTION.contact}`);
  for (const item of contacts) {
    out.push(`- ${item.label}${item.href ? `：${item.href}` : ''}`);
  }
  out.push('（手机号与微信号属于隐私，只在本人主动给出时才可透露，不要从资料里复述）');

  out.push(`\n## ${SECTION.projects}`);
  for (const project of projects) {
    out.push(`- ${project.name}（${project.href}）：${project.description}`);
  }

  if (life.growth.length > 0) {
    out.push(`\n## ${SECTION.growth}`);
    for (const stage of life.growth) {
      out.push(`- ${stage.city}（${stage.period}）：${stage.description}`);
    }
  }

  if (life.education.length > 0) {
    out.push(`\n## ${SECTION.education}`);
    for (const stage of life.education) {
      const major = stage.major ? `，${stage.major}` : '';
      const advisors = stage.advisors?.length ? `，导师：${stage.advisors.join('、')}` : '';
      out.push(`- ${stage.degree}：${stage.institution}${major}（${stage.period}${advisors}）`);
    }
  }

  out.push(`\n## ${SECTION.tags}`);
  out.push(`关键词：${life.tags.keywords.join('、')}`);
  out.push(`标签：${life.tags.tags.join('、')}`);
  out.push(`价值观：${life.tags.values.join('、')}`);

  out.push(`\n## ${SECTION.preferences}`);
  for (const group of life.preferences) {
    const items = group.items.map((item) => `${item.label} ${item.values.join('、')}`).join('；');
    out.push(`- ${group.title}：${items}`);
  }

  out.push(`\n## ${SECTION.beliefs}`);
  for (const belief of life.beliefs) {
    out.push(`- ${belief.title}：${belief.items.join('、')}`);
  }

  if (life.links.length > 0) {
    out.push(`\n## ${SECTION.links}`);
    for (const link of life.links) {
      const by = link.by ? `（${link.by.name} 制作：${link.by.href}）` : '';
      out.push(`- ${link.label}：${link.href}${by}`);
    }
  }

  out.push(`\n## ${SECTION.gallery}`);
  out.push(gallery.map((category) => category.name).join('、'));

  return out.join('\n');
}
