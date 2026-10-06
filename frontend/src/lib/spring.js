/*
  Mesin spring kecil (model react-spring: mass = 1).
  accel = -tension * (x - target) - friction * v

  Nilai yang didukung: opacity, x, y (px), scale, scaleX, rotate (deg).
  Hasil ditulis langsung ke el.style (tanpa re-render React).
*/

const PRECISION = { opacity: 0.001, scale: 0.001, scaleX: 0.001 }
const SUBSTEP = 1 / 120

const active = new Set()
let raf = 0
let last = 0

function tick(now) {
  const dt = Math.min((now - last) / 1000, 1 / 30)
  last = now
  active.forEach(s => s.step(dt))
  raf = active.size ? requestAnimationFrame(tick) : 0
}

function wake() {
  if (raf) return
  last = performance.now()
  raf = requestAnimationFrame(tick)
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export class SpringGroup {
  constructor(el, initial = {}) {
    this.el = el
    this.values = { ...initial }
    this.target = { ...initial }
    this.vel = {}
    Object.keys(initial).forEach(k => { this.vel[k] = 0 })
    this.config = { tension: 170, friction: 26 }
    this.timer = null
    this.render()
  }

  set(values) {
    clearTimeout(this.timer)
    Object.keys(values).forEach(k => { this.vel[k] = 0 })
    Object.assign(this.values, values)
    Object.assign(this.target, values)
    active.delete(this)
    this.render()
  }

  to(target, config, delay = 0) {
    clearTimeout(this.timer)
    if (prefersReducedMotion()) { this.set(target); return }
    const go = () => {
      Object.keys(target).forEach(k => { if (this.vel[k] === undefined) this.vel[k] = 0 })
      Object.assign(this.target, target)
      if (config) this.config = config
      active.add(this)
      wake()
    }
    if (delay > 0) this.timer = setTimeout(go, delay)
    else go()
  }

  step(dt) {
    const { tension, friction } = this.config
    const n = Math.max(1, Math.ceil(dt / SUBSTEP))
    const h = dt / n
    let settled = true

    for (const k of Object.keys(this.target)) {
      let x = this.values[k]
      let v = this.vel[k] || 0
      const t = this.target[k]
      for (let i = 0; i < n; i++) {
        v += (-tension * (x - t) - friction * v) * h
        x += v * h
      }
      const eps = PRECISION[k] ?? 0.01
      if (Math.abs(x - t) < eps && Math.abs(v) < eps) { x = t; v = 0 }
      else settled = false
      this.values[k] = x
      this.vel[k] = v
    }

    this.render()
    if (settled) active.delete(this)
  }

  render() {
    const v = this.values
    const el = this.el
    if (!el) return
    let t = ''
    const x = v.x || 0
    const y = v.y || 0
    if (x || y) t += `translate3d(${x}px, ${y}px, 0) `
    if (v.scale !== undefined && v.scale !== 1) t += `scale(${v.scale}) `
    if (v.scaleX !== undefined && v.scaleX !== 1) t += `scaleX(${v.scaleX}) `
    if (v.rotate) t += `rotate(${v.rotate}deg) `
    el.style.transform = t.trim() || 'none'
    if (v.opacity !== undefined) el.style.opacity = v.opacity
  }

  dispose() {
    clearTimeout(this.timer)
    active.delete(this)
  }
}
