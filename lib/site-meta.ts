/**
 * 站点自身的元信息 —— 不属于「何锦诚的内容」，所以不放进 content 文件。
 * 放在这里的中英共用一份：包名和技术栈名称本来就不随语言变，
 * 抄成两份只会制造结构漂移。
 */

export interface TechItem {
  name: string;
  href: string;
}

/**
 * 底栏列出的开源技术栈。
 * 只列**真正在用**的 —— 装了但没引用的依赖不要写上去，那是不实陈述。
 */
export const TECH_STACK: readonly TechItem[] = [
  { name: 'Next.js', href: 'https://nextjs.org' },
  { name: 'React', href: 'https://react.dev' },
  { name: 'TypeScript', href: 'https://www.typescriptlang.org' },
  { name: 'Tailwind CSS', href: 'https://tailwindcss.com' },
  { name: 'Supabase', href: 'https://supabase.com' },
  { name: 'Vercel AI SDK', href: 'https://ai-sdk.dev' },
];

/** 底栏那两个 logo：表达「本站构建在这两者之上」 */
export const BUILT_ON = [
  { name: 'Vercel', src: '/vercel.svg', href: 'https://vercel.com' },
  { name: 'Next.js', src: '/next.svg', href: 'https://nextjs.org' },
] as const;

/** 项目卡片末尾「更多」的去处 */
export const GITHUB_REPOS_HREF = 'https://github.com/JacksonHe04?tab=repositories';
