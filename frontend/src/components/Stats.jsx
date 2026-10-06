import { useRef } from 'react'
import { Inview } from './motion/Spring'
import { StackedLines } from './motion/Text'
import { Eyebrow } from './ui/Controls'
import { useSite } from '../context/SiteContext'
import { useCountUp } from '../hooks/useCountUp'

function StatCell({ value, suffix = '', label, index }) {
  const ref = useRef(null)
  const count = useCountUp(ref, value)

  return (
    <Inview
      as="div"
      from={{ opacity: 0, y: 30 }}
      to={{ opacity: 1, y: 0 }}
      config={{ tension: 180, friction: 24 }}
      delayIn={index * 110}
      className="border-t border-white/20 pt-5"
    >
      <dt className="sr-only">{label}</dt>
      <dd>
        <p ref={ref} className="text-6xl font-medium tracking-tight tabular-nums sm:text-7xl">
          {count}{suffix}
        </p>
        <p className="mt-3 text-sm text-white/65">{label}</p>
      </dd>
    </Inview>
  )
}

/* Panel navy (Baseline) dengan count-up berbasis scroll (Lumora) — semua angka dari data asli */
export default function Stats() {
  const { data } = useSite()
  const { personal, skills, projects } = data

  const m = String(personal.yearsExp || '').match(/^(\d+)(.*)$/)
  const stats = [
    { value: m ? Number(m[1]) : 0, suffix: m ? m[2] : '', label: 'Years of experience' },
    { value: projects.filter(p => p.status !== 'coming-soon').length, label: 'Projects delivered' },
    { value: skills.length, label: 'Technologies in the stack' },
    { value: 2, label: 'Industry internships' },
  ]

  return (
    <section className="mt-3 rounded-card-lg bg-brand-deep px-6 py-20 text-white sm:px-10">
      <Eyebrow tone="light">By the numbers</Eyebrow>
      <StackedLines
        as="h2"
        lines={['A developer', 'who ships']}
        className="mt-4 text-5xl font-medium leading-[0.95] tracking-tight"
      />
      <dl className="mt-16 grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
        {stats.map((s, i) => (
          <StatCell key={s.label} index={i} {...s} />
        ))}
      </dl>
    </section>
  )
}
