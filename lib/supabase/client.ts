import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * 浏览器端 Supabase 客户端，用 publishable key。
 *
 * 只用于订阅新消息（chat_messages 对匿名开放了 select，也加入了 realtime 广播）。
 * 写入一律走服务端 API —— 这里没有任何写能力，也不应该加。
 */
let cached: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error('缺少 NEXT_PUBLIC_SUPABASE_URL 或 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');
  }

  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return cached;
}
