import type { Metadata } from 'next';
import { Geist_Mono, Noto_Serif_SC, Source_Serif_4 } from 'next/font/google';

import { PageViewTracker } from '@/components/analytics/page-view-tracker';
import { Providers } from '@/components/providers';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { getSiteViewTotals } from '@/lib/analytics/queries';
import { getRequestContent } from '@/lib/content/server';
import { htmlLang } from '@/lib/i18n';
import { SITE_URL } from '@/lib/site-meta';
import { buildPersonSchema } from '@/lib/structured-data';
import { cn } from '@/lib/utils';
import './globals.css';

const sourceSerif = Source_Serif_4({
  variable: '--font-source-serif',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

/**
 * 中文衬线的**兜底**，排在字体栈的最后一位（见 app/globals.css）。
 *
 * Android 只内置 Noto Sans CJK，没有任何中文衬线，光靠 font-family 回退会让整站
 * 中文掉成黑体，所以必须自备一份。但因为排在系统字体之后，浏览器只在前面所有字体
 * 都覆盖不到某个字形时才会取它 —— 桌面端实测只请求 2 个西文文件，一个中文分片都不下。
 *
 * preload: false 也是同一个理由：中文没有 subset，Google Fonts 给的是几十个
 * unicode-range 分片，预加载会把它们全拉下来。
 */
const notoSerifSc = Noto_Serif_SC({
  variable: '--font-noto-serif-sc',
  weight: ['400', '600'],
  subsets: ['latin'],
  display: 'swap',
  preload: false,
});

/**
 * 全站元信息。
 *
 * `metadataBase` 不能省：Open Graph 与 canonical 都要求绝对地址，
 * 没有它 Next 只会在构建日志里警告一句，然后吐出不完整的标签。
 *
 * 语言由 cookie 决定，两种语言共用同一个 URL —— 爬虫没有 cookie，拿到的是默认语言。
 * 这是「切语言不改地址」这个设计的代价，短期接受。
 */
export async function generateMetadata(): Promise<Metadata> {
  const { locale, content } = await getRequestContent();
  const { identity } = content;
  const title = `${identity.name} · ${identity.tagline}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s · ${identity.name}`,
    },
    description: identity.tagline,
    keywords: [...identity.directions],
    authors: [{ name: identity.name, url: SITE_URL }],
    creator: identity.name,
    publisher: identity.name,
    category: 'technology',
    // 这是个人主页，不是名片：别让 iOS 把邮箱、电话自动识别成可点拨的链接
    formatDetection: { email: false, address: false, telephone: false },
    alternates: { canonical: '/' },
    openGraph: {
      type: 'profile',
      siteName: `${identity.name} · inon.space`,
      title,
      description: identity.tagline,
      url: SITE_URL,
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      alternateLocale: locale === 'zh' ? 'en_US' : 'zh_CN',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: identity.tagline,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // 语言来自 cookie，所以 html lang、顶栏、页脚、访问统计都在服务端一次渲染好
  const [{ locale, content }, stats] = await Promise.all([getRequestContent(), getSiteViewTotals()]);

  /*
   * 只在正式环境计数。本地开发与 preview 部署也是自己在访问，
   * 记进去会把底栏那个数字灌成假的。VERCEL_ENV 是 Vercel 注入的服务端变量，
   * 所以判断在服务端做完再告诉客户端（见 PageViewTracker 的注释）。
   */
  const trackViews = process.env.VERCEL_ENV === 'production';

  return (
    <html
      lang={htmlLang(locale)}
      suppressHydrationWarning
      className={cn(
        sourceSerif.variable,
        notoSerifSc.variable,
        geistMono.variable,
        'h-full antialiased'
      )}
    >
      <body className="flex min-h-full flex-col">
        {/*
          schema.org 的 Person：让搜索引擎知道「何锦诚」与 GitHub、Notion 等账号
          是同一个实体。`<` 转义成 \\u003c 是必须的 —— 内容里出现 </script> 之类的
          字面量会把标签提前闭合。
        */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildPersonSchema(content)).replace(/</g, '\\u003c'),
          }}
        />
        <Providers>
          <SiteHeader
            locale={locale}
            labels={content.labels}
            nav={content.nav}
            worldHref={content.world.href}
          />
          <main className="flex-1">{children}</main>
          <SiteFooter stats={stats} />
          <PageViewTracker enabled={trackViews} />
        </Providers>
      </body>
    </html>
  );
}
