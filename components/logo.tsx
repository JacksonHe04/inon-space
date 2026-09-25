import { cn } from '@/lib/utils';

interface LogoProps {
  src: string;
  /** 无障碍名称；也用作图片的 alt */
  alt: string;
  /**
   * 单色矢量图标：走 CSS mask 染成 currentColor，明暗主题自动跟随。
   *
   * 平台图标（public/logos/contacts/）开这个。**彩色品牌 logo 不要开** ——
   * mask 取的是形状，会把美团黄、校徽绿一起压成一个色块。
   * 院校与企业 logo（public/logos/orgs/）保留原色，直接当图片渲染。
   */
  monochrome?: boolean;
  className?: string;
}

/**
 * 一个 logo。
 *
 * 单色那批必须走 mask 而不是 `<img>`：SVG 里的 `currentColor` 在 `<img>` 里
 * 解析不到外层主题，会一律渲染成黑色 —— 深色模式下整排图标直接消失。
 *
 * 尺寸一律由 className 给（h-* / w-*），这里不预设，保持调用方说了算。
 */
export function Logo({ src, alt, monochrome, className }: LogoProps) {
  if (monochrome) {
    const mask = `url("${src}")`;
    return (
      <span
        role="img"
        aria-label={alt}
        style={{
          maskImage: mask,
          WebkitMaskImage: mask,
          maskSize: 'contain',
          WebkitMaskSize: 'contain',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskPosition: 'center',
        }}
        className={cn('inline-block shrink-0 bg-current', className)}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- public/ 下的本地 SVG，不需要 next/image
    <img src={src} alt={alt} loading="lazy" className={cn('shrink-0 object-contain', className)} />
  );
}
