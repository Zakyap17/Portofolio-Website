import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../lib/spring'

const FADE_FRAMES = 120

/*
  Foto latar penuh dengan "liquid cursor-reveal" (Lumora):
  gerakan pointer melukis jejak lembut gambar kedua di atas gambar dasar.
  Tanpa `revealSrc`, gambar kedua dibuat dari foto yang sama dengan tint warna (monokrom brand).
*/
export default function LiquidReveal({
  src, revealSrc, alt = '', focus = [0.5, 0.2],
  brushRadius = 143, decay = 0.016, tint = '#b9cdb9',
}) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const radius = brushRadius * dpr
    const diam = Math.ceil(radius * 2)
    const c = diam / 2

    const cover = document.createElement('canvas')
    const cctx = cover.getContext('2d')
    const brush = document.createElement('canvas')
    brush.width = diam
    brush.height = diam
    const bctx = brush.getContext('2d')

    let img = null
    let points = []
    let last = null
    let idle = 0
    let raf = 0
    let disposed = false

    const buildCover = () => {
      cover.width = canvas.width
      cover.height = canvas.height
      if (!img || !cover.width) return
      const scale = Math.max(cover.width / img.naturalWidth, cover.height / img.naturalHeight)
      const dw = img.naturalWidth * scale
      const dh = img.naturalHeight * scale
      cctx.drawImage(img, (cover.width - dw) * focus[0], (cover.height - dh) * focus[1], dw, dh)
      if (!revealSrc) {
        cctx.globalCompositeOperation = 'color'
        cctx.fillStyle = tint
        cctx.fillRect(0, 0, cover.width, cover.height)
        cctx.globalCompositeOperation = 'source-over'
      }
    }

    const resize = () => {
      canvas.width = Math.round(wrap.clientWidth * dpr)
      canvas.height = Math.round(wrap.clientHeight * dpr)
      buildCover()
    }

    const stamp = (x, y) => {
      bctx.globalCompositeOperation = 'source-over'
      bctx.clearRect(0, 0, diam, diam)
      const g = bctx.createRadialGradient(c, c, 0, c, c, radius)
      g.addColorStop(0, 'rgba(255,255,255,1)')
      g.addColorStop(0.55, 'rgba(255,255,255,0.82)')
      g.addColorStop(1, 'rgba(255,255,255,0)')
      bctx.fillStyle = g
      bctx.fillRect(0, 0, diam, diam)
      bctx.globalCompositeOperation = 'source-in'
      bctx.drawImage(cover, x - c, y - c, diam, diam, 0, 0, diam, diam)
      ctx.globalCompositeOperation = 'source-over'
      ctx.drawImage(brush, x - c, y - c)
    }

    const tick = () => {
      raf = 0
      if (disposed) return
      const drawing = points.length > 0
      if (drawing) idle = 0
      else idle++

      if (!drawing && idle > FADE_FRAMES) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        return
      }

      const fade = drawing ? decay : Math.min(decay + idle * 0.004, 0.5)
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = `rgba(0,0,0,${fade})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.globalCompositeOperation = 'source-over'

      if (drawing) {
        points.forEach(p => stamp(p.x, p.y))
        points = []
      }
      raf = requestAnimationFrame(tick)
    }

    const start = () => { if (!raf && !disposed) raf = requestAnimationFrame(tick) }

    const onMove = e => {
      const r = canvas.getBoundingClientRect()
      if (!r.width || !r.height) return
      const x = (e.clientX - r.left) * (canvas.width / r.width)
      const y = (e.clientY - r.top) * (canvas.height / r.height)
      if (x < -radius || y < -radius || x > canvas.width + radius || y > canvas.height + radius) {
        last = null
        return
      }
      if (last) {
        const dist = Math.hypot(x - last.x, y - last.y)
        const step = Math.max(radius * 0.3, 1)
        const n = Math.min(Math.ceil(dist / step), 60)
        for (let i = 1; i <= n; i++) {
          points.push({ x: last.x + ((x - last.x) * i) / n, y: last.y + ((y - last.y) * i) / n })
        }
      } else {
        points.push({ x, y })
      }
      last = { x, y }
      idle = 0
      start()
    }

    const image = new Image()
    image.onload = () => { img = image; buildCover() }
    image.src = revealSrc || src

    const ro = new ResizeObserver(resize)
    ro.observe(wrap)
    resize()
    window.addEventListener('pointermove', onMove, { passive: true })

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, revealSrc, focus[0], focus[1], brushRadius, decay, tint])

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <img
        src={src}
        alt={alt}
        fetchPriority="high"
        className="absolute inset-0 size-full object-cover"
        style={{ objectPosition: `${focus[0] * 100}% ${focus[1] * 100}%` }}
      />
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />
    </div>
  )
}
