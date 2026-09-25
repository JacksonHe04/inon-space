import { getSupabaseServerClient } from '@/lib/supabase/server';
import {
  CHAT_PAGE_SIZE,
  rowToMessage,
  suggestedFrom,
  type ChatMessage,
  type ChatMessageRow,
  type ChatSnapshot,
} from '@/lib/chat/types';

/** 按时间正序返回最近 limit 条消息（对外永远是从旧到新） */
export async function fetchRecentMessages(limit: number = CHAT_PAGE_SIZE): Promise<ChatMessage[]> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;

  return ((data ?? []) as ChatMessageRow[]).reverse().map(rowToMessage);
}

export async function fetchSnapshot(limit: number = CHAT_PAGE_SIZE): Promise<ChatSnapshot> {
  const messages = await fetchRecentMessages(limit);
  return { messages, suggested: suggestedFrom(messages) };
}

export interface InsertMessageInput {
  role: 'visitor' | 'assistant';
  content: string;
  displayName: string;
  locationLabel: string | null;
  avatarSeed: string;
  visitorKey: string;
  suggestedQuestions?: string[];
}

export async function insertMessage(input: InsertMessageInput): Promise<ChatMessage> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      role: input.role,
      content: input.content,
      display_name: input.displayName,
      location_label: input.locationLabel,
      avatar_seed: input.avatarSeed,
      visitor_key: input.visitorKey,
      suggested_questions: input.suggestedQuestions ?? [],
    })
    .select('*')
    .single();

  if (error) throw error;
  return rowToMessage(data as ChatMessageRow);
}

/**
 * 简单的发言节流：同一个访客在窗口内只能发一条。
 * 放在数据库而不是内存里 —— serverless 实例随时会换，内存计数器拦不住。
 */
export async function isRateLimited(
  visitorKey: string,
  windowMs: number
): Promise<boolean> {
  const supabase = getSupabaseServerClient();
  const since = new Date(Date.now() - windowMs).toISOString();

  const { data, error } = await supabase
    .from('chat_messages')
    .select('id')
    .eq('visitor_key', visitorKey)
    .eq('role', 'visitor')
    .gte('created_at', since)
    .limit(1);

  if (error) throw error;
  return (data?.length ?? 0) > 0;
}
