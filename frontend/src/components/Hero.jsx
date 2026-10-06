import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Header from './Header'
import LiquidReveal from './LiquidReveal'
import { Inview, SpringLayer } from './motion/Spring'
import { StackedLines, WordReveal } from './motion/Text'
import { CarouselDots } from './ui/Controls'
import { BrandMark } from './ui/icons'
import { useSite } from '../context/SiteContext'
import { useIntro } from '../context/IntroContext'
import { useParallax } from '../hooks/useParallax'
import { heroPhoto, heroReveal, portraitPhoto } from '../assets/images'

const HERO_FOCUS = [0.5, 0.5]
const SLIDER_MS = 3800
const FALLBACK_DOTS = ['#5790e6', '#c2e029', '#0b6e97', '#ffffff']

/* "Backend Developer" → ["Backend", "Developer"] */
function splitRole(role) {
  const words = (role || '').split(/\s+/).filter(Boolean)
  if (words.length < 2) return words
  const mid = Math.ceil(words.length / 2)
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')]
}

/* Kecilkan font judul bila nama terlalu panjang untuk satu baris */
function useFitFont(ref, dep) {
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const fit = () => {
      el.style.removeProperty('--title-fit')
      if (el.scrollWidth - el.clientWidth > 1) {
        const size = parseFloat(getComputedStyle(el).fontSize)
        el.style.setProperty('--title-fit', `${(size * el.clientWidth) / el.scrollWidth}px`)
      }
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [ref, dep])
}

function CollectionSlider({ slides, ready, onNavigate }) {
  const [idx, setIdx] = useState(0)
  const [prevIdx, setPrevIdx] = useState(null)
  const n = slides.length

  useEffect(() => {
    if (!ready || n < 2) return
    const t = setTimeout(() => go((idx + 1) % n), SLIDER_MS)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, idx, n])

  const go = i => {
    if (i === idx) return
    setPrevIdx(idx)
    setIdx(i)
    setTimeout(() => setPrevIdx(null), 600)
  }

  const renderCard = s => (
    <div className="flex gap-3 rounded-card border border-white/15 bg-white/10 p-3 shadow-[0_8px_24px_rgba(15,47,99,0.2)] backdrop-blur">
      <div className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-brand-deep/60 text-white/80">
        {s.image
          ? <img src={s.image} alt={s.title} className="size-full object-cover" />
          : <BrandMark className="size-6" />}
      </div>
      <div className="flex min-w-0 flex-col justify-between">
        <p className="truncate text-[0.7rem] font-medium uppercase tracking-wide">{s.brand}</p>
        <p className="truncate text-[0.7rem] uppercase opacity-80">{s.title}</p>
        <a
          href="#projects"
          onClick={e => onNavigate(e, '#projects')}
          className="text-[0.65rem] underline underline-offset-2"
        >
          {s.cta} →
        </a>
      </div>
    </div>
  )

  return (
    <div className="flex w-64 flex-col gap-3">
      <div className="grid grid-cols-[minmax(0,1fr)]">
        {prevIdx !== null && (
          <SpringLayer
            key={`out-${prevIdx}`}
            phase="out"
            from={{ opacity: 1, y: 0, scale: 1 }}
            to={{ opacity: 1, y: 0, scale: 1 }}
            out={{ opacity: 0, y: 16, scale: 0.96 }}
            config={{ tension: 210, friction: 24 }}
            className="[grid-area:1/1]"
          >
            {renderCard(slides[prevIdx])}
          </SpringLayer>
        )}
        <SpringLayer
          key={`in-${idx}`}
          from={idx === 0 && prevIdx === null ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 16, scale: 0.96 }}
          to={{ opacity: 1, y: 0, scale: 1 }}
          config={{ tension: 210, friction: 24 }}
          className="[grid-area:1/1]"
        >
          {renderCard(slides[idx])}
        </SpringLayer>
      </div>
      {n > 1 && <CarouselDots tone="light" count={n} active={idx} onSelect={go} />}
    </div>
  )
}

