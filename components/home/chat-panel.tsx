import { GroupChat } from '@/components/home/group-chat';
import { SkeletonBar } from '@/components/skeleton';
import { fetchSnapshot } from '@/lib/chat/queries';
import type { ChatSnapshot } from '@/lib/chat/types';
import type { Labels, Locale } from '@/lib/content/types';
import { cn } from '@/lib/utils';

/**
 * 群聊面板 —— 单独一层，为的是能把它放进 Suspense 边界里。
 *
 * 那条「取最近 40 条消息」的查询是首页最慢的一步：Supabase 与 Vercel 函数不在同一区域，
 * 实测每次要 400ms 以上（冷启动上秒）。放在页面顶层 await，就等于整个首页都要等它，
 * 线上 `/` 的 TTFB 1.4s、`/life` 0.56s，差的这 873ms 全是它。
 *
 * 挪进边界之后，页面骨架先流式出来，群聊稍后自己补上 —— 反正它的高度是固定的，
 * 后到也不会把版面顶动。
 */
export async function ChatPanel({ labels, locale }: { labels: Labels; locale: Locale }) {
  // 数据库抖一下不该让整页挂掉，群聊退回空态即可
  let initial: ChatSnapshot = { messages: [], suggested: [] };
  try {
    initial = await fetchSnapshot();
  } catch (error) {
    console.error('[home] 群聊快照加载失败', error);
  }

  return <GroupChat initial={initial} labels={labels} locale={locale} />;
}

/**
 * 骨架摆几条消息，每条正文的末行多长。
 *
 * 五条刚好占住一屏又不显得拥挤；末行长短不一才像真的段落，
 * 一水儿的等长方块一眼就看得出是占位。
 */
const SKELETON_ROWS = ['w-[72%]', 'w-[58%]', 'w-[66%]', 'w-[45%]', 'w-[61%]'] as const;

/**
 * 等待期间占位的骨架。
 *
 * 刻意**照着真实面板的盒子画**：同样的分隔线、同样的内边距、同样撑满高度，
 * 连消息的形状也是照抄的 —— 头像方块、名字一条、正文两条。
 * 内容后到时只是把里面的字填进去，盒子一点不动 —— 否则群聊落下的那一刻
 * 整页会往下一沉，那正是「切换时闪一下」的来源。
 *
 * 只留小标题、不写「还没有人说过话」：那句话是空态语义，会在数据到达前
 * 短暂地骗人一跳。
 */
export function ChatPanelFallback({ labels }: { labels: Labels }) {
  return (
    <section className="border-border flex h-full min-h-0 flex-col border-t pt-6 lg:border-t-0 lg:pt-0">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-muted-foreground text-[0.78rem]">{labels.chatSubtitle}</p>
      </div>

      {/*
        与真实消息列表同构：外面是 `relative flex-1` 的框，里面 `absolute inset-0`。
        绝对定位这一层对流布局而言是空的，所以骨架摆几条都不会把面板撑高 —— 这正是
        真实列表必须绝对定位的同一个理由（见 GroupChat）。
      */}
      <div className="border-border relative min-h-0 flex-1 border-t">
        <div className="absolute inset-0 overflow-hidden pt-4">
          <ol className="space-y-4">
            {SKELETON_ROWS.map((tail, row) => (
              <li key={tail} className="flex gap-2.5">
                <SkeletonBar className="mt-0.5 size-6 shrink-0 rounded-full" delay={row * 120} />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <SkeletonBar className="h-3 w-24" delay={row * 120} />
                  <SkeletonBar className="h-3 w-full" delay={row * 120} />
                  <SkeletonBar className={cn('h-3', tail)} delay={row * 120} />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
