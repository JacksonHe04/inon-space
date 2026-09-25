import type { Content } from '@/lib/content/types';

/**
 * iNon v3 —— 中文内容
 *
 * 结构由 `@/lib/content/types` 的 `Content` 约束，`satisfies` 保证 key 不漂移。
 * 标了 TODO 的地方是还没定稿的内容，等你填；其余内容均来自 260925 设计文档。
 *
 * 待补资源：
 *   public/logos/contacts/*.svg —— 9 个联系方式平台 logo（尚未放入）
 */
export const contentZh = {
  locale: 'zh',

  nav: {
    home: 'HOME',
    life: 'LIFE',
    gallery: 'GALLERY',
    world: 'WORLD',
  },

  labels: {
    // HOME · 群聊：区块标题按设计去掉了，只留说明与状态
    chatSubtitle: '和路过这里的朋友一起，留下点记录',
    chatEmpty: '还没有人说过话。第一个开口的会是你吗？',
    chatPlaceholder: '说点什么…',
    chatSend: '发送',
    assistantName: '小缨缨',
    you: '你',
    chatNamePlaceholder: '留下名字...',
    chatSending: '小缨缨正在想…',
    chatCount: '{n} 条',
    chatError: '信号没接上，再试一次。',
    chatErrorTooFast: '说得太快了，歇一会儿再说。',
    chatErrorTooLong: '一条消息最多 500 个字。',
    chatErrorBusy: '这会儿人有点多，等一下再发。',

    // HOME · 项目区末尾那张通向 GitHub 的卡片
    projectsMore: '更多有意思的小项目',

    growth: '成长经历',
    education: '教育经历',
    advisor: '导师：',
    tags: '标签',
    keywords: '关键词',
    selfTags: '标签',
    values: '价值观',
    preferences: '偏好',
    beliefs: '观念',
    links: '链接',
    // {name} 链到作者主页，{site} 就是这条链接自己的文字，链到站点本身
    linkByMade: '我的朋友 {name} 给我做的{site}',
    linkByOwner: '我的朋友 {name} 的{site}',

    // GALLERY 二级 tab
    gallery: '收藏',
    galleryAlbums: '专辑',
    gallerySongs: '单曲',
    galleryWorks: '作品',
    galleryCreators: '创作者',
    galleryEmpty: '收藏条目正在整理中。',

    close: '关闭',
    themeToggle: '切换主题',
    switchLanguage: '切换语言',
  },

  identity: {
    name: '何锦诚',
    greeting: '你好，我是何锦诚',
    tagline: '一位 AI Native 产品工程师 & 全栈开发者 & 兼职 FDE',
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
    // 院校
    {
      id: 'seu-ai',
      kind: 'education',
      org: '东南大学',
      branch: '计算机科学与工程学院',
      role: '人工智能',
      period: '2023.08 – 2027.06',
      logo: '/logos/orgs/seu.svg',
    },
    {
      id: 'seu-cyber',
      kind: 'education',
      org: '东南大学',
      branch: '网络空间安全学院',
      role: '网络空间安全',
      period: '2022.08 – 2023.06',
      logo: '/logos/orgs/seu.svg',
    },

    // 实习（倒序）
    {
      id: 'sand-ai',
      kind: 'work',
      org: 'Sand.ai',
      branch: 'VidMuse',
      role: '产品',
      period: '2026.07 – 2026.09',
      location: '北京',
      description:
        'VidMuse AppHub 0-1 Infra 建设，无限画布 Agent Harness 迭代优化，自研模型后训练数据管道支持',
      logo: '/logos/orgs/sand-ai.svg',
    },
    {
      id: 'meituan',
      kind: 'work',
      org: '美团',
      branch: '基础技术部',
      role: '产品',
      period: '2025.12 – 2026.07',
      location: '上海',
      description: '企业级 Agent 评估体系 0-1 搭建，Agent Skills 全链路落地，工单 Agent 能力调优',
      logo: '/logos/orgs/meituan.svg',
    },
    {
      id: 'zai',
      kind: 'work',
      org: '智谱',
      branch: '产品解决方案中心',
      role: '产品',
      period: '2025.08 – 2025.11',
      location: '北京',
      description: '企业级 MaaS 平台可观测与模型路由',
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

  // github 留空 = 不开源，卡片上就不出现 GitHub 图标
  projects: [
    {
      id: 'ondeskbot',
      name: 'OnDeskBot',
      href: 'https://ondeskbot.com',
      description: '把普通手机变成可远程托管、执行复杂任务的自动化设备',
    },
    {
      id: 'palm-lab',
      name: 'PALM Lab',
      href: 'https://palmlab.cn',
      github: 'https://github.com/JacksonHe04/palm',
      description: '为东南大学 PALM 实验室打造的研究生招生系统，累计 3000+ 人次申请',
    },
    {
      id: 'fde-anything',
      name: 'FDE Anything',
      href: 'https://fde.inon.space',
      description:
        '可私有化部署的 FDE Agent 平台：Agent 是原子，Skill / Knowledge / MCP 是可复用资源',
    },
    {
      id: 'okf-anything',
      name: 'OKF Anything',
      href: 'https://okf.inon.space',
      github: 'https://github.com/JacksonHe04/okf-anything',
      description: '把飞书、Notion 等一切文档导出到本地并转换为标准的 Google OKF 格式',
    },
    {
      id: 'storytelling',
      name: 'Storytelling',
      href: 'https://story.inon.space',
      github: 'https://github.com/JacksonHe04/storytelling',
      description: '传记 Skill：让 Agent 采访你并帮你写传记',
    },
    {
      id: 'sayless',
      name: 'SAYLESS',
      href: 'https://sayless.inon.space',
      github: 'https://github.com/JacksonHe04/sayless',
      description: '快速获得一份标准美观的简历',
    },
  ],

  life: {
    growth: [
      {
        city: '北京',
        period: '2026.07 – 现在',
        description: '又回到五道口。同一场梦的续集。',
      },
      {
        city: '上海',
        period: '2025.12 – 2026.06',
        description: '杨浦区、宁国路、长阳创谷、互联宝地。',
      },
      {
        city: '北京',
        period: '2025.08 – 2025.11',
        description: '清华园、学院路、五道口——像一场梦一样的实习生活。',
      },
      {
        city: '南京',
        period: '2022.08 – 现在',
        description: '长长的坡道⋯⋯再走一遍。',
      },
      {
        city: '青阳',
        period: '2004 – 2022',
        description: '九华后山，成年前的岁月鸿沟。',
      },
    ],

    // 比 HOME 的 experiences 更细：一路回溯到小学
    education: [
      {
        id: 'seu',
        degree: '本科',
        institution: '东南大学',
        major: '人工智能',
        period: '2022.09 – 2027.06',
        advisors: ['乔伊果', '周德宇'],
      },
      {
        id: 'qingyang-high',
        degree: '高中',
        institution: '安徽省青阳中学',
        major: '2班',
        period: '2019.08 – 2022.06',
      },
      {
        id: 'qingyang-fourth',
        degree: '初中',
        institution: '青阳县第四中学',
        major: '3班',
        period: '2016.09 – 2019.06',
      },
      {
        id: 'rongcheng-first',
        degree: '小学',
        institution: '蓉城镇第一小学',
        major: '1班',
        period: '2010.09 – 2016.06',
      },
    ],

    tags: {
      keywords: ['开发', 'AI', '音乐', '自由', '产品', 'Agent', 'LLM', 'World Model'],
      tags: [
        '开源贡献者',
        'AI Native 开发者',
        '后摇滚爱好者',
        '说唱爱好者',
        '米粉',
        'Agent 驾驭师',
      ],
      values: ['诚实', 'OPEN', '真诚', '认真', 'DEVOTED'],
    },

    preferences: [
      {
        id: 'about',
        title: '关于我',
        items: [
          { label: '生活 MBTI', values: ['INFP'] },
          { label: '工作 MBTI', values: ['INTJ'] },
          { label: '星座', values: ['天蝎座'] },
          { label: '习惯', values: ['1 点睡觉，8 点起床'] },
          { label: '最爱食物', values: ['烤肉', '烧烤', '711', '生菜'] },
          { label: '最爱饮品', values: ['元气森林', '无糖茶', '无糖可乐'] },
        ],
      },
      {
        id: 'devices',
        title: '我的设备',
        items: [
          { label: '手机', values: ['iPhone Air'] },
          { label: '电脑', values: ['MacBook Air M2'] },
          { label: '手表', values: ['小米手环 9 Pro'] },
          { label: '耳机', values: ['Nothing Headphone(a)', '漫步者 W820NB', '233621 Hush'] },
        ],
      },
      {
        id: 'products',
        title: '产品与品牌',
        items: [
          { label: '最爱产品', values: ['Notion', 'Vercel'] },
          { label: '推荐产品', values: ['Raycast'] },
          { label: '最爱品牌', values: ['小米', 'Apple'] },
        ],
      },
    ],

    beliefs: [
      {
        id: 'motto',
        title: '座右铭',
        items: ['像 Agent 一样自进化、自闭环', "It's Now or Never", 'Devoted to all of you'],
      },
      { id: 'principles', title: '原则', items: ['Practice', 'ROI', 'Clean'] },
      { id: 'philosophy', title: '个人哲学', items: ['后现代主义', '尼采'] },
      { id: 'industry', title: '行业观点', items: ['世界模型', 'Coding Agent'] },
      {
        id: 'ideology',
        title: '意识形态',
        items: ['社会自由主义', '社会民主主义', '福利主义', '实践温和派'],
      },
      { id: 'macro-vision', title: '宏观愿景', items: ['无限月读', '世界模型与游戏'] },
      { id: 'personal-vision', title: '个人愿景', items: ['赚大钱', '躺大平'] },
    ],

    // 带 by 的链接整行会渲染成 labels.linkByMade / linkByOwner 那句话：label 作为 {site}
    // 填进去，by.name 作为 {name} —— 两个都是链接，分别指向站点本身和作者主页
    links: [
      {
        label: '语录网站',
        href: 'https://yvette-wanan.github.io/jackson-quotes',
        by: { name: '万竞屹', href: 'https://github.com/yvette-wanan' },
      },
      {
        label: '个人网站',
        href: 'https://xiaobaozi.cn',
        by: { name: '唐梓烨', href: 'https://github.com/ZeroTang05' },
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
    // 二级域名后面要带 slug —— 根路径走的是另一个入口（空的 slug），指向明确的路由更稳
    href: 'https://world.inon.space/JacksonHe04?mode=world',
  },
} satisfies Content;
