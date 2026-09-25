/**
 * iNon v3 —— 内容模型
 *
 * 一份 Content 描述站点的全部静态内容（不含数据库里那部分：GALLERY 条目、群聊消息）。
 * 中文版见 `data/content.zh.ts`，英文版见 `data/content.en.ts`。
 *
 * 两份文件都必须 `satisfies Content` —— 少了字段、多了字段、类型写错，`tsc` 当场报错。
 * 这是「中英各一份」不会结构漂移的唯一保证，不要绕过它。
 *
 * 资源约定：
 *   机构 logo        public/logos/orgs/<id>.svg
 *   联系方式 logo    public/logos/contacts/<id>.svg
 *   其他图片         public/contact/<name>.<ext>
 * 所有路径字段一律写「以 / 开头的 public 内绝对路径」，如 `/logos/orgs/seu.svg`。
 */

/* -------------------------------------------------------------------------- */
/*  HOME · INFO                                                               */
/* -------------------------------------------------------------------------- */

/** 顶栏文案。路径见 lib/i18n.ts 的 ROUTES */
export interface Nav {
  home: string;
  life: string;
  gallery: string;
  /** WORLD 是离站外链，与其他项视觉上要区分开 */
  world: string;
}

/** 首屏左侧最上方：问候语 + 一句话自我介绍 + 感兴趣的方向 */
export interface Identity {
  /** 姓名，用于顶栏与页面标题 */
  name: string;
  /** 问候语，如「你好，我是何锦诚」 */
  greeting: string;
  /** 一句话自我介绍 */
  tagline: string;
  /** 感兴趣的方向 */
  directions: string[];
}

export type ExperienceKind = 'education' | 'work';

/** 一条经历（院校或实习） */
export interface Experience {
  /** 稳定 id，同时用于 logo 文件名 */
  id: string;
  kind: ExperienceKind;
  /** 机构名，如「东南大学」「Sand.ai」 */
  org: string;
  /** 学院 / 部门 / 团队，如「计算机科学与工程学院」「VidMuse」 */
  branch: string;
  /** 专业 / 岗位，如「人工智能」 */
  role: string;
  /** 时间区间，如「2023.08 – 2027.06」 */
  period: string;
  /** 城市，院校可省略 */
  location?: string;
  /** 一行动作描述，回答「在这里做了什么」 */
  description?: string;
  /** 机构 logo 路径 */
  logo: string;
}

export type ContactKind = 'link' | 'qrcode';

/** 一个联系方式。每一项本质都是一个链接，二维码是唯一例外 */
export interface Contact {
  id: string;
  /** 展示名，如「GitHub」「网易云音乐」 */
  label: string;
  /** 平台 logo 路径 */
  logo: string;
  kind: ContactKind;
  /** kind === 'link' 时的目标地址 */
  href?: string;
  /** kind === 'qrcode' 时弹窗里展示的图片 */
  qrImage?: string;
  /** kind === 'qrcode' 时弹窗里展示的账号文案 */
  qrCaption?: string;
}

/* -------------------------------------------------------------------------- */
/*  HOME · 我在做什么                                                          */
/* -------------------------------------------------------------------------- */

export interface Project {
  id: string;
  name: string;
  href: string;
  /** 一句话：这个东西是什么 / 解决了什么 */
  description: string;
  /**
   * 公开仓库地址。闭源项目**留空**，卡片上就不出现 GitHub 图标 ——
   * 这也是「这个项目不开源」的唯一表达方式，不要填私有仓库链接。
   */
  github?: string;
}

/* -------------------------------------------------------------------------- */
/*  LIFE                                                                      */
/* -------------------------------------------------------------------------- */

/** 成长经历中的一段城市轨迹 */
export interface GrowthStage {
  city: string;
  period: string;
  description: string;
}

