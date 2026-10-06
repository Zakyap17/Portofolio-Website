import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { SpringLayer } from './motion/Spring'
import { lockScroll, unlockScroll } from '../lib/scroll'
import { prefersReducedMotion } from '../lib/spring'
import { EASE, easeInOutCubic } from '../lib/easing'

const MIN_VISIBLE_MS = 1400
const MAX_VISIBLE_MS = 2600
const EXIT_MS = 850
const FILL_DELAY_MS = 120

/*
  Tirai navy pembuka. Bar + counter 000→100 terisi dengan easeInOutCubic,
  lalu tirai meluncur ke atas. Keluar saat: waktu minimum lewat,
  window `load` selesai (atau MAX tercapai), dan data situs sudah settle.
*/
export default function Loader({ dataSettled, onDone }) {
  const reduced = prefersReducedMotion()
  const minMs = reduced ? 200 : MIN_VISIBLE_MS
  const [progress, setProgress] = useState(0)
  const [minDone, setMinDone] = useState(false)
  const [loaded, setLoaded] = useState(document.readyState === 'complete')
  const [phase, setPhase] = useState('show') // show | exit | gone
  const locked = useRef(false)

  useLayoutEffect(() => {
    lockScroll()
    locked.current = true
    return () => {
      if (locked.current) { locked.current = false; unlockScroll() }
    }
  }, [])

  // progress bar + counter
  useEffect(() => {
    const fillMs = minMs - FILL_DELAY_MS
    const t0 = performance.now()
    let raf = 0
    const frame = now => {
      const t = Math.min(Math.max((now - t0 - FILL_DELAY_MS) / fillMs, 0), 1)
      setProgress(easeInOutCubic(t))
      if (t < 1) raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    const timer = setTimeout(() => setMinDone(true), minMs)
    return () => { cancelAnimationFrame(raf); clearTimeout(timer) }
  }, [minMs])

  // window load (dengan batas MAX)
  useEffect(() => {
    if (loaded) return
    const onLoad = () => setLoaded(true)
    window.addEventListener('load', onLoad)
    const force = setTimeout(() => setLoaded(true), MAX_VISIBLE_MS)
    return () => { window.removeEventListener('load', onLoad); clearTimeout(force) }
  }, [loaded])

  // keluar
  useEffect(() => {
    if (phase !== 'show' || !minDone || !loaded || !dataSettled) return
    setPhase('exit')
    onDone()
    if (locked.current) { locked.current = false; unlockScroll() }
  }, [phase, minDone, loaded, dataSettled, onDone])

  // lepas dari DOM setelah tirai selesai naik
  useEffect(() => {
    if (phase !== 'exit') return
    const t = setTimeout(() => setPhase('gone'), reduced ? 0 : EXIT_MS)
    return () => clearTimeout(t)
  }, [phase, reduced])

  if (phase === 'gone') return null

  const count = String(Math.round(progress * 100)).padStart(3, '0')

  return (
    <div
      role="status"
      aria-label="Loading"
      className="fixed inset-0 z-200 flex flex-col items-center justify-center gap-8 rounded-b-card-lg bg-brand-deep text-white"
      style={{
        transform: phase === 'exit' ? 'translateY(-105%)' : 'translateY(0)',
        transition: reduced ? 'none' : `transform ${EXIT_MS}ms ${EASE.inOutCubic}`,
      }}
    >
      <SpringLayer
        from={{ opacity: 0, y: 16 }}
        to={{ opacity: 1, y: 0 }}
        config={{ tension: 200, friction: 22 }}
        className="flex items-center gap-3"
      >
        <span className="text-2xl font-medium uppercase tracking-[0.2em]">Zaky</span>
      </SpringLayer>

      <div className="w-40">
        <div className="h-px w-full overflow-hidden rounded-pill bg-white/20">
          <div
            className="h-full w-full origin-left bg-white"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
        <div className="mt-3 flex justify-between text-[0.65rem] font-medium uppercase tracking-wider text-white/45">
          <span>Loading</span>
          <span className="tabular-nums text-white/80">{count}</span>
        </div>
      </div>
    </div>
  )
}
