import { createElement, useEffect, useRef, useState } from 'react'
import { useInView } from '../../hooks/useInView'
import { EASE } from '../../lib/easing'

/* true setelah `play` menyala — dua frame supaya transisi dari state awal benar-benar berjalan */
function usePlay(play) {
  const [on, setOn] = useState(false)
  useEffect(() => {
    if (!play) { setOn(false); return }
    let id2 = 0
    const id1 = requestAnimationFrame(() => { id2 = requestAnimationFrame(() => setOn(true)) })
    return () => { cancelAnimationFrame(id1); cancelAnimationFrame(id2) }
  }, [play])
  return on
}

const hidden = { transform: 'translateY(115%)', opacity: 0 }
const shown  = { transform: 'translateY(0)',    opacity: 1 }

const slide = (on, duration, delay, ease) => ({
  ...(on ? shown : hidden),
  transition: `transform ${duration}ms ${ease} ${delay}ms, opacity ${duration}ms ${ease} ${delay}ms`,
})

/* Baris bertumpuk, masing-masing slide-up dari balik mask (overflow hidden) */
export function StackedLines({
  as = 'span', lines, className, stagger = 120, baseDelay = 0,
  duration = 950, ease = EASE.expo, ready = true, ...rest
}) {
  const ref = useRef(null)
  const inView = useInView(ref)
  const on = usePlay(inView && ready)

  return createElement(
    as,
    { ref, className, ...rest },
    lines.map((line, i) => (
      <span key={i} className="block overflow-hidden pb-[0.14em]">
        <span className="block will-change-transform" style={slide(on, duration, baseDelay + i * stagger, ease)}>
          {line}
        </span>
      </span>
    ))
  )
}

/* Judul besar kata-per-kata (hero) */
export function WordReveal({
  as = 'h1', text, className, style, stagger = 140, baseDelay = 0,
  duration = 1100, ease = EASE.expo, ready = true, innerRef, ...rest
}) {
  const ownRef = useRef(null)
  const ref = innerRef || ownRef
  const inView = useInView(ref)
  const on = usePlay(inView && ready)
  const words = text.split(/\s+/).filter(Boolean)

  return createElement(
    as,
    { ref, className, style, ...rest },
    words.map((w, i) => (
      <span key={i}>
        <span className="inline-block overflow-hidden align-top pb-[0.12em] -mb-[0.12em]">
          <span className="inline-block will-change-transform" style={slide(on, duration, baseDelay + i * stagger, ease)}>
            {w}
          </span>
        </span>
        {i < words.length - 1 ? ' ' : ''}
      </span>
    ))
  )
}

/* Satu kata ghost raksasa — re-fire dengan `key` saat konten berganti */
export function ClipWord({ text, play, duration = 700, delay = 0, ease = EASE.expo, className }) {
  const on = usePlay(play)
  return (
    <span className={`block overflow-hidden pb-[0.12em] ${className || ''}`}>
      <span className="block will-change-transform" style={slide(on, duration, delay, ease)}>
        {text}
      </span>
    </span>
  )
}

/* Paragraf: kata fade + naik satu-satu */
export function WordFade({
  as = 'p', text, className, stagger = 28, delayIn = 250,
  duration = 700, ease = EASE.quart, ready = true, ...rest
}) {
  const ref = useRef(null)
  const inView = useInView(ref)
  const on = usePlay(inView && ready)
  const words = text.split(/\s+/).filter(Boolean)

  return createElement(
    as,
    { ref, className, ...rest },
    words.map((w, i) => (
      <span key={i}>
        <span
          className="inline-block"
          style={{
            opacity: on ? 1 : 0,
            transform: on ? 'translateY(0)' : 'translateY(18px)',
            transition: `transform ${duration}ms ${ease} ${delayIn + i * stagger}ms, opacity ${duration}ms ${ease} ${delayIn + i * stagger}ms`,
          }}
        >
          {w}
        </span>
        {i < words.length - 1 ? ' ' : ''}
      </span>
    ))
  )
}
