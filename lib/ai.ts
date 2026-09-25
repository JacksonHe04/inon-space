import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

/**
 * 模型入口。
 *
 * 走 OpenRouter（一个 key 覆盖多provider），用 AI SDK 的 OpenAI 兼容适配器接入。
 * 换模型只改 .env.local 的 AI_MODEL，代码里不出现模型名。
 */
const provider = createOpenAICompatible({
  name: 'openrouter',
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY ?? '',
});

export const DEFAULT_CHAT_MODEL = 'anthropic/claude-sonnet-4.5';

export function getChatModel() {
  return provider(process.env.AI_MODEL || DEFAULT_CHAT_MODEL);
}
