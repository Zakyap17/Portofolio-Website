import { useEffect, useRef, useState } from 'react'
import { SpringLayer } from './motion/Spring'
import { CarouselDots } from './ui/Controls'
import { ArrowRight, ArrowUpRight, CloseIcon } from './ui/icons'
import { usePresence } from '../hooks/usePresence'
import { lockScroll, unlockScroll } from '../lib/scroll'

/* Detail proyek: slider screenshot + info (gaya modal Baseline) */
export default function ProjectModal({ project, onClose }) {
  const open = !!project
  const mounted = usePresence(open, 450)
  const last = useRef(project)
  if (project) last.current = project
  const p = last.current
  const [photoIdx, setPhotoIdx] = useState(0)

  useEffect(() => { if (open) setPhotoIdx(0) }, [open, project?.id])

  useEffect(() => {
    if (!open) return
    lockScroll()
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); unlockScroll() }
  }, [open, onClose])

  if (!mounted || !p) return null

  const images = Array.isArray(p.images) ? p.images : []
  const tech = Array.isArray(p.tech) ? p.tech : []
  const total = images.length
  const phase = open ? 'in' : 'out'

  return (
    <div
      className={`fixed inset-0 z-90 flex items-end justify-center p-3 sm:items-center sm:p-6 ${open ? '' : 'pointer-events-none'}`}
      role="dialog"
      aria-modal="true"
      aria-label={p.title}
    >
      <SpringLayer
        phase={phase}
        from={{ opacity: 0 }}
        to={{ opacity: 1 }}
        config={{ tension: 240, friction: 30 }}
        onClick={onClose}
        className="absolute inset-0 bg-brand-deep/40 backdrop-blur"
      />

      <SpringLayer
        phase={phase}
        from={{ opacity: 0, y: 28, scale: 0.96 }}
        to={{ opacity: 1, y: 0, scale: 1 }}
        config={{ tension: 240, friction: 26 }}
        data-lenis-prevent
        className="relative max-h-[92svh] w-full max-w-3xl overflow-y-auto rounded-card-lg bg-surface-card text-ink shadow-[0_32px_80px_rgba(15,47,99,0.35)]"
      >
        {/* Slider */}
        <div className="relative grid w-full aspect-[16/10] max-h-[42svh] place-items-center overflow-hidden bg-surface">
          {total > 0 ? (
            <img src={images[photoIdx]} alt={`${p.title} screenshot ${photoIdx + 1}`} className="absolute inset-0 size-full object-contain" />
          ) : (
            <span className="text-sm text-ink-soft">No screenshots yet</span>
          )}

          {total > 1 && (
            <>
              <button
                type="button"
                onClick={() => setPhotoIdx(i => (i - 1 + total) % total)}
                aria-label="Previous screenshot"
                className="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-pill bg-white/85 text-ink backdrop-blur transition-colors hover:bg-white"
              >
                <ArrowRight className="size-4" flip />
              </button>
              <button
                type="button"
                onClick={() => setPhotoIdx(i => (i + 1) % total)}
                aria-label="Next screenshot"
                className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-pill bg-white/85 text-ink backdrop-blur transition-colors hover:bg-white"
              >
                <ArrowRight className="size-4" />
              </button>
              <div className="absolute inset-x-0 bottom-3 flex justify-center">
                <div className="rounded-pill bg-white/85 px-2 backdrop-blur">
                  <CarouselDots count={total} active={photoIdx} onSelect={setPhotoIdx} />
                </div>
              </div>
            </>
          )}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 grid size-10 place-items-center rounded-pill bg-white/85 text-ink backdrop-blur transition-colors hover:bg-white"
          >
            <CloseIcon className="size-4" />
          </button>
        </div>

        {/* Detail */}
        <div className="flex flex-col gap-4 p-6 sm:p-8">
          <div>
            {p.status === 'coming-soon' && (
              <span className="mb-3 inline-flex rounded-pill bg-ink px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-white">Coming soon</span>
            )}
            {(p.company || p.label || p.year) && (
              <p className="mb-1.5 text-xs font-medium uppercase tracking-[0.18em] text-ink-soft">
                {[p.company, p.label || p.year].filter(Boolean).join(' — ')}
              </p>
            )}
            <h3 className="text-2xl font-medium tracking-tight sm:text-3xl">{p.title}</h3>
          </div>
          <p className="text-sm leading-relaxed text-ink-soft">{p.description}</p>

          {Array.isArray(p.facts) && p.facts.length > 0 && (
            <dl className="grid gap-x-6 gap-y-3 rounded-card-sm bg-surface p-4 text-sm sm:grid-cols-[auto_1fr]">
              {p.facts.map(f => (
                <div key={f.label} className="contents">
                  <dt className="text-xs font-medium uppercase tracking-[0.18em] text-ink-soft sm:pt-0.5">{f.label}</dt>
                  <dd className="font-medium">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {tech.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {tech.map(t => (
                <li key={t} className="rounded-pill border border-hairline bg-surface px-4 py-1.5 text-xs font-medium">{t}</li>
              ))}
            </ul>
          )}

          {(p.github || p.demo) && (
            <div className="flex flex-wrap gap-3 pt-1">
              {p.github && (
                <a
                  href={p.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-pill border border-ink px-6 py-3 text-sm font-medium uppercase tracking-wide transition-colors hover:bg-ink hover:text-white"
                >
                  GitHub
                </a>
              )}
              {p.demo && (
                <a
                  href={p.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-pill bg-ink px-6 py-3 text-sm font-medium uppercase tracking-wide text-white transition-colors hover:bg-brand-deep"
                >
                  Live Demo <ArrowUpRight className="size-4" />
                </a>
              )}
            </div>
          )}
        </div>
      </SpringLayer>
    </div>
  )
}
