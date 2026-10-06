import { useEffect, useRef, useState } from 'react'
import { Inview, SpringLayer } from './motion/Spring'
import { ClipWord } from './motion/Text'
import { ArrowButton, CarouselDots } from './ui/Controls'
import { useSite } from '../context/SiteContext'
import { useInView } from '../hooks/useInView'
import { useParallax } from '../hooks/useParallax'
import { ABOUT_BADGE, ABOUT_HEADLINES } from '../content/site'
import { portraitPhoto } from '../assets/images'

/* Posisi ghost word: [kiri-atas, kanan-atas, kiri-bawah, kanan-bawah] → parallax X (%) */
const GHOST_PARALLAX = [[-3, 3], [3, -3], [-2, 4], [4, -3]]

function GhostWord({ text, play, index, className }) {
  const ref = useRef(null)
  const [from, to] = GHOST_PARALLAX[index]
  useParallax(ref, null, { axis: 'x', from, to })
  return (
    <span ref={ref} className="block will-change-transform">
      <ClipWord text={text} play={play} className={className} />
    </span>
  )
}

function CoachPhoto({ slide }) {
  const [layers, setLayers] = useState([slide])

  // layer baru fade-in di atas yang lama; layer lama dibuang setelah crossfade
  useEffect(() => {
    setLayers(l => (l.some(x => x.key === slide.key) ? l : [...l.slice(-1), slide]))
    const t = setTimeout(() => setLayers(l => l.filter(x => x.key === slide.key)), 700)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slide.key])

  return layers.map((l, i) => (
    <SpringLayer
      key={l.key}
      from={{ opacity: i === 0 && layers.length === 1 ? 1 : 0 }}
      to={{ opacity: 1 }}
      config={{ tension: 260, friction: 26 }}
      className="absolute inset-0"
    >
      {l.fit === 'frame' ? (
        <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-[var(--tone2-a)] to-brand px-4 pb-20 pt-5">
          <img
            src={l.image}
            alt={l.alt}
            className="max-h-full max-w-full rounded-xl bg-white object-contain shadow-[0_20px_40px_rgba(5,15,40,0.45)] ring-1 ring-white/20"
          />
        </div>
      ) : (
        <img src={l.image} alt={l.alt} className="size-full object-cover object-top" />
      )}
    </SpringLayer>
  ))
}

export default function About() {
  const { data } = useSite()
  const { personal, projects } = data
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { rootMargin: '0px 0px -15% 0px' })
  const [slide, setSlide] = useState(0)
  const n = ABOUT_HEADLINES.length

  const portrait = personal.photo || portraitPhoto
  const name = personal.name || 'Zaky Aprilian'
  const projectSlide = (key, p) => {
    const image = p?.highlight || p?.images?.[0]
    return {
      key,
      image: image || portrait,
      fit: image ? 'frame' : 'cover',
      alt: p?.title || name,
      name: p?.title || name,
      role: p ? 'Featured project' : personal.role,
    }
  }
  const slides = [
    { key: 'p', image: portrait, fit: 'cover', alt: name, name, role: personal.role || 'Full-Stack Developer' },
    projectSlide('a', projects[0]),
    projectSlide('b', projects[1]),
  ]
  const active = slides[slide]
  const words = ABOUT_HEADLINES[slide]

  const prev = () => setSlide(s => (s - 1 + n) % n)
  const next = () => setSlide(s => (s + 1) % n)

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-background px-6 py-16 sm:px-10 sm:py-20"
    >
      {/* Badges */}
      <div className="relative z-20 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <Inview
          from={{ opacity: 0, scale: 0.9 }}
          to={{ opacity: 1, scale: 1 }}
          config={{ tension: 220, friction: 22 }}
          className="grid size-28 shrink-0 place-items-center rounded-pill bg-surface text-center sm:size-32"
        >
          <div>
            <p className="font-display text-2xl font-medium">{projects.filter(p => p.status !== 'coming-soon').length}</p>
            <p className="mx-auto max-w-[7em] text-[0.6rem] text-ink-soft">Projects built end to end</p>
          </div>
        </Inview>

        <Inview
          as="article"
          from={{ opacity: 0, y: 24 }}
          to={{ opacity: 1, y: 0 }}
          config={{ tension: 200, friction: 26 }}
          delayIn={120}
          className="flex max-w-md gap-4 rounded-card bg-surface p-5 sm:gap-5 sm:p-6"
        >
          <span className="h-fit rounded-xl bg-background px-4 py-2 text-xl font-medium">{ABOUT_BADGE.index}</span>
          <div>
            <h3 className="text-lg font-medium">{ABOUT_BADGE.title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-ink-soft">{personal.description}</p>
          </div>
        </Inview>
      </div>

      {/* Ghost headline */}
      <h2
        id="about-title"
        className="pointer-events-none relative z-0 mx-auto mt-12 max-w-[88rem] select-none font-medium uppercase leading-[1.02] tracking-[-0.02em]"
        style={{ fontSize: '8.2vw' }}
      >
        <span className="sr-only">{words.join(' ')}</span>
        <span aria-hidden="true" className="flex justify-between">
          <GhostWord key={`${slide}-0`} index={0} play={inView} text={words[0]} className="text-ghost" />
          <GhostWord key={`${slide}-1`} index={1} play={inView} text={words[1]} className="text-ghost" />
        </span>
        <span aria-hidden="true" className="flex justify-between">
          <GhostWord key={`${slide}-2`} index={2} play={inView} text={words[2]} className="text-ink" />
          <GhostWord key={`${slide}-3`} index={3} play={inView} text={words[3]} className="text-ghost" />
        </span>
      </h2>

      {/* Center card */}
      <div className="relative z-10 mx-auto mt-8 w-52 sm:absolute sm:left-1/2 sm:top-1/2 sm:mt-0 sm:w-64 sm:-translate-x-1/2 sm:-translate-y-1/2">
        <Inview
          as="figure"
          from={{ opacity: 0, y: 60, scale: 0.92, rotate: 6 }}
          to={{ opacity: 1, y: 0, scale: 1, rotate: 6 }}
          config={{ tension: 170, friction: 26 }}
          className="relative aspect-[3/4] overflow-hidden rounded-card bg-brand"
        >
          <CoachPhoto slide={{ key: active.key, image: active.image, fit: active.fit, alt: active.alt }} />
          <figcaption className="absolute inset-x-3 bottom-3 rounded-xl bg-brand-deep/40 px-3 py-2 text-white backdrop-blur">
            <p className="text-sm font-medium">{active.name}</p>
            <p className="text-[0.65rem] opacity-80">{active.role}</p>
          </figcaption>
        </Inview>
      </div>

      {/* Controls */}
      <div className="relative z-20 mt-12 flex items-center justify-between sm:mt-24">
        <ArrowButton dir="prev" variant="outline" onClick={prev} />
        <CarouselDots count={n} active={slide} onSelect={setSlide} />
        <ArrowButton dir="next" variant="solid" onClick={next} />
      </div>
    </section>
  )
}
