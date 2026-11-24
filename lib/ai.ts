import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

/**
 * 模型入口：智谱 BigModel 开放平台（OpenAI 兼容端点），走免费 Flash 系列。
 *
 * 模型不是单写死一个：`getChatModels()` 返回一条按顺序排列的主备链，
 * 调用方在 `lib/chat/generate.ts` 里逐个尝试——第一个模型鉴权失败、被限流、
 * 已下线或网络出错，就切下一个；解析不出 JSON 的重试逻辑仍留在当前模型内。
 *
 * 默认链按需求顺序写在 `DEFAULT_CHAT_MODELS`，也可用 `BIGMODEL_CHAT_MODELS`
 * 逗号分隔覆盖。代码里不出现除默认链以外的模型名。
 */
const baseURL = process.env.BIGMODEL_BASE_URL ?? 'https://open.bigmodel.cn/api/paas/v4';

const provider = createOpenAICompatible({
  name: 'bigmodel',
  baseURL,
  apiKey: process.env.BIGMODEL_API_KEY ?? '',
});

export const DEFAULT_CHAT_MODELS = [
  'glm-4.7-flash',
  'glm-4-flash-250414',
  'glm-z1-flash',
] as const;

/** 主备降级顺序；环境变量缺省时回落到默认链 */
export function getChatModels(): string[] {
  const configured = process.env.BIGMODEL_CHAT_MODELS
    ?.split(',')
    .map((id) => id.trim())
    .filter(Boolean);

  return configured && configured.length > 0 ? configured : [...DEFAULT_CHAT_MODELS];
}

export function getChatModel(model: string) {
  return provider(model);
}

/** 自报家门，别用 SDK 的默认 UA */
export const CHAT_CLIENT_NAME = 'inon-space-chat/1.0';

export function chatRequestHeaders(): Record<string, string> {
  return {
    'User-Agent': CHAT_CLIENT_NAME,
  };
}
