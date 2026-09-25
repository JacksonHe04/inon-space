import { generateText } from 'ai';

import { chatRequestHeaders, getChatModel } from '@/lib/ai';
import { buildSystemPrompt, buildTranscript, chatReplySchema, type ChatReplyOutput } from '@/lib/chat/persona';
import { contentToMarkdown } from '@/lib/content/chat-context';
import type { Content } from '@/lib/content/types';

/** 撞一次运气不好可以理解，连着两次都出不来就是别的问题了 */
const ATTEMPTS = 2;

/**
 * 上限给到 1200 而不是 800：这个模型是推理模型，会先产一段 `reasoning_content`，
 * 那部分也计入输出。800 在实测里够用，但留点余量，免得推理写长了正文就落不下来。
 */
const MAX_OUTPUT_TOKENS = 1200;

export interface ChatTurn {
  role: 'visitor' | 'assistant';
  displayName: string;
  content: string;
}

export interface GenerateChatReplyInput {
  content: Content;
  history: ChatTurn[];
  /** 访客标识，用作 x-opencode-session */
  sessionId: string;
}

/**
 * 让模型产一条回复，并把它变成结构化的结果。
 *
 * **刻意不走 `Output.object`。** 那个入口会要求 provider 支持结构化输出，而
 * OpenCode Go 上的 `deepseek-v4.1-flash` 收到 `response_format` 直接 400 ——
 * 不是告警降级，是整条请求失败。之前的 OpenRouter/glm-4.5 只是不支持 schema、
 * 退化成「让模型自己写 JSON 再 parse」，所以那时还能靠兜底救回来。
 *
 * 既然两种 provider 都不能指望，这里索性不依赖它：提示词里已经写明只输出 JSON，
 * 代码这边负责从文本里把那个 JSON 抠出来、过一遍 zod。一条路径，与 provider 能力无关。
 */
export async function generateChatReply({
  content,
  history,
  sessionId,
}: GenerateChatReplyInput): Promise<ChatReplyOutput | null> {
  const system = buildSystemPrompt(contentToMarkdown(content));
  const prompt = buildTranscript(history);

  for (let attempt = 1; attempt <= ATTEMPTS; attempt += 1) {
    try {
      const { text } = await generateText({
        model: getChatModel(),
        system,
        prompt,
        temperature: 0.7,
        maxOutputTokens: MAX_OUTPUT_TOKENS,
        headers: chatRequestHeaders(sessionId),
      });

      const parsed = parseReply(text);
      if (parsed) return parsed;

      console.error(`[chat] 第 ${attempt}/${ATTEMPTS} 次输出无法解析`, text.slice(0, 400));
    } catch (error) {
      console.error(`[chat] 第 ${attempt}/${ATTEMPTS} 次生成失败`, error);
    }
  }

  return null;
}

/**
 * 从模型输出里把 JSON 抠出来。
 *
 * 模型时不时先写一段大白话、再把 JSON 贴在后面：
 *
 *     音乐听很多，后摇和说唱是命 😄
 *
 *     { "reply": "音乐听很多…", "suggestedQuestions": [...] }
 *
 * 整段 parse 会当场崩掉，访客看到的是「发送失败」，再发一次可能又好了 ——
 * 不是网络抖动，是输出格式不稳定。所以 JSON 两边那点废话不要了，
 * 取第一个 `{` 到最后一个 `}` 之间的内容，仍然过一遍 zod，形状不对照样当失败。
 */
function parseReply(text: string): ChatReplyOutput | null {
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