/** 学历链条中的一段。比 HOME 的 experiences 更细：一直回溯到小学 */
export interface EducationStage {
  id: string;
  /** 学历，如「本科」「高中」「初中」「小学」 */
  degree: string;
  /** 学校，如「东南大学」「安徽省青阳中学」 */
  institution: string;
  /** 专业 / 班级，如「人工智能」「2班」 */
  major?: string;
  /** 时间区间，如「2022.09 – 2027.06」 */
  period: string;
  /** 导师；通常只有本科及以上才填 */
  advisors?: string[];
}

/** 偏好区的一个键值；values 多于一条时按顺序并列展示 */
export interface PreferenceItem {
  label: string;
  values: string[];
}

/** 偏好区的一个分组，如「关于我」「我的设备」「产品与品牌」 */
export interface PreferenceGroup {
  id: string;
  title: string;
  items: PreferenceItem[];
}

/** 观念区的一个条目，如「座右铭」「原则」「意识形态」 */
export interface Belief {
  id: string;
  title: string;
  /** 一条或多条，每条一个词、一句话或一段话 */
  items: string[];
}

/** 自由标签云 */
export interface TagCloud {
  /** 关键词 */
  keywords: string[];
  /** 自我标签 */
  tags: string[];
  /** 价值观 */
  values: string[];
}

export interface ExternalLink {
  label: string;
  href: string;
  /** 别人做的东西要署上是谁做的：名字会链到对方主页 */
  by?: { name: string; href: string };
  /**
   * 署名用哪一句 —— 关系是链接自身的属性，不是界面的：同一个列表里
   * 「朋友给我做的语录站」和「朋友的网站」说法不一样。
   * 默认 `made`。
   */
  byTemplate?: 'made' | 'owner';
}

export interface Life {
  /** 成长经历：城市轨迹，按时间倒序 */
  growth: GrowthStage[];
  /** 学历：从本科一路回溯到小学，按时间倒序 */
  education: EducationStage[];
  /** 标签云 */
  tags: TagCloud;
  /** 偏好：分组键值 */
  preferences: PreferenceGroup[];
  /** 观念 */
  beliefs: Belief[];
  /** 挂在 LIFE 下的外部链接（语录网站等） */
  links: ExternalLink[];
}

/* -------------------------------------------------------------------------- */
/*  GALLERY                                                                   */
/* -------------------------------------------------------------------------- */

/** GALLERY 的四个分类。数组是唯一事实源，类型从它派生 */
export const GALLERY_CATEGORY_IDS = ['indie-rock', 'hiphop', 'reading', 'films'] as const;

export type GalleryCategoryId = (typeof GALLERY_CATEGORY_IDS)[number];

/**
 * GALLERY 的分类定义。
 * 注意：分类名按设计固定用英文，不随语言变化。
 * 分类下的**条目**存在数据库（Supabase 的 library_items.category），不在内容文件里。
 */
export interface GalleryCategory {
  id: GalleryCategoryId;
  /** 展示名，固定英文 */
  name: string;
}

/* -------------------------------------------------------------------------- */
/*  WORLD                                                                     */
/* -------------------------------------------------------------------------- */

/** WORLD 是外链，指向换域名后的 v2 */
export interface World {
  href: string;
}

/* -------------------------------------------------------------------------- */
/*  ROOT                                                                      */
/* -------------------------------------------------------------------------- */

export type Locale = 'zh' | 'en';

/**
 * 界面文案。与「内容」区分开：这里放的是区块标题、按钮、占位符这类
 * 会出现在页面上但不属于个人信息的字符串。所有页面里的字都从这里取，
 * 组件内不得硬编码中文。
 *
 * 约束：**这里只能放纯数据**。labels 会整体从 Server Component 传给
 * Client Component，函数无法跨这个边界序列化（写错会在运行时抛出
 * "Functions cannot be passed directly to Client Components"）。
 * 需要插值就写成占位符，例如 chatCount 用 `{n}`。
 */
