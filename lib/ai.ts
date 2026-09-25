import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

/**
 * 模型入口：OpenCode Go（$10/月的订阅，聚合一批开放模型）。
 *
 * 与之前的 OpenRouter 一样是 OpenAI 兼容端点，但它多两条硬要求（见 opencode.ai/docs/go）：
 * 用一个能表明身份、而不是「某个 SDK」的 User-Agent；以及给每次对话带上稳定的
 * `x-opencode-session` —— 那是它做路由与 prompt 缓存优化的依据，**缺了直接 400**。
 * 两条都放在 `chatRequestHeaders()`，由调用方逐次拼进请求。
 *
 * 代码里不出现模型名，换模型只改 `AI_MODEL` 环境变量。
 */
const provider = createOpenAICompatible({
  name: 'opencode',
  baseURL: 'https://opencode.ai/zen/go/v1',
  apiKey: process.env.OPENCODE_API_KEY ?? '',
});

export const DEFAULT_CHAT_MODEL = 'deepseek-v4.1-flash';

/** 自报家门，别用 SDK 的默认 UA —— 这个端点会按客户端识别流量 */
export const CHAT_CLIENT_NAME = 'inon-space-chat/1.0';

export function getChatModel() {
  return provider(process.env.AI_MODEL || DEFAULT_CHAT_MODEL);
}

/**
 * 逐次请求要带的自定义头。
 *
 * session 用访客标识（加盐哈希，见 lib/chat/visitor.ts）：对同一个访客稳定，
 * 又不含任何原始信息。它只用于路由与缓存，不是身份。
 */
export function chatRequestHeaders(sessionId: string): Record<string, string> {
  return {
    'User-Agent': CHAT_CLIENT_NAME,
    'x-opencode-session': sessionId,
  };
}
