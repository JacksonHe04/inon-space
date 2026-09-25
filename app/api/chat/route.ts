import { NextResponse } from 'next/server';

import { ASSISTANT_AVATAR_SEED } from '@/lib/chat/avatar';
import { generateChatReply } from '@/lib/chat/generate';
import { ASSISTANT_NAME } from '@/lib/chat/persona';
import { fetchRecentMessages, insertMessage, isRateLimited } from '@/lib/chat/queries';
import { CHAT_MAX_LENGTH, CHAT_PAGE_SIZE, suggestedFrom } from '@/lib/chat/types';
import { getVisitorIdentity } from '@/lib/chat/visitor';
import { getContent } from '@/lib/content';
import { DEFAULT_LOCALE, isLocale } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

/** 同一个访客两次发言之间的冷却 */
const RATE_LIMIT_MS = 8_000;

export async function GET() {
  const messages = await fetchRecentMessages();
  return NextResponse.json({ messages, suggested: suggestedFrom(messages) });
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null as unknown);
  const body = (payload ?? {}) as { content?: unknown; locale?: unknown };

  const text = typeof body.content === 'string' ? body.content.trim() : '';
  const locale =
    typeof body.locale === 'string' && isLocale(body.locale) ? body.locale : DEFAULT_LOCALE;

  if (!text) {
    return NextResponse.json({ error: 'empty' }, { status: 400 });
  }
  if (text.length > CHAT_MAX_LENGTH) {
    return NextResponse.json({ error: 'too_long' }, { status: 400 });
  }

  const visitor = await getVisitorIdentity();

  if (await isRateLimited(visitor.key, RATE_LIMIT_MS)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  const visitorMessage = await insertMessage({
    role: 'visitor',
    content: text,
    displayName: visitor.displayName,
    locationLabel: visitor.locationLabel,
    avatarSeed: visitor.avatarSeed,
    visitorKey: visitor.key,
  });

  const content = getContent(locale);
  const history = await fetchRecentMessages(CHAT_PAGE_SIZE);

  const reply = await generateChatReply(
    content,
    history.map((message) => ({
      role: message.role,
      displayName: message.displayName,
      content: message.content,
    }))
  );

  if (!reply) {
    // 访客那条已经落库了 —— 不吞掉，否则用户会以为没发出去
    return NextResponse.json(
      {
        visitor: visitorMessage,
        assistant: null,
        suggested: [],
        error: 'model_failed',
      },
      { status: 502 }
    );
  }

  const assistantMessage = await insertMessage({
    role: 'assistant',
    content: reply.reply,
    displayName: ASSISTANT_NAME,
    locationLabel: null,
    avatarSeed: ASSISTANT_AVATAR_SEED,
    visitorKey: 'assistant',
    suggestedQuestions: reply.suggestedQuestions,
  });

  return NextResponse.json({
    visitor: visitorMessage,
    assistant: assistantMessage,
    suggested: reply.suggestedQuestions,
  });
}
