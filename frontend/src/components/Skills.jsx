import { Hover, Inview } from './motion/Spring'
import { StackedLines } from './motion/Text'
import { Eyebrow } from './ui/Controls'
import { ArrowRight } from './ui/icons'
import { useSite } from '../context/SiteContext'
import { EXPERTISE } from '../content/site'

/* Baseline "Programs": daftar bernomor + hover-fill ala Lumora; chip tech stack dari admin */
export default function Skills({ onNavigate }) {
  const { data } = useSite()
  const { skills } = data

  return (
    <section id="skills" className="bg-surface px-6 py-24 sm:px-10">
      <div>
        <Eyebrow>What I do</Eyebrow>
        <StackedLines
          as="h2"
          lines={['Built for', 'the full stack']}
          className="mt-4 text-5xl font-medium leading-[0.95] tracking-tight"
        />
      </div>

      <ul className="mt-14">
        {EXPERTISE.map((row, i) => (
          <li key={row.index} className="border-t border-hairline last:border-b">
            <a
              href="#projects"
              onClick={e => onNavigate(e, '#projects')}
              data-hover-root
              className="block rounded-card-sm transition-[background-color,padding] duration-300 ease-out hover:bg-background hover:px-6 focus-visible:bg-background"
            >
              <Inview
                from={{ opacity: 0, y: 26 }}
                to={{ opacity: 1, y: 0 }}
                config={{ tension: 190, friction: 26 }}
                delayIn={i * 90}
                className="flex items-center gap-6 py-7"
              >
                <span className="w-10 text-sm font-medium text-ink-soft">{row.index}</span>
                <div className="flex-1">
                  <h3 className="text-2xl font-medium tracking-tight sm:text-3xl">{row.name}</h3>
                  <p className="mt-1 text-sm text-ink-soft">{row.description}</p>
                </div>
                <span className="grid size-11 shrink-0 place-items-center rounded-pill border border-hairline">
                  <Hover
                    from={{ x: 0, opacity: 0.55 }}
                    to={{ x: 8, opacity: 1 }}
                    config={{ tension: 300, friction: 20 }}
                    trigger="[data-hover-root]"
                    className="inline-flex"
                  >
                    <ArrowRight className="size-5" />
                  </Hover>
                </span>
              </Inview>
            </a>
          </li>
        ))}
      </ul>

      {skills.length > 0 && (
        <Inview
          from={{ opacity: 0, y: 24 }}
          to={{ opacity: 1, y: 0 }}
          config={{ tension: 190, friction: 26 }}
          className="mt-14"
        >
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-ink-soft">Tech stack</p>
          <ul className="mt-5 flex flex-wrap gap-3">
            {skills.map(s => (
              <li
                key={s.id}
                className="inline-flex items-center gap-2 rounded-pill border border-hairline bg-background px-4 py-2 text-sm"
              >
                <span className="size-2.5 rounded-pill" style={{ background: s.color }} />
                {s.label}
              </li>
            ))}
          </ul>
        </Inview>
      )}
    </section>
  )
}