export default function Hero({ onNavigate, onOpenMenu, onOpenContact }) {
  const { data } = useSite()
  const { personal, skills, projects } = data
  const ready = useIntro()

  const sectionRef = useRef(null)
  const layerRef = useRef(null)
  const titleRef = useRef(null)
  useParallax(layerRef, sectionRef, { axis: 'y', from: 0, to: 12 })
  useFitFont(titleRef, personal.name)

  const roleLines = splitRole(personal.role)
  const slides = projects.slice(0, 3).map(p => ({
    image: p.images?.[0] || null,
    brand: p.company || `Project ${p.year || ''}`.trim(),
    title: p.title,
    cta: p.status === 'coming-soon' ? 'Coming soon' : 'View project',
  }))
  const dotColors = FALLBACK_DOTS.map((fb, i) => skills[i]?.color || fb)

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative isolate flex h-[calc(100svh-1rem)] min-h-[36rem] flex-col overflow-hidden rounded-card-lg bg-brand-deep text-white sm:h-[calc(100svh-1.5rem)]"
    >
      {/* Parallax photo plate */}
      <div className="absolute inset-0 -z-10">
        <div ref={layerRef} className="absolute inset-x-0 w-full will-change-transform" style={{ top: '-16%', height: '132%' }}>
          <LiquidReveal src={heroPhoto} revealSrc={heroReveal} alt="" focus={HERO_FOCUS} />
        </div>
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(15,47,99,0.65), rgba(15,47,99,0.35), rgba(15,47,99,0.75))' }}
        />
      </div>

      <Header onNavigate={onNavigate} onOpenMenu={onOpenMenu} onOpenContact={onOpenContact} />

      {/* Giant title */}
      <div className="px-6 pt-4 sm:px-10">
        <WordReveal
          id="hero-title"
          innerRef={titleRef}
          text={personal.name || 'Zaky Aprilian'}
          ready={ready}
          className="whitespace-nowrap font-medium uppercase leading-[0.85] tracking-[-0.02em]"
          style={{ fontSize: 'var(--title-fit, 12.5vw)' }}
        />
      </div>

      {/* Bottom row */}
      <div className="mt-auto flex flex-col gap-6 px-6 pb-8 sm:flex-row sm:items-end sm:justify-between sm:px-10 sm:pb-10">
        <StackedLines
          as="p"
          lines={roleLines}
          ready={ready}
          baseDelay={350}
          stagger={110}
          duration={900}
          className="text-[2.4rem] font-medium uppercase leading-[0.95] tracking-tight text-white/85"
        />

        <div className="flex items-end gap-4">
          {slides.length > 0 && (
            <Inview
              from={{ opacity: 0, y: 28 }}
              to={{ opacity: 1, y: 0 }}
              config={{ tension: 200, friction: 26 }}
              delayIn={650}
              ready={ready}
              className="hidden shrink-0 md:block"
            >
              <CollectionSlider slides={slides} ready={ready} onNavigate={onNavigate} />
            </Inview>
          )}

          <Inview
            as="article"
            from={{ opacity: 0, y: 28 }}
            to={{ opacity: 1, y: 0 }}
            config={{ tension: 200, friction: 26 }}
            delayIn={780}
            ready={ready}
            className="flex w-full max-w-80 shrink-0 items-stretch gap-3 rounded-card border border-white/15 bg-white/10 p-3 shadow-[0_8px_24px_rgba(15,47,99,0.2)] backdrop-blur sm:w-60"
          >
            <div className="flex flex-1 flex-col justify-between">
              <p className="text-3xl font-medium leading-none">{personal.yearsExp || '1+'}</p>
              <div>
                <div className="mb-2 flex -space-x-2">
                  {dotColors.map((c, i) => (
                    <span key={i} className="size-5 rounded-pill border border-brand-deep/40" style={{ background: c }} />
                  ))}
                </div>
                <p className="text-[0.65rem] opacity-80">Years of experience</p>
              </div>
            </div>
            <div className="aspect-[3/4] w-16 shrink-0 overflow-hidden rounded-xl">
              <img
                src={personal.photo || portraitPhoto}
                alt={personal.name}
                className="size-full object-cover object-top"
              />
            </div>
          </Inview>
        </div>
      </div>
    </section>
  )
}
