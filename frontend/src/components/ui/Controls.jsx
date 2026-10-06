import { Hover } from '../motion/Spring'
import { ArrowRight } from './icons'

export function Eyebrow({ children, tone = 'dark', className = '' }) {
  const text = tone === 'light' ? 'text-white/70' : 'text-ink-soft'
  const dot = tone === 'light' ? 'bg-brand-light' : 'bg-brand'
  return (
    <span className={`inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] ${text} ${className}`}>
      <span className={`size-1.5 rounded-pill ${dot}`} />
      {children}
    </span>
  )
}

const PILL_VARIANTS = {
  light:   'bg-white text-brand-deep hover:bg-brand-light hover:text-brand-deep',
  solid:   'bg-ink text-white hover:bg-brand-deep',
  outline: 'border border-current text-ink hover:bg-ink hover:text-white',
}

export function PillButton({ children, variant = 'solid', arrow = true, className = '', as, ...rest }) {
  const Tag = as || 'button'
  return (
    <Tag
      data-hover-root
      className={`inline-flex items-center gap-2 rounded-pill px-7 py-3.5 text-sm font-medium uppercase tracking-wide transition-colors ${PILL_VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {children}
      {arrow && (
        <Hover from={{ x: 0 }} to={{ x: 5 }} config={{ tension: 320, friction: 20 }} trigger="[data-hover-root]" className="inline-flex">
          <ArrowRight className="size-4" />
        </Hover>
      )}
    </Tag>
  )
}

export function ArrowButton({ dir = 'next', variant = 'outline', label, ...rest }) {
  const styles = variant === 'solid'
    ? 'bg-ink border-ink text-white hover:bg-brand-deep'
    : 'border-hairline bg-transparent text-ink hover:border-ink'
  return (
    <button
      type="button"
      data-hover-root
      aria-label={label || (dir === 'next' ? 'Next' : 'Previous')}
      className={`grid size-12 place-items-center rounded-pill border transition-colors sm:size-14 ${styles}`}
      {...rest}
    >
      <Hover from={{ scale: 1 }} to={{ scale: 1.15 }} config={{ tension: 320, friction: 18 }} trigger="[data-hover-root]" className="inline-flex">
        <ArrowRight className="size-5" flip={dir === 'prev'} />
      </Hover>
    </button>
  )
}

export function CarouselDots({ count, active, onSelect, tone = 'dark' }) {
  const on   = tone === 'light' ? 'bg-white'     : 'bg-ink'
  const idle = tone === 'light' ? 'bg-white/40'  : 'bg-ghost'
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`Go to slide ${i + 1}`}
          aria-current={i === active ? 'true' : undefined}
          className="p-1.5"
        >
          <span
            className={`block h-1.5 rounded-pill transition-all duration-300 ${i === active ? `w-5 ${on}` : `w-1.5 ${idle}`}`}
          />
        </button>
      ))}
    </div>
  )
}
