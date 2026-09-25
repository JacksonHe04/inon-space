/**
 * 站点自身的元信息 —— 不属于「何锦诚的内容」，所以不放进 content 文件。
 * 放在这里的中英共用一份：包名和技术栈名称本来就不随语言变，
 * 抄成两份只会制造结构漂移。
 */

export interface TechItem {
  name: string;
  href: string;
  /** logo 路径（public/logos/tech/） */
  src: string;
  /** 深色模式变体；不传则明暗共用 src（配合 monochrome） */
  darkSrc?: string;
  /** 单色渲染（mask + currentColor，明暗自动适配）。品牌色 logo 别开 */
  monochrome?: boolean;
  /** logo 的显示尺寸。各 logo 宽高比不同，逐项给 */
  className: string;
}

/**
 * 底栏第一行列出的开源技术栈 —— 一排 logo。
 *
 * 两条标准：只列**真正在用**的（装了但没引用的依赖不要写上去，那是不实陈述），
 * 并且只列**框架与平台这一层**。语言与 CSS 框架是任何现代前端的基线，
 * 写上去不提供信息量，反而把真正能说明「这个站由什么搭起来」的几项稀释掉
 * （OpenCode 与 Go 在第二行，作为协作署名）。
 */
export const TECH_STACK: readonly TechItem[] = [
  {
    name: 'Vercel',
    href: 'https://vercel.com',
    src: '/logos/tech/vercel.svg',
    // 白色填充，浅色背景下只能走 mask 染成文字色
    monochrome: true,
    className: 'h-3 w-3',
  },
  {
    name: 'Next.js',
    href: 'https://nextjs.org',
    src: '/logos/tech/next.svg',
    // 黑色填充，同理走 mask
    monochrome: true,
    className: 'h-3 w-[3.7rem]',
  },
  {
    name: 'Supabase',
    href: 'https://supabase.com',
    src: '/logos/tech/supabase-logo-wordmark--light.svg',
    darkSrc: '/logos/tech/supabase-logo-wordmark--dark.svg',
    // wordmark 里文字只占 ~40% 高（闪电占满高），容器要比同行 logo 高一档文字才不显小
    className: 'h-4 w-auto',
  },
  {
    name: 'Vercel AI SDK',
    href: 'https://ai-sdk.dev',
    src: '/logos/tech/ai-sdk-light.svg',
    darkSrc: '/logos/tech/ai-sdk-dark.svg',
    className: 'h-3 w-auto',
  },
];

/** 项目卡片末尾「更多」的去处 */
export const GITHUB_REPOS_HREF = 'https://github.com/JacksonHe04?tab=repositories';

/** 作者的 GitHub 主页 —— 底栏署名链到这里 */
export const GITHUB_PROFILE_HREF = 'https://github.com/JacksonHe04';

/** 底栏署名用的名字：GitHub 用户名，比真名更像「这是谁的站」的账号入口 */
export const GITHUB_PROFILE_NAME = 'JacksonHe04';

/**
 * 底栏文案 —— **刻意固定英文，不随站点语言变**。
 *
 * 底栏是「署名 + 归属」性质的信息：技术名词、版权句在哪种语言下都长一个样，
 * 接着站点语言翻成中文反而违和。所以不进 labels（那才是随语言的地方），
 * 放在这里与其它中英共用的站点元信息作伴。`{models}` 是协作徽章的槽位。
 */
export const FOOTER = {
  builtWith: 'Built on these open-source projects',
  coBuiltWith: 'Built in collaboration with {models}',
  rights: 'All rights reserved',
  visits: '{visitors} visitors · {views} views',
} as const;

/**
 * 站点自己的地址。
 *
 * 用于 canonical、Open Graph 的绝对 URL 与结构化数据 —— 这几处都要求绝对地址，
 * 写死在这里比到处拼 request header 靠谱：部署域名会变，而公开地址不会。
 */
export const SITE_URL = 'https://inon.space';

/**
 * 站点归属的 profile。
 *
 * v3 与 world.inon.space 共用同一个 Supabase，也共用同一个 profile —— 访问统计、
 * 收藏条目都挂在这个 id 上。写成常量而不是环境变量：它不是密钥，
 * 而且换掉它意味着换成另一个人的站点，那属于改代码而不是改配置。
 */
export const SITE_PROFILE_ID = '2a9d3a63-41a4-4373-a3dd-e6defd16370e';

/**
 * 访问事件名 —— **与 world 站共用同一个**。
 *
 * 一开始给 v3 起了独立的事件名，想把两个站的流量分开算。但底栏那个数字的含义
 * 是「这个站被看过多少次」，而 v3 是新站：从 0 起算等于把过去两年的访问量抹掉。
 * 共用事件名之后，v3 的访问接着 world 的数据往下累加，读数就是站点的真实总量。
 *
 * 代价是底栏显示了两个域名合起来的量。这是作者明确要的口径。
 * 读取走 `page_view_site_totals`（按事件名读原始事件流，UV 用 ip_hash 去重）。
 */
export const SITE_VIEW_EVENT = 'page_view';
