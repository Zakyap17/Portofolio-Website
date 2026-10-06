/*
  Smooth scroll (Lenis) + kunci scroll.
  Kunci bersifat counter — loader, menu, dan modal bisa mengunci bersamaan.
*/
import Lenis from 'lenis'

let lenis = null
let locks = 0
let rafId = 0

const LOCK_STYLE = { position: 'relative', overflow: 'hidden', height: '100%' }

function applyLock() {
  const html = document.documentElement
  Object.assign(html.style, LOCK_STYLE)
  lenis?.stop()
}

function releaseLock() {
  const html = document.documentElement
  Object.keys(LOCK_STYLE).forEach(k => html.style.removeProperty(k))
  lenis?.start()
}

export function initScroll() {
  window.scrollTo(0, 0)
  lenis = new Lenis({ smoothWheel: true })
  const raf = t => { lenis?.raf(t); rafId = requestAnimationFrame(raf) }
  rafId = requestAnimationFrame(raf)
  if (locks > 0) lenis.stop()

  return () => {
    cancelAnimationFrame(rafId)
    lenis?.destroy()
    lenis = null
  }
}

export function lockScroll() {
  locks += 1
  if (locks === 1) applyLock()
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1)
  if (locks === 0) releaseLock()
}

export function scrollToTarget(target) {
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (!el) return
  if (lenis) lenis.scrollTo(el, { duration: 1.2 })
  else el.scrollIntoView({ behavior: 'smooth' })
}

/* Satu listener scroll/resize dipakai bersama (parallax, count-up) */
const subs = new Set()
let ticking = false

function run() {
  ticking = false
  subs.forEach(fn => fn())
}

function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(run)
}

export function subscribeScroll(fn) {
  if (subs.size === 0) {
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
  }
  subs.add(fn)
  fn()
  return () => {
    subs.delete(fn)
    if (subs.size === 0) {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }
}
