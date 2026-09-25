'use client';

import { useEffect, useRef, useState } from 'react';
import { Logo } from '@/components/logo';
import type { Contact } from '@/lib/content/types';

/**
 * 联系方式：一排单色 logo。
 *
 * 绝大多数项本质是一个链接，直接开新标签页；唯一的例外是二维码类
 * （微信），点了在当前页弹窗展示，不跳走。
 */
export function ContactRow({ items, closeLabel }: { items: Contact[]; closeLabel: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<Contact | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (active && !dialog.open) dialog.showModal();
    if (!active && dialog.open) dialog.close();
  }, [active]);

  return (
    <>
      <ul className="flex flex-wrap items-center gap-x-5 gap-y-3">
        {items.map((item) => (
          <li key={item.id}>
            {item.kind === 'link' && item.href ? (
              <a
                href={item.href}
                target={item.href.startsWith('mailto:') ? undefined : '_blank'}
                rel="noreferrer"
                title={item.label}
                aria-label={item.label}
                className="text-muted-foreground hover:text-foreground inline-flex no-underline transition-colors hover:no-underline"
              >
                <Logo src={item.logo} alt={item.label} monochrome className="size-[18px]" />
              </a>
            ) : (
              <button
                type="button"
                title={item.label}
                aria-label={item.label}
                onClick={() => setActive(item)}
                className="text-muted-foreground hover:text-foreground inline-flex transition-colors"
              >
                <Logo src={item.logo} alt={item.label} monochrome className="size-[18px]" />
              </button>
            )}
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        onClose={() => setActive(null)}
        onClick={(event) => {
          // 点遮罩关闭：dialog 自身就是遮罩层
          if (event.target === dialogRef.current) setActive(null);
        }}
        className="bg-background text-foreground border-border m-auto max-w-[min(20rem,90vw)] border p-6 backdrop:bg-black/40"
      >
        {active?.qrImage ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="kicker">{active.label}</p>
            {/* eslint-disable-next-line @next/next/no-img-element -- 本地二维码图片 */}
            <img src={active.qrImage} alt={`${active.label} 二维码`} className="w-52" />
            {active.qrCaption ? (
              <p className="font-mono text-sm tracking-wide">{active.qrCaption}</p>
            ) : null}
            <button
              type="button"
              onClick={() => setActive(null)}
              className="text-muted-foreground hover:text-foreground text-xs underline"
            >
              {closeLabel}
            </button>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
