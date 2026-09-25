export type ChatRole = 'visitor' | 'assistant';

/** 一条群聊消息。字段名与 chat_messages 表一一对应（camelCase 版本） */
export interface ChatMessage {
  id: string;
  createdAt: string;
  role: ChatRole;
  content: string;
  /** 「来自中国北京的访客」/「小缨缨」 */
  displayName: string;
  locationLabel: string | null;
  /** 头像由此确定性生成 */
  avatarSeed: string;
  /** 仅 assistant 消息有值 */
  suggestedQuestions: string[];
}

/** 数据库行的原始形状 */
export interface ChatMessageRow {
  id: string;
  created_at: string;
  role: ChatRole;
  content: string;
  display_name: string;
  location_label: string | null;
  avatar_seed: string;
  suggested_questions: string[] | null;
}

export function rowToMessage(row: ChatMessageRow): ChatMessage {
  return {
    id: row.id,
    createdAt: row.created_at,
    role: row.role,
    content: row.content,
    displayName: row.display_name,
    locationLabel: row.location_label,
    avatarSeed: row.avatar_seed,
    suggestedQuestions: row.suggested_questions ?? [],
  };
}

/** 首屏一次性拿到的快照 */
export interface ChatSnapshot {
  messages: ChatMessage[];
  /** 当前全局公用的推荐问题，取自最新一条 assistant 消息 */
  suggested: string[];
}

/** POST /api/chat 的响应 */
export interface ChatPostResult {
  visitor: ChatMessage;
  assistant: ChatMessage | null;
  suggested: string[];
  /** AI 失败时给出的可读原因，成功时为 undefined */
  error?: string;
}

/** 输入框上方的推荐问题由最新一条 assistant 消息决定 —— 只此一处，别在别处再算一遍 */
export function suggestedFrom(messages: ChatMessage[]): string[] {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const questions = messages[i].suggestedQuestions;
    if (questions.length > 0) return questions;
  }
  return [];
}

export const CHAT_PAGE_SIZE = 40;
export const CHAT_MAX_LENGTH = 500;
