'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useIsClient } from '@/lib/use-is-client';
import { Avatar, SeedAvatar } from '@/components/chat/avatar';
import { ASSISTANT_AVATAR } from '@/lib/chat/avatar';
import {
  CHAT_MAX_LENGTH,
  rowToMessage,
  type ChatMessage,
  type ChatMessageRow,
  type ChatSnapshot,
} from '@/lib/chat/types';
import type { ChatErrorCode, Labels, Locale } from '@/lib/content/types';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { fillTemplate } from '@/lib/template';
import { cn } from '@/lib/utils';

interface GroupChatProps {
  initial: ChatSnapshot;
  labels: Labels;
  locale: Locale;
}

/** 去重 + 按时间排序：自己的乐观消息和 realtime 推来的同一条会撞车 */
function mergeMessages(current: ChatMessage[], incoming: ChatMessage[]): ChatMessage[] {
  const byId = new Map(current.map((message) => [message.id, message]));
  for (const message of incoming) byId.set(message.id, message);
  return [...byId.values()].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function GroupChat({ initial, labels, locale }: GroupChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initial.messages);
  const [suggested, setSuggested] = useState<string[]>(initial.suggested);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // 时间只在客户端格式化：服务端时区和访客时区未必一致，放服务端渲染会水合不上
  const isClient = useIsClient();

  const scrollRef = useRef<HTMLDivElement>(null);

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
          setMessages((prev) => mergeMessages(prev, [message]));
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

  // 新消息进来滚到底
  useEffect(() => {
    const element = scrollRef.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [messages.length, sending]);

  const errorText = useMemo<Record<ChatErrorCode, string>>(
    () => ({
      rate_limited: labels.chatErrorTooFast,
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

      setInput('');
      setError(null);
      setSending(true);

      const tempId = `local-${Date.now()}`;
      setMessages((prev) =>
        mergeMessages(prev, [
          {
            id: tempId,
            createdAt: new Date().toISOString(),
            role: 'visitor',
            content: text,
            displayName: '你',
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
          body: JSON.stringify({ content: text, locale }),
        });
        const data = await response.json();

        setMessages((prev) => {
          const withoutTemp = prev.filter((message) => message.id !== tempId);
          const confirmed = [data.visitor, data.assistant].filter(Boolean) as ChatMessage[];
          return mergeMessages(withoutTemp, confirmed);
        });

        if (Array.isArray(data.suggested) && data.suggested.length > 0) {
          setSuggested(data.suggested);
        }
        if (data.error) {
          setError(errorText[data.error as ChatErrorCode] ?? labels.chatError);
        }
      } catch {
        setMessages((prev) => prev.filter((message) => message.id !== tempId));
        setError(labels.chatError);
      } finally {
        setSending(false);
      }
    },
    [errorText, labels, locale, sending]
  );

  return (
    <section className="border-border flex flex-col border-t pt-6">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-muted-foreground text-[0.78rem]">{labels.chatSubtitle}</p>
        <span className="text-muted-foreground text-[0.7rem] tabular-nums">
          {fillTemplate(labels.chatCount, { n: messages.length })}
        </span>
      </div>

      <div
        ref={scrollRef}
        className="border-border min-h-0 flex-1 overflow-y-auto border-t pt-4"
      >
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
                        {message.displayName}
                      </span>
                      {isClient ? (
                        <time
                          dateTime={message.createdAt}
                          className="text-muted-foreground text-[0.68rem] tabular-nums"
                        >
                          {formatTime(message.createdAt)}
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
          <p className="text-muted-foreground mt-4 text-[0.78rem] italic">{labels.chatSending}</p>
        ) : null}
      </div>

      <div className="border-border mt-4 border-t pt-4">
        {suggested.length > 0 ? (
          <div className="mb-3">
            <p className="kicker mb-2">{labels.chatSuggested}</p>
            <div className="flex flex-wrap gap-1.5">
              {suggested.map((question) => (
                <button
                  key={question}
                  type="button"
                  disabled={sending}
                  onClick={() => void send(question)}
                  className={cn(
                    'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground',
                    'rounded-xs border px-2.5 py-1 text-[0.75rem] transition-colors',
                    'disabled:cursor-not-allowed disabled:opacity-50'
                  )}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <form
          onSubmit={(event) => {
            event.preventDefault();
            void send(input);
          }}
          className="flex items-center gap-2"
        >
          <input
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

const timeFormatter = new Intl.DateTimeFormat('zh-CN', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

function formatTime(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? '' : timeFormatter.format(date);
}
