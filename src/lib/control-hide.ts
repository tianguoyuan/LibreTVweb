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
