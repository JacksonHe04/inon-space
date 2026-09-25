import type { Metadata } from 'next';
import { Geist_Mono, Noto_Serif_SC, Source_Serif_4 } from 'next/font/google';

import { Providers } from '@/components/providers';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { getRequestContent } from '@/lib/content/server';
import { htmlLang } from '@/lib/i18n';
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

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getRequestContent();
  return {
    title: {
      default: `${content.identity.name} · ${content.identity.tagline}`,
      template: `%s · ${content.identity.name}`,
    },
    description: content.identity.tagline,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // 语言来自 cookie，所以 html lang、顶栏、页脚都在服务端一次渲染好
  const { locale, content } = await getRequestContent();

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
        <Providers>
          <SiteHeader
            locale={locale}
            labels={content.labels}
            nav={content.nav}
            worldHref={content.world.href}
            gallery={content.gallery}
          />
          <main className="flex-1">{children}</main>
          <SiteFooter name={content.identity.name} labels={content.labels} />
        </Providers>
      </body>
    </html>
  );
}
