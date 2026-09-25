import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * 服务端 Supabase 客户端，用 secret key，绕过 RLS。
 * 只允许在 Route Handler / Server Component 里使用，绝不进浏览器。
 *
 * chat_messages 没有对匿名开放写入策略，所以「以服务身份写消息」这件事
 * 只能发生在这一侧 —— 访客无法伪造 assistant 身份发言。
 */
let cached: SupabaseClient | null = null;

export function getSupabaseServerClient(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secret) {
    throw new Error('缺少 NEXT_PUBLIC_SUPABASE_URL 或 SUPABASE_SECRET_KEY');
  }

  cached = createClient(url, secret, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return cached;
}
