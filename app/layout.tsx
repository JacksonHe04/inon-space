import type { Metadata } from 'next';
import { Geist_Mono, Source_Serif_4 } from 'next/font/google';

import { Providers } from '@/components/providers';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { getRequestContent } from '@/lib/content/server';
import { htmlLang } from '@/lib/i18n';
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
      className={`${sourceSerif.variable} ${geistMono.variable} h-full antialiased`}
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
