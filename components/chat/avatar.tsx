import type { CSSProperties, ReactNode } from 'react';
import { avatarFromSeed, type AvatarShape, type AvatarSpec } from '@/lib/chat/avatar';
import { cn } from '@/lib/utils';

const SHAPE_GLYPHS: Record<AvatarShape, ReactNode> = {
  circle: <circle cx="12" cy="12" r="5" />,
  square: <rect x="7.5" y="7.5" width="9" height="9" />,
  diamond: <path d="M12 6.5 17.5 12 12 17.5 6.5 12z" />,
  triangle: <path d="M12 6.8 17.6 16.4H6.4z" />,
  hexagon: <path d="M12 6.6l4.7 2.7v5.4L12 17.4l-4.7-2.7v-5.4z" />,
  quarter: <path d="M6.5 6.5H17.5V17.5A11 11 0 0 1 6.5 6.5z" />,
};

interface AvatarProps {
  spec: AvatarSpec;
  className?: string;
  title?: string;
}

/** 颜色 + 图形都由 seed 推导，不加载任何图片 */
export function Avatar({ spec, className, title }: AvatarProps) {
  return (
    <span
      aria-hidden
      title={title}
      style={{ '--avatar-hue': spec.hue } as CSSProperties}
      className={cn(
        'avatar inline-flex size-6 shrink-0 items-center justify-center rounded-full',
        className
      )}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-3">
        {SHAPE_GLYPHS[spec.shape]}
      </svg>
    </span>
  );
}

export function SeedAvatar({ seed, className, title }: Omit<AvatarProps, 'spec'> & { seed: string }) {
  return <Avatar spec={avatarFromSeed(seed)} className={className} title={title} />;
}
