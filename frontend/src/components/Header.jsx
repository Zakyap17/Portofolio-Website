import { Inview } from './motion/Spring'
import { BrandMark } from './ui/icons'
import { useIntro } from '../context/IntroContext'
import { useClock } from '../hooks/useClock'
import { HEADER_LINKS, CLOCK_TIMEZONE, CLOCK_LABEL } from '../content/site'

/* Header transparan di atas hero (Baseline) + chip jam live (Lumora) */
export default function Header({ onNavigate, onOpenMenu, onOpenContact }) {
  const ready = useIntro()
  const { time, date } = useClock(CLOCK_TIMEZONE)

  return (
    <Inview
      as="header"
      from={{ opacity: 0, y: -14 }}
      to={{ opacity: 1, y: 0 }}
      config={{ tension: 210, friction: 26 }}
      delayIn={150}
      ready={ready}
      className="relative z-20 flex items-center px-6 pt-6 text-xs text-white sm:px-10 sm:pt-8"
    >
      {/* Left nav */}
      <nav className="hidden flex-1 items-center gap-8 lg:flex" aria-label="Primary">
        {HEADER_LINKS.map(l => (
          <a
            key={l.href}
            href={l.href}
            onClick={e => onNavigate(e, l.href)}
            className="text-white/90 transition-colors hover:text-white"
          >
            {l.label}
          </a>
        ))}
      </nav>

      {/* Brand */}
      <div className="flex flex-1 justify-start lg:justify-center">
        <a
          href="#home"
          onClick={e => onNavigate(e, '#home')}
          className="inline-flex items-center gap-2 text-base font-medium uppercase tracking-[0.2em]"
        >
          <BrandMark className="size-5" />
          Zaky
        </a>
      </div>

      {/* Right */}
      <div className="flex flex-1 items-center justify-end gap-4 sm:gap-5">
        <div className="hidden items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-3 py-2 backdrop-blur md:flex">
          <span className="text-white/50">{CLOCK_LABEL}</span>
          <span className="min-w-14 font-medium tabular-nums text-white">{time}</span>
          <span className="text-white/30">•</span>
          <span className="font-medium text-white/90">{date}</span>
        </div>

        <button
          type="button"
          onClick={onOpenContact}
          className="hidden text-xs font-medium uppercase tracking-wide hover:underline sm:block"
        >
          Get in Touch
        </button>

        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Open menu"
          className="grid size-10 place-items-center rounded-pill bg-white/15 backdrop-blur transition-colors hover:bg-white/25"
        >
          <span className="grid gap-[5px]">
            <span className="block h-px w-4 bg-white" />
            <span className="block h-px w-4 bg-white" />
          </span>
        </button>
      </div>
    </Inview>
  )
}
