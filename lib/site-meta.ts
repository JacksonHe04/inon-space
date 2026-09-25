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

/**
 * 站点归属的 profile。
 *
 * v3 与 world.inon.space 共用同一个 Supabase，也共用同一个 profile —— 访问统计、
 * 收藏条目都挂在这个 id 上。写成常量而不是环境变量：它不是密钥，
 * 而且换掉它意味着换成另一个人的站点，那属于改代码而不是改配置。
 */
export const SITE_PROFILE_ID = '2a9d3a63-41a4-4373-a3dd-e6defd16370e';

/**
 * v3 自己的访问事件名。
 *
 * 不能沿用 world 站的 `page_view`：那张日聚合表按 (profile_id, stat_date) 归并，
 * 两个站都会写进同一行，底栏那个数字就会掺进 world 的流量。
 * 用独立事件名之后，v3 的事件只进事件流、不进聚合表，读取走 page_view_site_totals。
 */
export const SITE_VIEW_EVENT = 'v3_page_view';
