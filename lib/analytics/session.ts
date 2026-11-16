const SESSION_KEY = 'inon_session_id';

/**
 * 一次浏览会话的标识，存在 sessionStorage —— 关掉标签页就失效，不跨会话追踪。
 *
 * 群聊和访问统计共用同一个 key：这样「他问了什么」和「他看了哪些页」
 * 能按同一次会话对上，而不是只能靠 IP 猜。
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const fresh = crypto.randomUUID();
    window.sessionStorage.setItem(SESSION_KEY, fresh);
    return fresh;
  } catch {
    // 隐私模式或禁用 storage 时退化成「没有会话」，统计照常写
    return '';
  }
}
