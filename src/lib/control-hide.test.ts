import { describe, expect, it } from 'vitest';
import Artplayer from 'artplayer';
import {
  ART_DEFAULT_CONTROL_HIDE_MS,
  DESKTOP_CONTROL_HIDE_MS,
  TOUCH_CONTROL_HIDE_MS,
  isControlsShowing,
  setControlsVisible,
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

  describe('isControlsShowing', () => {
    it('当 DOM 包含 art-control-show 或 art-hover 时判定为正在显示', () => {
      const mockPlayer = {
        classList: new Set<string>(['art-control-show']),
      } as unknown as HTMLElement;
      (mockPlayer.classList as any).contains = (cls: string) => (mockPlayer.classList as Set<string>).has(cls);

      expect(isControlsShowing({ template: { $player: mockPlayer } })).toBe(true);

      (mockPlayer.classList as Set<string>).clear();
      (mockPlayer.classList as Set<string>).add('art-hover');
      expect(isControlsShowing({ template: { $player: mockPlayer } })).toBe(true);

      (mockPlayer.classList as Set<string>).clear();
      expect(isControlsShowing({ template: { $player: mockPlayer } })).toBe(false);
    });

    it('当没有 template.$player 时回退到 controls.show', () => {
      expect(isControlsShowing({ controls: { show: true } })).toBe(true);
      expect(isControlsShowing({ controls: { show: false } })).toBe(false);
    });
  });

  describe('setControlsVisible', () => {
    it('设为隐藏时，同时移除 art-control-show 和 art-hover 并添加 art-hide-cursor，更新 controls.show', () => {
      const classes = new Set<string>(['art-control-show', 'art-hover']);
      const mockPlayer = {
        classList: {
          contains: (cls: string) => classes.has(cls),
          add: (...items: string[]) => items.forEach((c) => classes.add(c)),
          remove: (...items: string[]) => items.forEach((c) => classes.delete(c)),
        },
      } as unknown as HTMLElement;
      const mockArt = {
        template: { $player: mockPlayer },
        controls: { show: true },
      };

      setControlsVisible(mockArt, false);

      expect(mockArt.controls.show).toBe(false);
      expect(classes.has('art-control-show')).toBe(false);
      expect(classes.has('art-hover')).toBe(false);
      expect(classes.has('art-hide-cursor')).toBe(true);
    });

    it('设为显示时，添加 art-control-show 和 art-hover 并移除 art-hide-cursor，更新 controls.show', () => {
      const classes = new Set<string>(['art-hide-cursor']);
      const mockPlayer = {
        classList: {
          contains: (cls: string) => classes.has(cls),
          add: (...items: string[]) => items.forEach((c) => classes.add(c)),
          remove: (...items: string[]) => items.forEach((c) => classes.delete(c)),
        },
      } as unknown as HTMLElement;
      const mockArt = {
        template: { $player: mockPlayer },
        controls: { show: false },
      };

      setControlsVisible(mockArt, true);

      expect(mockArt.controls.show).toBe(true);
      expect(classes.has('art-control-show')).toBe(true);
      expect(classes.has('art-hover')).toBe(true);
      expect(classes.has('art-hide-cursor')).toBe(false);
    });
  });
});

