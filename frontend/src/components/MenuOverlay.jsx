import { useEffect } from 'react'
import { Hover, SpringLayer } from './motion/Spring'
import { CloseIcon } from './ui/icons'
import { PillButton } from './ui/Controls'
import { usePresence } from '../hooks/usePresence'
import { lockScroll, unlockScroll, scrollToTarget } from '../lib/scroll'
import { MENU_LINKS } from '../content/site'
import { useSite } from '../context/SiteContext'

function CloseButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close menu"
      data-hover-root
      className="grid size-10 place-items-center rounded-pill bg-white/15 transition-colors hover:bg-white/25"
    >
      <Hover from={{ rotate: 0 }} to={{ rotate: 90 }} config={{ tension: 300, friction: 18 }} trigger="[data-hover-root]" className="inline-flex">
        <CloseIcon className="size-4" />
      </Hover>
    </button>
  )
}

/* Menu layar penuh (Baseline) dengan nomor indeks (Lumora) */
export default function MenuOverlay({ open, onClose, onOpenContact }) {
  const mounted = usePresence(open, 500)
  const { data } = useSite()
  const { personal } = data

  useEffect(() => {
    if (!open) return
    lockScroll()
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); unlockScroll() }
  }, [open, onClose])

  if (!mounted) return null
  const phase = open ? 'in' : 'out'

  const go = (e, href) => {
    e.preventDefault()
    onClose()
    setTimeout(() => scrollToTarget(href), 80)
  }

  const social = [
    personal.linkedin && { label: 'LinkedIn', href: personal.linkedin },
    personal.github   && { label: 'GitHub',   href: personal.github },
  ].filter(Boolean)

  return (
    <div
      className={`fixed inset-0 z-70 flex flex-col ${open ? '' : 'pointer-events-none'}`}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
    >
      <SpringLayer
        phase={phase}
        from={{ opacity: 0 }}
        to={{ opacity: 1 }}
        config={{ tension: 260, friction: 30 }}
        onClick={onClose}
        className="absolute inset-0 bg-brand-deep"
      />

      <SpringLayer
        phase={phase}
        from={{ opacity: 0, y: -24 }}
        to={{ opacity: 1, y: 0 }}
        config={{ tension: 220, friction: 28 }}
        className="relative flex h-full flex-col p-2 text-white sm:p-3"
      >
        <div className="flex flex-1 flex-col px-6 py-6 sm:px-10 sm:py-8">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-base font-medium uppercase tracking-[0.2em]">
              Zaky
            </span>
            <CloseButton onClick={onClose} />
          </div>

          <nav className="flex flex-1 flex-col justify-center gap-2" aria-label="Menu">
            {MENU_LINKS.map((l, i) => (
              <SpringLayer
                key={l.href}
                phase={phase}
                from={{ opacity: 0, y: 28 }}
                to={{ opacity: 1, y: 0 }}
                config={{ tension: 200, friction: 26 }}
                delayIn={120 + i * 70}
              >
                <a
                  href={l.href}
                  onClick={e => go(e, l.href)}
                  className="group flex items-baseline gap-4 text-5xl font-medium tracking-tight transition-colors hover:text-brand-light sm:text-7xl"
                >
                  <span className="text-base font-normal text-white/30 transition-colors group-hover:text-brand-light">
                    0{i + 1}
                  </span>
                  {l.label}
                </a>
              </SpringLayer>
            ))}
          </nav>

          <div className="flex flex-col gap-6 border-t border-white/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <PillButton
              variant="light"
              onClick={() => { onClose(); setTimeout(onOpenContact, 200) }}
            >
              Get in Touch
            </PillButton>
            <nav className="flex gap-6 text-sm text-white/70" aria-label="Social">
              {social.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="hover:text-white">{s.label}</a>
              ))}
            </nav>
          </div>
        </div>
      </SpringLayer>
    </div>
  )
}
