import { describe, expect, it } from 'vitest';
import Artplayer from 'artplayer';
import {
  ART_DEFAULT_CONTROL_HIDE_MS,
  DESKTOP_CONTROL_HIDE_MS,
  TOUCH_CONTROL_HIDE_MS,
} from './control-hide';

describe('控制栏隐藏策略', () => {
  it('恢复基准与 ArtPlayer 库默认一致（升级依赖后若默认值变化会在此暴露）', () => {
    expect(ART_DEFAULT_CONTROL_HIDE_MS).toBe(Artplayer.CONTROL_HIDE_TIME);
  });

  it('控制栏自动隐藏时长统一为 3000ms（3秒）', () => {
    expect(DESKTOP_CONTROL_HIDE_MS).toBe(3000);
    expect(TOUCH_CONTROL_HIDE_MS).toBe(3000);
    expect(DESKTOP_CONTROL_HIDE_MS).toBe(ART_DEFAULT_CONTROL_HIDE_MS);
  });
});
