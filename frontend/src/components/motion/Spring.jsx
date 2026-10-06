import { createElement, useEffect, useLayoutEffect, useRef } from 'react'
import { SpringGroup, prefersReducedMotion } from '../../lib/spring'
import { useInView } from '../../hooks/useInView'

const canHover = () =>
  window.innerWidth > 768 && window.matchMedia('(hover: hover)').matches

/* Reveal: dari `from` ke `to` saat pertama kali masuk viewport (sekali), setelah delayIn */
export function Inview({
  as = 'div', from, to, config, delayIn = 0, ready = true,
  className, style, children, ...rest
}) {
  const ref = useRef(null)
  const sg = useRef(null)
  const inView = useInView(ref)

  useLayoutEffect(() => {
    sg.current = new SpringGroup(ref.current, from)
    return () => sg.current?.dispose()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!inView || !ready || !sg.current) return
    if (prefersReducedMotion()) sg.current.set(to)
    else sg.current.to(to, config, delayIn)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, ready])

  return createElement(as, { ref, className, style, ...rest }, children)
}

/* Hover spring. `trigger` = selector ancestor yang menjadi pemicu (default: elemen itu sendiri) */
export function Hover({
  as = 'span', from, to, config, trigger,
  className, style, children, ...rest
}) {
  const ref = useRef(null)
  const sg = useRef(null)

  useLayoutEffect(() => {
    sg.current = new SpringGroup(ref.current, from)
    return () => sg.current?.dispose()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const el = ref.current
    const root = (trigger && el.closest(trigger)) || el
    const enter = () => { if (canHover()) sg.current.to(to, config) }
    const leave = () => sg.current.to(from, config)
    root.addEventListener('pointerenter', enter)
    root.addEventListener('pointerleave', leave)
    return () => {
      root.removeEventListener('pointerenter', enter)
      root.removeEventListener('pointerleave', leave)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger])

  return createElement(as, { ref, className, style, ...rest }, children)
}

/*
  Layer masuk/keluar (carousel crossfade, overlay, modal).
  phase 'in' → spring ke `to`; phase 'out' → spring ke `out`.
*/
export function SpringLayer({
  as = 'div', from, to, out, config, outConfig, phase = 'in', delayIn = 0,
  className, style, children, ...rest
}) {
  const ref = useRef(null)
  const sg = useRef(null)

  useLayoutEffect(() => {
    sg.current = new SpringGroup(ref.current, from)
    return () => sg.current?.dispose()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (phase === 'in') sg.current.to(to, config, delayIn)
    else sg.current.to(out || from, outConfig || config)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  return createElement(as, { ref, className, style, ...rest }, children)
}
