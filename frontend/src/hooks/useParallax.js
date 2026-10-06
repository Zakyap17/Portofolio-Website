import { useEffect } from 'react'
import { subscribeScroll } from '../lib/scroll'
import { prefersReducedMotion } from '../lib/spring'
import { clamp, lerp } from '../lib/easing'

/*
  Progress scroll: 0 saat top elemen menyentuh bawah viewport,
  1 saat bottom elemen menyentuh atas viewport.
*/
export function scrollProgress(el) {
  const r = el.getBoundingClientRect()
  const vh = window.innerHeight
  return clamp((vh - r.top) / (vh + r.height))
}

/* Geser layer (dalam %) mengikuti progress scroll dari root (default: layer itu sendiri) */
export function useParallax(layerRef, rootRef, { axis = 'y', from = 0, to = 0 } = {}) {
  useEffect(() => {
    if (prefersReducedMotion()) return
    return subscribeScroll(() => {
      const layer = layerRef.current
      const root = (rootRef || layerRef).current
      if (!layer || !root) return
      const v = lerp(from, to, scrollProgress(root))
      layer.style.transform = axis === 'y'
        ? `translate3d(0, ${v}%, 0)`
        : `translate3d(${v}%, 0, 0)`
    })
  }, [layerRef, rootRef, axis, from, to])
}
