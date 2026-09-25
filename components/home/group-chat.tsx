'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useIsClient } from '@/lib/use-is-client';
import { Avatar, SeedAvatar } from '@/components/chat/avatar';
import { ASSISTANT_AVATAR } from '@/lib/chat/avatar';
import {
  CHAT_MAX_LENGTH,
  CHAT_NAME_MAX_LENGTH,
  rowToMessage,
  type ChatMessage,
  type ChatMessageRow,
  type ChatSnapshot,
} from '@/lib/chat/types';
import type { ChatErrorCode, Labels, Locale } from '@/lib/content/types';
import { htmlLang } from '@/lib/i18n';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { fillTemplate } from '@/lib/template';
import { cn } from '@/lib/utils';

interface GroupChatProps {
  initial: ChatSnapshot;
  labels: Labels;
  locale: Locale;
}

/** AI 标识。中英文里都是「AI」，不随语言变，所以不做成 label */
const AI_BADGE = 'AI';

/** 访客自填名字在浏览器里的存放位置 */
const NAME_STORAGE_KEY = 'inon_chat_name';

/** 去重 + 按时间排序：自己的乐观消息和 realtime 推来的同一条会撞车 */
function mergeMessages(current: ChatMessage[], incoming: ChatMessage[]): ChatMessage[] {
  const byId = new Map(current.map((message) => [message.id, message]));
  for (const message of incoming) byId.set(message.id, message);
  return [...byId.values()].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

/**
 * 认领「自己刚发的那条」。
 *
 * 乐观消息用的是本地 id（`local-…`），数据库那条回来时带的是 uuid，两者对不上，
 * 光按 id 去重是拦不住的 —— 自己那句话会在群里显示两遍，直到 POST 返回才收敛成一条。
 * 所以发出去时先把正文登记进来，Realtime 推回来时按正文认领。
 *
 * 副作用（从登记表里摘掉）放在 updater 之外做，React 严格模式下 updater 会被跑两遍。
 */
function takePendingId(pending: Map<string, string>, message: ChatMessage): string | null {
  if (message.role !== 'visitor') return null;
  for (const [id, content] of pending) {
    if (content === message.content) {
      pending.delete(id);
      return id;
    }
  }
  return null;
}

export function GroupChat({ initial, labels, locale }: GroupChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initial.messages);
  const [suggested, setSuggested] = useState<string[]>(initial.suggested);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // 访客给自己起的名字。空着就用服务端按地理头推出来的那个
  const [name, setName] = useState('');
  // 时间只在客户端格式化：服务端时区和访客时区未必一致，放服务端渲染会水合不上
  const isClient = useIsClient();

  const scrollRef = useRef<HTMLDivElement>(null);
  /** 已发出、还没落库回来的乐观消息：tempId -> 正文。见 takePendingId */
  const pendingRef = useRef(new Map<string, string>());

  // 实时订阅：群里有人说话，所有人都能看到
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    const channel = supabase
      .channel('public:chat_messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        (payload) => {
          const message = rowToMessage(payload.new as ChatMessageRow);
          // 如果这条就是自己刚发的，撤掉乐观副本，只留数据库这一条
          const optimisticId = takePendingId(pendingRef.current, message);
          setMessages((prev) =>
            mergeMessages(
              optimisticId ? prev.filter((one) => one.id !== optimisticId) : prev,
              [message]
            )
          );
          if (message.suggestedQuestions.length > 0) {
            setSuggested(message.suggestedQuestions);
          }
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  // 名字存本地：群聊是常来常往的地方，不该每次都让人重打一遍
  useEffect(() => {
    try {
      setName(window.localStorage.getItem(NAME_STORAGE_KEY) ?? '');
    } catch {
      // 隐私模式下 localStorage 会抛错，那就当没存过
    }
  }, []);

  // 新消息进来滚到底
  useEffect(() => {
    const element = scrollRef.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [messages.length, sending]);

  const errorText = useMemo<Record<ChatErrorCode, string>>(
    () => ({
      rate_limited: labels.chatErrorTooFast,
      busy: labels.chatErrorBusy,
      too_long: labels.chatErrorTooLong,
      empty: labels.chatError,
      model_failed: labels.chatError,
    }),
    [labels]
  );

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || sending) return;

      const trimmedName = name.trim().slice(0, CHAT_NAME_MAX_LENGTH);

      setInput('');
      setError(null);
      setSending(true);

      const tempId = `local-${Date.now()}`;
      pendingRef.current.set(tempId, text);
      setMessages((prev) =>
        mergeMessages(prev, [
          {
            id: tempId,
            createdAt: new Date().toISOString(),
            role: 'visitor',
            content: text,
            displayName: trimmedName || labels.you,
            locationLabel: null,
            avatarSeed: tempId,
            suggestedQuestions: [],
          },
        ])
      );

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: text, locale, name: trimmedName }),
        });
        const data = await response.json();

        // Realtime 可能已经把这条认领走了，这里再删一次是无害的
        pendingRef.current.delete(tempId);
        setMessages((prev) => {
          const withoutTemp = prev.filter((message) => message.id !== tempId);
          const confirmed = [data.visitor, data.assistant].filter(Boolean) as ChatMessage[];
          return mergeMessages(withoutTemp, confirmed);
        });

        if (data.error) {
          setError(errorText[data.error as ChatErrorCode] ?? labels.chatError);
        }
      } catch {
        pendingRef.current.delete(tempId);
        setMessages((prev) => prev.filter((message) => message.id !== tempId));
        setError(labels.chatError);
      } finally {
        setSending(false);
      }
    },
    [errorText, labels, locale, name, sending]
  );

  return (
    /*
     * h-full + min-h-0：高度由外层定死，消息列表才能真的在自己的框里滚起来。
     *
     * 分隔线只在窄屏出现：那里左栏和群聊是上下叠的，需要一条线把两者分开；
     * 宽屏是左右并排，群聊从自己的顶部开始往下排，上面再来一条线是多余的。
     */
    <section className="border-border flex h-full min-h-0 flex-col border-t pt-6 lg:border-t-0 lg:pt-0">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-muted-foreground text-[0.78rem]">{labels.chatSubtitle}</p>
        <span className="text-muted-foreground text-[0.7rem] tabular-nums">
          {fillTemplate(labels.chatCount, { n: messages.length })}
        </span>
      </div>

      {/*
        消息列表绝对定位：在流内的消息会用 max-content 撑高外层，行高就跟着消息条数涨，
        固定高度就白设了。绝对定位之后这一层对流布局而言是空的，高度只由外层说了算。
      */}
      <div className="border-border relative min-h-0 flex-1 border-t">
        <div ref={scrollRef} className="absolute inset-0 overflow-y-auto pt-4">
          {messages.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center text-[0.82rem]">
              {labels.chatEmpty}
            </p>
          ) : (
            <ol className="space-y-4">
              {messages.map((message) => {
                const isAssistant = message.role === 'assistant';
                return (
                  <li key={message.id} className="flex gap-2.5">
                    {isAssistant ? (
                      <Avatar spec={ASSISTANT_AVATAR} className="mt-0.5" />
                    ) : (
                      <SeedAvatar seed={message.avatarSeed} className="mt-0.5" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <span
                          className={cn(
                            'text-[0.8rem] font-medium',
                            isAssistant && 'text-link'
                          )}
                        >
                          {/* AI 的名字按当前语言显示；数据库里存的那份是全局唯一的 */}
                          {isAssistant ? labels.assistantName : message.displayName}
                        </span>
                        {isAssistant ? (
                          <span
                            className={cn(
                              'border-border text-muted-foreground self-center rounded-xs border',
                              'px-1 py-px text-[0.58rem] leading-none tracking-wider'
                            )}
                          >
                            {AI_BADGE}
                          </span>
                        ) : null}
                        {isClient ? (
                          <time
                            dateTime={message.createdAt}
                            className="text-muted-foreground text-[0.68rem] tabular-nums"
                          >
                            {formatTimestamp(message.createdAt, locale)}
                          </time>
                        ) : null}
                      </div>
                      <p className="mt-0.5 text-[0.88rem] leading-relaxed whitespace-pre-wrap text-pretty">
                        {message.content}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}

          {sending ? (
            <p className="text-muted-foreground mt-4 text-[0.78rem] italic">
              {labels.chatSending}
            </p>
          ) : null}
        </div>
      </div>

      <div className="border-border mt-4 border-t pt-4">
        {/*
          模型每次回复都会附带三个「接下来可能想问的」，就摆在输入框正上方。
          刻意**不加标题**：这几个词本身就是问题，一看就知道能点，
          再加一行「还可以聊」只是多一道需要读的字。
        */}
        {suggested.length > 0 ? (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {suggested.map((question) => (
              <button
                key={question}
                type="button"
                disabled={sending}
                onClick={() => void send(question)}
                className={cn(
                  'chip',
                  'hover:border-foreground/40 hover:text-foreground',
                  'disabled:cursor-not-allowed disabled:opacity-50'
                )}
              >
                {question}
              </button>
            ))}
          </div>
        ) : null}

        {/*
          名字与正文同一行：名字在左、正文占满剩余空间。
          名字没有标签文案 —— 占位符本身就说清了这里是干什么的，
          再补一句说明只会把这一行撑长。
        */}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void send(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            name="visitor-name"
            value={name}
            onChange={(event) => {
              const next = event.target.value;
              setName(next);
              try {
                window.localStorage.setItem(NAME_STORAGE_KEY, next);
              } catch {
                // 隐私模式下写不进去就算了，不影响这次会话
              }
            }}
            maxLength={CHAT_NAME_MAX_LENGTH}
            placeholder={labels.chatNamePlaceholder}
            aria-label={labels.chatNamePlaceholder}
            className={cn(
              'border-border bg-transparent placeholder:text-muted-foreground/70',
              'focus:border-foreground/40 rounded-xs w-20 shrink-0 border px-2.5 py-2',
              'text-[0.85rem] outline-none transition-colors sm:w-24'
            )}
          />
          <input
            name="message"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            maxLength={CHAT_MAX_LENGTH}
            placeholder={labels.chatPlaceholder}
            aria-label={labels.chatPlaceholder}
            className={cn(
              'border-border bg-transparent placeholder:text-muted-foreground/70',
              'focus:border-foreground/40 rounded-xs min-w-0 flex-1 border px-3 py-2',
              'text-[0.85rem] outline-none transition-colors'
            )}
          />
          <button
            type="submit"
            disabled={sending || input.trim().length === 0}
            className={cn(
              'border-border hover:border-foreground/40 rounded-xs shrink-0 border px-3 py-2',
              'text-[0.78rem] transition-colors disabled:cursor-not-allowed disabled:opacity-40'
            )}
          >
            {labels.chatSend}
          </button>
        </form>

        {error ? <p className="text-destructive mt-2 text-[0.75rem]">{error}</p> : null}
      </div>
    </section>
  );
}

/**
 * 消息时间戳：日期 + 时刻，语言跟着站点走。
 *
 * 格式化器按语言缓存 —— 群里几十条消息共用同一个实例，别每条都新建。
 * 语言直接复用 htmlLang()，它本来就定义了站点的 BCP-47 标签。
 */
const timestampFormatters = new Map<string, Intl.DateTimeFormat>();

function formatTimestamp(iso: string, locale: Locale): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';

  const tag = htmlLang(locale);
  let formatter = timestampFormatters.get(tag);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(tag, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    timestampFormatters.set(tag, formatter);
  }
  return formatter.format(date);
}
