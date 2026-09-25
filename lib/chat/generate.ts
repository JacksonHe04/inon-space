import { Output, generateText } from 'ai';

import { getChatModel } from '@/lib/ai';
import {
  buildSystemPrompt,
  buildTranscript,
  chatReplySchema,
  type ChatReplyOutput,
} from '@/lib/chat/persona';
import { contentToMarkdown } from '@/lib/content/chat-context';
import type { Content } from '@/lib/content/types';

/** 撞一次运气不好可以理解，连着两次都出不来就是别的问题了 */
const ATTEMPTS = 2;

export interface ChatTurn {
  role: 'visitor' | 'assistant';
  displayName: string;
  content: string;
}

/**
 * 让模型产一条回复。
 *
 * 这里比调用本身多做了两件事，都是被线上 502 逼出来的：
 * 一是从半成品的文本里把 JSON 抠出来，二是给一次重试机会。
 * 具体原因见 `salvageReply` 的注释。
 */
export async function generateChatReply(
  content: Content,
  history: ChatTurn[]
): Promise<ChatReplyOutput | null> {
  const system = buildSystemPrompt(contentToMarkdown(content));
  const prompt = buildTranscript(history);

  for (let attempt = 1; attempt <= ATTEMPTS; attempt += 1) {
    try {
      const { output } = await generateText({
        model: getChatModel(),
        output: Output.object({ schema: chatReplySchema }),
        system,
        prompt,
        temperature: 0.7,
        maxOutputTokens: 800,
      });
      return output;
    } catch (error) {
      // 先看能不能救回来，救不回来才重试 —— 重试要再花一次钱
      const salvaged = salvageReply(error);
      if (salvaged) return salvaged;
      console.error(`[chat] 第 ${attempt}/${ATTEMPTS} 次生成失败`, error);
    }
  }

  return null;
}

/**
 * 从报错附带的原始文本里把那个 JSON 对象抠出来。
 *
 * 为什么需要这一步：走 OpenRouter 时不是每个 provider 都支持结构化输出 ——
 * 线上日志里 `z-ai/glm-4.5` 一直在告警
 * `The feature "responseFormat" is not supported`，AI SDK 于是退化成
 * 「让模型自己写 JSON，再把整段文本 parse 一遍」。
 *
 * 而模型时不时会先写一段大白话，再把 JSON 贴在后面：
 *
 *     音乐听很多，后摇和说唱是命 😄
 *
 *     { "reply": "音乐听很多…", "suggestedQuestions": [...] }
 *
 * 整段 parse 当场就崩，访客看到的是「发送失败」，再发一次可能又好了 ——
 * 不是偶发网络抖动，是模型输出格式不稳定。
 *
 * 所以这里退一步：JSON 两边那点废话不要了，取第一个 `{` 到最后一个 `}` 之间的内容。
 * 仍然过一遍 zod，形状不对照样当失败。
 */
function salvageReply(error: unknown): ChatReplyOutput | null {
  const text = (error as { text?: unknown } | null)?.text;
  if (typeof text !== 'string') return null;

  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end <= start) return null;

  try {
    return chatReplySchema.parse(JSON.parse(text.slice(start, end + 1)));
  } catch {
    return null;
  }
}
