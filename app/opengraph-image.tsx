import { ImageResponse } from 'next/og';

import { SITE_URL } from '@/lib/site-meta';

/**
 * 分享到社交平台时的那张卡。
 *
 * 用代码生成而不是手工做一张 PNG：字号、色值都取自站点的调性（纸与墨 + 墨绿），
 * 改了不用重新导一遍图。
 *
 * 文案**只用拉丁字符**是刻意的：ImageResponse 内置的字体不含中文字形，
 * 写中文会整片变成豆腐块。中文版卡面要等自带一份中文字体之后再说。
 */
export const alt = 'Jackson He · an AI Native product engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const PAPER = '#FEFDFB';
const INK = '#2E2A26';
const MUTED = '#6E6862';
const RULE = '#E0DDD8';
const GREEN = '#1F6B45';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: PAPER,
          color: INK,
          padding: '76px 84px',
        }}
      >
        <div style={{ display: 'flex', fontSize: 26, letterSpacing: 6, color: MUTED }}>
          INON.SPACE
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 88, fontWeight: 700, letterSpacing: -2 }}>
            Jackson He
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 22,
              fontSize: 36,
              lineHeight: 1.4,
              color: MUTED,
              maxWidth: 900,
            }}
          >
            An AI Native product engineer, full-stack developer and part-time FDE
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', height: 2, background: RULE, marginBottom: 26 }} />
          <div style={{ display: 'flex', gap: 28, fontSize: 28, color: MUTED }}>
            <span style={{ color: GREEN }}>{SITE_URL.replace('https://', '')}</span>
            <span>World Model · Coding Agent · Agent Memory</span>
          </div>
        </div>
      </div>
    ),
    size
  );
}
