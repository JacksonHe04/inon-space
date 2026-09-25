import type { Content } from '@/lib/content/types';

/**
 * iNon v3 —— English content
 *
 * Same shape as `content.zh.ts`, enforced by the `Content` type via `satisfies`.
 * Only text is translated: ids, hrefs, logo paths and asset paths must stay
 * byte-identical to the Chinese file, because the two files have to describe the
 * same person, the same projects and the same collection.
 *
 * 两份内容文件必须一一对应：只翻译文字，id / 链接 / logo 路径一律不动，
 * 否则同一份现实会被描述成两种样子。
 */
export const contentEn = {
  locale: 'en',

  nav: {
    home: 'HOME',
    life: 'LIFE',
    gallery: 'GALLERY',
    world: 'WORLD',
  },

  labels: {
    chatSubtitle: 'Leave a note here, together with everyone passing by',
    chatEmpty: 'Nobody has spoken yet. Will you be the first?',
    chatPlaceholder: 'Say something…',
    chatSend: 'Send',
    assistantName: 'Yingying',
    you: 'You',
    chatNamePlaceholder: 'Leave a name...',
    chatSending: 'Yingying is thinking…',
    chatCount: '{n} messages',
    chatError: 'The signal dropped. Try again.',
    chatErrorTooFast: 'That was quick. Take a breath and try again.',
    chatErrorTooLong: 'A message can be up to 500 characters.',
    chatErrorBusy: 'It is a little busy right now. Try again in a moment.',

    projectsMore: 'More fun little projects',

    growth: 'Growth',
    education: 'Education',
    advisor: 'Advisor: ',
    tags: 'Tags',
    keywords: 'Keywords',
    selfTags: 'Tags',
    values: 'Values',
    preferences: 'Preferences',
    beliefs: 'Beliefs',
    links: 'Links',
    // {name} links to the author, {site} is this link's own label, pointing at the site
    linkByMade: 'my friend {name} made me this {site}',
    linkByOwner: "my friend {name}'s {site}",

    gallery: 'Gallery',
    galleryAlbums: 'Albums',
    gallerySongs: 'Songs',
    galleryWorks: 'Works',
    galleryCreators: 'Creators',
    galleryEmpty: 'The collection is still being sorted.',

    footerRights: 'All rights reserved',
    footerBuiltWith: 'Built on these open-source projects',
    footerVisits: '{visitors} visitors · {views} views',

    close: 'Close',
    themeToggle: 'Toggle theme',
    switchLanguage: 'Switch language',
  },

  identity: {
    name: 'Jackson He',
    greeting: "Hi, I'm Jackson He",
    tagline: 'An AI Native product engineer, full-stack developer and part-time FDE',
    directions: [
      'World Model',
      'Multi-Modal',
      'Coding Agent',
      'AI DevOps',
      'Agent Memory',
      'Long Horizon',
      'AI in Gaming',
      'AI Music',
      'AI Emotion',
      '3D Model',
      'Developer Ecosystem',
      'Creator Ecosystem',
    ],
  },

  experiences: [
    // Schools
    {
      id: 'seu-ai',
      kind: 'education',
      org: 'Southeast University',
      branch: 'School of Computer Science and Engineering',
      role: 'Artificial Intelligence',
      period: '2023.08 – 2027.06',
      logo: '/logos/orgs/seu.svg',
    },
    {
      id: 'seu-cyber',
      kind: 'education',
      org: 'Southeast University',
      branch: 'School of Cyber Science and Engineering',
      role: 'Cyber Science and Engineering',
      period: '2022.08 – 2023.06',
      logo: '/logos/orgs/seu.svg',
    },

    // Internships, most recent first
    {
      id: 'sand-ai',
      kind: 'work',
      org: 'Sand.ai',
      branch: 'VidMuse',
      role: 'Product',
      period: '2026.07 – 2026.09',
      location: 'Beijing',
      description:
        'Built the VidMuse AppHub infrastructure from zero to one, iterated on the infinite-canvas Agent Harness, and supported the post-training data pipeline for in-house models',
      logo: '/logos/orgs/sand-ai.svg',
    },
    {
      id: 'meituan',
      kind: 'work',
      org: 'Meituan',
      branch: 'Fundamental Technology Department',
      role: 'Product',
      period: '2025.12 – 2026.07',
      location: 'Shanghai',
      description:
        'Built an enterprise Agent evaluation system from zero to one, shipped Agent Skills end to end, and tuned the ticket-handling Agent',
      logo: '/logos/orgs/meituan.svg',
    },
    {
      id: 'zai',
      kind: 'work',
      org: 'Z.ai',
      branch: 'Product Solutions Center',
      role: 'Product',
      period: '2025.08 – 2025.11',
      location: 'Beijing',
      description: 'Observability and model routing for an enterprise MaaS platform',
      logo: '/logos/orgs/zai.svg',
    },
  ],

  contacts: [
    {
      id: 'github',
      label: 'GitHub',
      logo: '/logos/contacts/github.svg',
      kind: 'link',
      href: 'https://github.com/JacksonHe04',
    },
    {
      id: 'wechat',
      label: 'WeChat',
      logo: '/logos/contacts/wechat.svg',
      kind: 'qrcode',
      qrImage: '/contact/wechat_qrcode.jpeg',
      qrCaption: 'JACKSONHE_04',
    },
    {
      id: 'lark',
      label: 'Lark',
      logo: '/logos/contacts/lark.svg',
      kind: 'link',
      href: 'https://www.feishu.cn/invitation/page/add_contact/?token=c0cu36f6-6570-4556-9ce1-00d6bdd450ab&unique_id=KHaU4URCXn_JgNpX5vVfeg==',
    },
    {
      id: 'gmail',
      label: 'Gmail',
      logo: '/logos/contacts/gmail.svg',
      kind: 'link',
      href: 'mailto:yingyingdontkill@gmail.com',
    },
    {
      id: 'notion',
      label: 'Notion',
      logo: '/logos/contacts/notion.svg',
      kind: 'link',
      href: 'https://jacksonhe04.notion.site',
    },
    {
      id: 'netease',
      label: 'NetEase',
      logo: '/logos/contacts/netease.svg',
      kind: 'link',
      href: 'https://music.163.com/#/user/home?id=8928646019',
    },
    {
      id: 'xiaohongshu',
      label: 'Xiaohongshu',
      logo: '/logos/contacts/xiaohongshu.svg',
      kind: 'link',
      href: 'https://www.xiaohongshu.com/user/profile/63578070000000001901f842',
    },
    {
      id: 'douyin',
      label: 'Douyin',
      logo: '/logos/contacts/douyin.svg',
      kind: 'link',
      href: 'https://v.douyin.com/aBZm_Fis9Mw',
    },
    {
      id: 'bilibili',
      label: 'Bilibili',
      logo: '/logos/contacts/bilibili.svg',
      kind: 'link',
      href: 'https://space.bilibili.com/454557384',
    },
  ],

  // An empty `github` means the project is closed source, so the card shows no icon
  projects: [
    {
      id: 'ondeskbot',
      name: 'OnDeskBot',
      href: 'https://ondeskbot.com',
      description:
        'Turns an ordinary phone into a remotely managed device that runs complex tasks on its own',
    },
    {
      id: 'palm-lab',
      name: 'PALM Lab',
      href: 'https://palmlab.cn',
      github: 'https://github.com/JacksonHe04/palm',
      description:
        'A graduate admissions system built for the PALM Lab at Southeast University, with 3,000+ applications so far',
    },
    {
      id: 'fde-anything',
      name: 'FDE Anything',
      href: 'https://fde.inon.space',
      description:
        'A self-hostable FDE Agent platform: the Agent is the atom, and Skills, Knowledge and MCPs are the reusable resources',
    },
    {
      id: 'okf-anything',
      name: 'OKF Anything',
      href: 'https://okf.inon.space',
      github: 'https://github.com/JacksonHe04/okf-anything',
      description:
        'Exports documents from Lark, Notion and everything else to local files in the standard Google OKF format',
    },
    {
      id: 'storytelling',
      name: 'Storytelling',
      href: 'https://story.inon.space',
      github: 'https://github.com/JacksonHe04/storytelling',
      description: 'A biography Skill: the Agent interviews you, then writes your biography',
    },
    {
      id: 'sayless',
      name: 'SAYLESS',
      href: 'https://sayless.inon.space',
      github: 'https://github.com/JacksonHe04/sayless',
      description: 'Get a clean, standard resume in minutes',
    },
  ],

  life: {
    growth: [
      {
        city: 'Beijing',
        period: '2026.07 – present',
        description: 'Back to Wudaokou — a sequel to that dream.',
      },
      {
        city: 'Shanghai',
        period: '2025.12 – 2026.06',
        description:
          'Yangpu, Ningguo Road, Changyang Campus, Huliandi.',
      },
      {
        city: 'Beijing',
        period: '2025.08 – 2025.11',
        description: 'Tsinghua campus, Xueyuan Road, Wudaokou — an internship that felt like a dream.',
      },
      {
        city: 'Nanjing',
        period: '2022.08 – present',
        description: 'The long slope… walking it once more.',
      },
      {
        city: 'Qingyang',
        period: '2004 – 2022',
        description: 'Behind Jiuhua Mountain — the years before I came of age.',
      },
    ],

    education: [
      {
        id: 'seu',
        degree: "Bachelor's",
        institution: 'Southeast University',
        major: 'Artificial Intelligence',
        period: '2022.09 – 2027.06',
        advisors: ['Yiguo Qiao', 'Deyu Zhou'],
      },
      {
        id: 'qingyang-high',
        degree: 'High school',
        institution: 'Qingyang High School, Anhui',
        major: 'Class 2',
        period: '2019.08 – 2022.06',
      },
      {
        id: 'qingyang-fourth',
        degree: 'Middle school',
        institution: 'Qingyang No. 4 Middle School',
        major: 'Class 3',
        period: '2016.09 – 2019.06',
      },
      {
        id: 'rongcheng-first',
        degree: 'Primary school',
        institution: 'Rongcheng Town No. 1 Primary School',
        major: 'Class 1',
        period: '2010.09 – 2016.06',
      },
    ],

    tags: {
      keywords: ['Development', 'AI', 'Music', 'Freedom', 'Product', 'Agent', 'LLM', 'World Model'],
      tags: [
        'Open-source contributor',
        'AI Native developer',
        'Post-rock listener',
        'Hip-hop listener',
        'Xiaomi fan',
        'Agent wrangler',
      ],
      values: ['Honest', 'Open', 'Sincere', 'Careful', 'Devoted'],
    },

    preferences: [
      {
        id: 'about',
        title: 'About me',
        items: [
          { label: 'MBTI in life', values: ['INFP'] },
          { label: 'MBTI at work', values: ['INTJ'] },
          { label: 'Star sign', values: ['Scorpio'] },
          { label: 'Routine', values: ['Asleep at 1, up at 8'] },
          { label: 'Favourite food', values: ['Korean BBQ', 'Barbecue', '7-Eleven', 'Lettuce'] },
          { label: 'Favourite drinks', values: ['Genki Forest', 'Sugar-free tea', 'Sugar-free cola'] },
        ],
      },
      {
        id: 'devices',
        title: 'My devices',
        items: [
          { label: 'Phone', values: ['iPhone Air'] },
          { label: 'Laptop', values: ['MacBook Air M2'] },
          { label: 'Watch', values: ['Xiaomi Smart Band 9 Pro'] },
          {
            label: 'Headphones',
            values: ['Nothing Headphone (a)', 'Edifier W820NB', '233621 Hush'],
          },
        ],
      },
      {
        id: 'products',
        title: 'Products and brands',
        items: [
          { label: 'Favourite products', values: ['Notion', 'Vercel'] },
          { label: 'Recommended', values: ['Raycast'] },
          { label: 'Favourite brands', values: ['Xiaomi', 'Apple'] },
        ],
      },
    ],

    beliefs: [
      {
        id: 'motto',
        title: 'Motto',
        items: [
          'Self-evolving and self-closing, like an Agent',
          "It's Now or Never",
          'Devoted to all of you',
        ],
      },
      { id: 'principles', title: 'Principles', items: ['Practice', 'ROI', 'Clean'] },
      { id: 'philosophy', title: 'Personal philosophy', items: ['Postmodernism', 'Nietzsche'] },
      { id: 'industry', title: 'Industry bets', items: ['World models', 'Coding Agents'] },
      {
        id: 'ideology',
        title: 'Ideology',
        items: ['Social liberalism', 'Social democracy', 'Welfarism', 'Pragmatic moderate'],
      },
      {
        id: 'macro-vision',
        title: 'Macro vision',
        items: ['Infinite Tsukuyomi', 'World models and games'],
      },
      { id: 'personal-vision', title: 'Personal vision', items: ['Make a lot of money', 'Lie flat in a big flat'] },
    ],

    // A link with `by` renders as one sentence (labels.linkByMade / linkByOwner), so the
    // label reads mid-sentence here — hence the lowercase
    links: [
      {
        label: 'quote site',
        href: 'https://yvette-wanan.github.io/jackson-quotes',
        by: { name: 'Jingyi Wan', href: 'https://github.com/yvette-wanan' },
      },
      {
        label: 'personal website',
        href: 'https://xiaobaozi.cn',
        by: { name: 'Ziye Tang', href: 'https://github.com/ZeroTang05' },
        byTemplate: 'owner',
      },
    ],
  },

  gallery: [
    { id: 'indie-rock', name: 'INDIE / ROCK' },
    { id: 'hiphop', name: 'HIPHOP' },
    { id: 'reading', name: 'READING' },
    { id: 'films', name: 'FILMS' },
  ],

  world: {
    // The subdomain needs the slug — its root is a different entry point (the empty slug)
    href: 'https://world.inon.space/JacksonHe04?mode=world',
  },
} satisfies Content;
