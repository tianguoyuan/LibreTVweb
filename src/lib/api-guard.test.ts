import { afterAll, describe, expect, it } from 'vitest';
import { guardRequest } from './api-guard';
import { SESSION_COOKIE, signSession } from './auth';

const original = process.env.PASSWORD;

afterAll(() => {
  if (original === undefined) delete process.env.PASSWORD;
  else process.env.PASSWORD = original;
});

function req(cookie?: string): Request {
  return new Request('https://local.test/api/test', {
    headers: cookie ? { cookie } : undefined,
  });
}

describe('guardRequest', () => {
  it('未配置 PASSWORD 时公开访问', () => {
    delete process.env.PASSWORD;
    expect(guardRequest(req())).toBeNull();
  });

  it('配置 PASSWORD 后要求有效会话', () => {
    process.env.PASSWORD = 'test-password';
    expect(guardRequest(req())?.status).toBe(401);
    expect(guardRequest(req(`${SESSION_COOKIE}=bad-token`))?.status).toBe(401);

    const { token } = signSession();
    expect(guardRequest(req(`${SESSION_COOKIE}=${token}`))).toBeNull();
  });
});
