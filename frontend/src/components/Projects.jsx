import { useCallback, useState } from 'react'
import { Hover, Inview } from './motion/Spring'
import { StackedLines, WordFade } from './motion/Text'
import { Eyebrow } from './ui/Controls'
import { ArrowUpRight } from './ui/icons'
import ProjectModal from './ProjectModal'
import { useSite } from '../context/SiteContext'
import { PROJECTS_INTRO } from '../content/site'
import { portraitPhoto } from '../assets/images'

/* Baseline "court card": 3:4, caption kaca, hover scale */
function FeatureTile({ project, index, onOpen }) {
  const image = project.images?.[0]
  const [portrait, setPortrait] = useState(false)
  const caption = index % 2 === 0 ? 'bg-brand-deep/40' : 'bg-accent-deep/55'
  const tileBg = index % 2 === 0 ? 'from-brand-deep to-[#1d4a8f]' : 'from-[var(--tone2-a)] to-brand'

  return (
    <Inview
      from={{ opacity: 0, y: 48 }}
      to={{ opacity: 1, y: 0 }}
      config={{ tension: 180, friction: 26 }}
      delayIn={index * 140}
      className={`flex-1 ${index === 1 ? 'mb-8' : ''}`}
    >
      <Hover as="div" from={{ scale: 1 }} to={{ scale: 1.03 }} config={{ tension: 300, friction: 22 }}>
        <button
          type="button"
          onClick={() => onOpen(project)}
          aria-label={`View project: ${project.title}`}
          className="relative block aspect-[3/4] w-full overflow-hidden rounded-card bg-surface text-left"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${tileBg}`} />
          {image ? (
            <div
              className={
                portrait
                  ? /* screenshot portrait (mobile) → bingkai ponsel */
                    'absolute left-1/2 top-7 w-[52%] -translate-x-1/2 overflow-hidden rounded-[1.25rem] border-[5px] border-ink bg-white shadow-[0_24px_48px_rgba(5,15,40,0.45)]'
                  : /* screenshot landscape → bingkai browser, tampil utuh (tidak dipotong) */
                    'absolute inset-x-5 top-9 overflow-hidden rounded-xl bg-white shadow-[0_24px_48px_rgba(5,15,40,0.45)] ring-1 ring-white/20'
              }
            >
              {!portrait && (
                <div className="flex gap-1.5 bg-surface px-3 py-2">
                  <span className="size-1.5 rounded-pill bg-ghost" />
                  <span className="size-1.5 rounded-pill bg-ghost" />
                  <span className="size-1.5 rounded-pill bg-ghost" />
                </div>
              )}
              <img
                src={image}
                alt={project.title}
                onLoad={e => setPortrait(e.currentTarget.naturalHeight > e.currentTarget.naturalWidth)}
                className="block w-full"
              />
            </div>
          ) : null}
          <div className={`absolute inset-x-3 bottom-3 rounded-xl px-4 py-3 text-white backdrop-blur ${caption}`}>
            <p className="text-sm font-medium">{project.title}</p>
            <p className="line-clamp-2 text-[0.65rem] opacity-85">{project.description}</p>
          </div>
        </button>
      </Hover>
    </Inview>
  )
}

/* Kartu hitam gaya Lumora untuk proyek berikutnya */
function WorkCard({ project, index, onOpen }) {
  const image = project.images?.[0]
  const tech = Array.isArray(project.tech) ? project.tech.slice(0, 4) : []

  return (
    <Inview
      as="li"
      from={{ opacity: 0, y: 48 }}
      to={{ opacity: 1, y: 0 }}
      config={{ tension: 180, friction: 26 }}
      delayIn={index * 90}
    >
      <Hover as="div" from={{ y: 0, scale: 1 }} to={{ y: -8, scale: 1.012 }} config={{ tension: 260, friction: 22 }}>
        <button
          type="button"
          data-hover-root
          onClick={() => onOpen(project)}
          aria-label={`View project: ${project.title}`}
          className="relative block min-h-[22rem] w-full overflow-hidden rounded-card-lg bg-brand-deep p-6 text-left text-white ring-1 ring-white/10 sm:min-h-[26rem] sm:p-8"
        >
          <CardBackdrop tone={index % 2 === 0 ? 'navy' : 'terra'} />
          {image && (
            <>
              <img src={image} alt="" loading="lazy" className="absolute inset-0 size-full object-cover object-top opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/20" />
            </>
          )}

          <div className="relative flex items-start justify-between text-xs uppercase tracking-wide text-white/45">
            <span>{[project.company, project.year].filter(Boolean).join(' — ') || 'Project'}</span>
            <Hover
              from={{ rotate: 0, scale: 1 }}
              to={{ rotate: 45, scale: 1.08 }}
              config={{ tension: 280, friction: 18 }}
              trigger="[data-hover-root]"
              className="grid size-11 place-items-center rounded-pill bg-white/10 text-white ring-1 ring-white/15"
            >
              <ArrowUpRight className="size-5" />
            </Hover>
          </div>


          <div className="absolute inset-x-6 bottom-6 sm:inset-x-8 sm:bottom-8">
            <h3 className="text-2xl font-medium tracking-tight sm:text-3xl">{project.title}</h3>
            <p className="mt-2 line-clamp-2 max-w-md text-sm text-white/55">{project.description}</p>
            {tech.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {tech.map(t => (
                  <span key={t} className="inline-flex rounded-pill border border-white/25 px-4 py-2 text-sm">{t}</span>
                ))}
              </div>
            )}
          </div>
        </button>
      </Hover>
    </Inview>
  )
}

/* Latar kartu gelap berkarakter (navy brand, kilau lembut, grid halus) */
const TONES = {
  navy:  { bg: 'from-brand-deep via-[#12366f] to-[#1d4a8f]', glow: 'var(--glow-navy)' },
  terra: { bg: 'from-[var(--tone2-a)] via-[var(--tone2-b)] to-brand', glow: 'var(--glow-tone2)' },
}

function CardBackdrop({ tone = 'navy' }) {
  const t = TONES[tone]
  return (
    <>
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${t.bg}`} />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(ellipse 70% 60% at 15% 0%, ${t.glow}, transparent 70%)` }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
          maskImage: 'linear-gradient(to bottom right, black, transparent 80%)',
          WebkitMaskImage: 'linear-gradient(to bottom right, black, transparent 80%)',
        }}
      />
    </>
  )
}

const isSoon = p => p.status === 'coming-soon'
const isSide = p => p.images?.length > 0 && (p.layout === 'side' || isSoon(p))

function SoonPill({ className = '' }) {
  return (
    <span className={`inline-flex rounded-pill bg-white px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-ink ${className}`}>
      Coming soon
    </span>
  )
}

/* Teks di kiri, gambar di kanan (poster coming soon / screenshot mobile) */
function SideCard({ project, index, onOpen }) {
  const tech = Array.isArray(project.tech) ? project.tech : []
  return (
    <Inview
      as="li"
      from={{ opacity: 0, y: 48 }}
      to={{ opacity: 1, y: 0 }}
      config={{ tension: 180, friction: 26 }}
      delayIn={index * 90}
      className="h-full"
    >
      <Hover as="div" from={{ y: 0, scale: 1 }} to={{ y: -8, scale: 1.012 }} config={{ tension: 260, friction: 22 }} className="h-full">
        <button
          type="button"
          data-hover-root
          onClick={() => onOpen(project)}
          aria-label={`View project: ${project.title}`}
          className="relative flex h-full min-h-[22rem] w-full flex-col overflow-hidden rounded-card-lg bg-brand-deep text-left text-white ring-1 ring-white/10 sm:min-h-[26rem] sm:flex-row"
        >
          <CardBackdrop tone={index % 2 === 0 ? 'navy' : 'terra'} />
          <div className="relative flex min-w-0 flex-1 flex-col justify-between gap-8 p-6 sm:p-8">
            <div className="flex items-start justify-between gap-3">
              {isSoon(project) ? <SoonPill /> : <span className="text-xs uppercase tracking-wide text-white/60">{project.label || project.year || 'Mobile & web app'}</span>}
              <Hover
                from={{ rotate: 0, scale: 1 }}
                to={{ rotate: 45, scale: 1.08 }}
                config={{ tension: 280, friction: 18 }}
                trigger="[data-hover-root]"
                className="grid size-11 shrink-0 place-items-center rounded-pill bg-white/10 text-white ring-1 ring-white/15"
              >
                <ArrowUpRight className="size-5" />
              </Hover>
            </div>
            <div>
              {project.company && (
                <p className="text-xs uppercase tracking-wide text-white/60">{project.company}</p>
              )}
              <h3 className="mt-2 text-2xl font-medium tracking-tight sm:text-3xl">{project.title}</h3>
              <p className="mt-2 line-clamp-4 text-sm text-white/70">{project.description}</p>
              {tech.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {tech.map(t => (
                    <span key={t} className="inline-flex rounded-pill border border-white/25 px-3 py-1.5 text-xs">{t}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="relative h-[24rem] w-full shrink-0 p-3 sm:h-auto sm:w-[42%]">
            {/* gambar selalu tampil utuh dalam bingkai (poster maupun screenshot mobile) */}
            <div className="grid size-full place-items-center rounded-[1.25rem] bg-black/25 p-4 ring-1 ring-white/15 backdrop-blur-sm">
              <img
                src={project.images[0]}
                alt={project.title}
                loading="lazy"
                className="max-h-full max-w-full rounded-xl object-contain shadow-[0_20px_40px_rgba(5,15,40,0.45)] ring-1 ring-white/20"
              />
            </div>
          </div>
        </button>
      </Hover>
    </Inview>
  )
}

export default function Projects() {
  const { data } = useSite()
  const { personal, projects } = data
  const [selected, setSelected] = useState(null)
  const close = useCallback(() => setSelected(null), [])

  const featured = projects.slice(0, 2)
  const rest = projects.slice(2)

  return (
    <section
      id="projects"
      className="relative -mt-10 rounded-card-lg bg-background px-6 pb-20 pt-16 sm:px-10"
    >
      <div className="grid items-end gap-10 md:grid-cols-2">
        {/* Intro */}
        <div className="max-w-sm">
          <Inview
            from={{ opacity: 0, scale: 0.85 }}
            to={{ opacity: 1, scale: 1 }}
            config={{ tension: 240, friction: 20 }}
            className="size-16 overflow-hidden rounded-card"
          >
            <img src={personal.photo || portraitPhoto} alt="" className="size-full object-cover object-top" />
          </Inview>
          <StackedLines
            as="h2"
            lines={PROJECTS_INTRO.lines}
            stagger={120}
            className="mt-6 text-5xl font-medium leading-[0.95] tracking-tight"
          />
          <WordFade text={PROJECTS_INTRO.body} className="mt-6 max-w-xs text-sm text-ink-soft" />
        </div>

        {/* Featured */}
        {featured.length > 0 ? (
          <div className="flex items-end gap-5">
            {featured.map((p, i) => (
              <FeatureTile key={p.id} project={p} index={i} onOpen={setSelected} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink-soft">Projects are on their way — check back soon.</p>
        )}
      </div>

      {rest.length > 0 && (
        <div className="mt-20">
          <Eyebrow>More work</Eyebrow>
          <ul className="mt-6 grid gap-6 md:grid-cols-2">
            {rest.map((p, i) =>
              isSide(p)
                ? <SideCard key={p.id} project={p} index={i} onOpen={setSelected} />
                : <WorkCard key={p.id} project={p} index={i} onOpen={setSelected} />
            )}
          </ul>
        </div>
      )}

      <ProjectModal project={selected} onClose={close} />
    </section>
  )
}
