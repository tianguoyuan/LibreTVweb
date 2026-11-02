import { NextResponse } from 'next/server';
import { isPasswordConfigured, sessionFromCookieHeader } from './auth';

/**
 * API Route 共享守卫：
 * - 未配置 PASSWORD 时视为公开访问，不要求登录；
 * - 配置了 PASSWORD 时要求有效会话，未登录返回 401。
 */
export function guardRequest(req: Request): NextResponse | null {
  if (!isPasswordConfigured()) return null;
  if (!sessionFromCookieHeader(req.headers.get('cookie'))) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }
  return null;
}

export function jsonError(message: string, status: number): NextResponse {
  return NextResponse.json({ error: message }, { status });
}
