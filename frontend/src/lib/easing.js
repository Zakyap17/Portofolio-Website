/* Easing bernama → cubic-bezier (untuk CSS transition) dan fungsi JS (untuk tween rAF) */
export const EASE = {
  expo:       'cubic-bezier(0.16, 1, 0.3, 1)',
  quart:      'cubic-bezier(0.25, 1, 0.5, 1)',
  outCubic:   'cubic-bezier(0.33, 1, 0.68, 1)',
  inOutCubic: 'cubic-bezier(0.65, 0, 0.35, 1)',
}

export const easeInOutCubic = t =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

export const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v))
export const lerp = (a, b, t) => a + (b - a) * t
