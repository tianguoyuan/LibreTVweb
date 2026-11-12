/**
 * 控制栏自动隐藏策略（ArtPlayer.CONTROL_HIDE_TIME，全局 static）。
 *
 * 该值是共享状态：恢复时一律回到**库默认值**而不是「进入时的快照」——
 * 点播 / 直播两个播放器先后挂载时，快照可能已经是被上一个组件改过的值，
 * 互相污染会把状态泄漏到桌面。
 * 本应用是唯一写入方，库默认值即安全基准。
 */
export const ART_DEFAULT_CONTROL_HIDE_MS = 3000;
/** 统一控制栏自动隐藏时长为 3 秒（3000ms），桌面及移动端均保持友好的交互时长 */
export const DESKTOP_CONTROL_HIDE_MS = 3000;
/** 触屏移动端同样统一为 3 秒自动隐藏 */
export const TOUCH_CONTROL_HIDE_MS = 3000;

/**
 * 判定 Artplayer 控制栏当前是否在视觉上处于显示状态。
 * Artplayer 底层同时依据 art-control-show 与 art-hover 控制底部栏可见度（.art-bottom { opacity: 1 }），
 * 仅检查 art.controls.show 会因 hover 态漏判。
 */
export function isControlsShowing(art: {
  template?: { $player?: HTMLElement | null };
  controls?: { show?: boolean };
}): boolean {
  const p = art.template?.$player;
  if (!p) return Boolean(art.controls?.show);
  return p.classList.contains('art-control-show') || p.classList.contains('art-hover');
}

/**
 * 显式设置控制栏可见性并同步 DOM 类名。
 * 确保隐藏控制栏时能立即移除 art-hover 和 art-control-show，避免等待内部超时才收起。
 */
export function setControlsVisible(
  art: {
    template?: { $player?: HTMLElement | null };
    controls?: { show?: boolean };
  },
  visible: boolean
): void {
  if (art.controls) {
    art.controls.show = visible;
  }
  const p = art.template?.$player;
  if (p) {
    if (visible) {
      p.classList.add('art-control-show', 'art-hover');
      p.classList.remove('art-hide-cursor');
    } else {
      p.classList.remove('art-control-show', 'art-hover');
      p.classList.add('art-hide-cursor');
    }
  }
}

