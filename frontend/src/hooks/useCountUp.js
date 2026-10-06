import { useEffect, useState } from 'react'
import { subscribeScroll } from '../lib/scroll'
import { prefersReducedMotion } from '../lib/spring'
import { clamp } from '../lib/easing'

/*
  Count-up berbasis scroll (Lumora):
  progress 0 saat top elemen menyentuh bawah viewport,
  progress 1 saat center elemen menyentuh center viewport.
*/
export function useCountUp(ref, target) {
  const [value, setValue] = useState(prefersReducedMotion() ? target : 0)

  useEffect(() => {
    if (prefersReducedMotion()) { setValue(target); return }
    return subscribeScroll(() => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const p = clamp((vh - r.top) / (vh / 2 + r.height / 2))
      setValue(Math.round(p * target))
    })
  }, [ref, target])

  return value
}