export interface Labels {
  /* HOME · 群聊。区块标题按设计去掉了，只留说明与状态 */
  chatSubtitle: string;
  chatEmpty: string;
  chatPlaceholder: string;
  chatSend: string;
  /**
   * AI 在群聊里显示的名字。
   *
   * 数据库里存的那一份是固定的（`ASSISTANT_NAME`）—— 群聊是所有人共用的一个房间，
   * 同一条消息对谁都必须是同一个身份。这里只管**怎么显示**，所以可以随语言变。
   */
  assistantName: string;
  /** 访客自己那条乐观消息的署名，等服务器返回真实身份前的占位 */
  you: string;
  /** 访客名字输入框的占位符，如「留下名字...」。不加说明文案，占位符自己说明用途 */
  chatNamePlaceholder: string;
  chatSending: string;
  /** 消息条数角标，`{n}` 会被替换成数字，如「{n} 条」 */
  chatCount: string;
  chatError: string;
  chatErrorTooFast: string;
  chatErrorTooLong: string;
  /** 全站节流命中：攒一会儿再发 */
  chatErrorBusy: string;

  /* HOME · 项目区末尾那张通向 GitHub 的卡片 */
  projectsMore: string;

  /* LIFE */
  growth: string;
  education: string;
  /** 导师前缀，如「导师：乔伊果 · 周德宇」 */
  advisor: string;
  tags: string;
  keywords: string;
  selfTags: string;
  values: string;
  preferences: string;
  beliefs: string;
  links: string;
  /**
   * 外部链接的署名模板：别人**给我做的**东西。
   * `{name}` 换成作者（链到主页），`{site}` 换成链接自己的文字（链到站点）。
   */
  linkByMade: string;
  /** 外部链接的署名模板：**是别人的站**。同样支持 `{name}` 与 `{site}` */
  linkByOwner: string;

  /* GALLERY · 二级 tab */
  gallery: string;
  /** 音乐分类里的专辑 */
  galleryAlbums: string;
  /** 音乐分类里的单曲 */
  gallerySongs: string;
  /** 读书 / 影视里的作品 */
  galleryWorks: string;
  /** 音乐人 / 作家 / 导演 */
  galleryCreators: string;
  galleryEmpty: string;

  /* 底栏 */
  /** 版权声明，跟在「© 年份 姓名」之后 */
  footerRights: string;
  /** 开源技术栈的引导语，如「基于以下开源项目构建」 */
  footerBuiltWith: string;
  /** AI 协作徽章的引导语。`{models}` 槽位会放两枚协作徽章，如「与 {models} 协作构建」 */
  footerCoBuilt: string;
  /** 访问统计，`{visitors}` 与 `{views}` 会被替换成数字 */
  footerVisits: string;

  /* 通用 */
  close: string;
  /** 主题切换按钮的无障碍名称。刻意与当前主题无关，避免两侧渲染出不同属性 */
  themeToggle: string;
  /** 语言切换按钮的无障碍名称。同上，描述动作而不是当前语言 */
  switchLanguage: string;
}

/** 服务端只回错误码，文案由客户端从 labels 里取 —— 保证多语言下也正确 */
export type ChatErrorCode = 'rate_limited' | 'busy' | 'too_long' | 'empty' | 'model_failed';

export interface Content {
  locale: Locale;

  /** 顶栏文案 */
  nav: Nav;

  /** 界面文案 */
  labels: Labels;

  /** HOME · 首屏左侧信息区 */
  identity: Identity;
  /** HOME · 经历（院校在前、实习在后） */
  experiences: Experience[];
  /** HOME · 联系方式 */
  contacts: Contact[];

  /** HOME · 我在做什么 */
  projects: Project[];

  /** LIFE */
  life: Life;

  /** GALLERY 分类定义 */
  gallery: GalleryCategory[];

  /** WORLD 外链 */
  world: World;
}
