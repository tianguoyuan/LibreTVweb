import { afterEach, describe, expect, it, vi } from 'vitest';
import { BUILTIN_SOURCES } from './default-sources';
import { getEnvSources } from './env-sources';

const KEY = 'DEFAULT_SOURCES';
const original = process.env[KEY];

afterEach(() => {
  if (original === undefined) delete process.env[KEY];
  else process.env[KEY] = original;
  vi.restoreAllMocks();
});

describe('getEnvSources', () => {
  it('未配置时返回内置默认源', () => {
    delete process.env[KEY];
    const list = getEnvSources();
    expect(list.map((s) => s.key)).toEqual(BUILTIN_SOURCES.map((s) => s.key));
    // 返回副本，调用方修改不会污染内置常量
    expect(list[0]).not.toBe(BUILTIN_SOURCES[0]);
  });

  it('配置为空值或纯空白时回退内置默认源', () => {
    for (const raw of ['', '   ']) {
      process.env[KEY] = raw;
      expect(getEnvSources().map((s) => s.key)).toEqual(BUILTIN_SOURCES.map((s) => s.key));
    }
  });

  it('环境变量整体覆盖内置源', () => {
    process.env[KEY] = JSON.stringify([
      { name: '自定义源', url: 'https://example.com/api.php/provide/vod' },
    ]);
    expect(getEnvSources()).toEqual([
      {
        key: 'env_0',
        name: '自定义源',
        url: 'https://example.com/api.php/provide/vod',
        detail: undefined,
        isAdult: false,
      },
    ]);
  });

  it('显式配置空数组可关闭内置源', () => {
    process.env[KEY] = '[]';
    expect(getEnvSources()).toEqual([]);
  });

  it('解析失败时告警并回退内置默认源', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    process.env[KEY] = 'not-json';
    expect(getEnvSources().map((s) => s.key)).toEqual(BUILTIN_SOURCES.map((s) => s.key));
    expect(warn).toHaveBeenCalledOnce();
  });
});

describe('BUILTIN_SOURCES', () => {
  it('均为 http(s) 的 Apple CMS 接口地址且 key 唯一', () => {
    const keys = new Set<string>();
    for (const source of BUILTIN_SOURCES) {
      expect(source.url).toMatch(/^https?:\/\//);
      expect(source.url).toContain('/api.php/provide/vod');
      expect(keys.has(source.key)).toBe(false);
      keys.add(source.key);
    }
  });
});
