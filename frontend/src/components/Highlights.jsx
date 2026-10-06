import { Hover, Inview } from './motion/Spring'
import { StackedLines } from './motion/Text'
import { Eyebrow } from './ui/Controls'
import { HIGHLIGHTS } from '../content/site'
import { highlightImages } from '../assets/images'

/* Baseline "Testimonials" — diisi pencapaian & pengalaman nyata */
export default function Highlights() {
  return (
    <section id="highlights" className="bg-background px-6 py-20 sm:px-10 sm:py-24">
      <Eyebrow>Highlights</Eyebrow>
      <StackedLines
        as="h2"
        lines={['Recognition', '& experience']}
        className="mt-4 text-5xl font-medium leading-[0.95] tracking-tight"
      />

      <ul className="mt-14 grid gap-5 md:grid-cols-3">
        {HIGHLIGHTS.map((h, i) => (
          <Inview
            as="li"
            key={h.name}
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            config={{ tension: 180, friction: 26 }}
            delayIn={i * 120}
          >
            <Hover as="figure" from={{ y: 0 }} to={{ y: -8 }} config={{ tension: 300, friction: 22 }} className="flex h-full flex-col justify-between rounded-card bg-surface p-7">
              <div>
                {h.image && (
                  <img
                    src={highlightImages[h.image]}
                    alt={h.name}
                    loading="lazy"
                    className="mb-5 aspect-[4/3] w-full rounded-xl object-cover"
                  />
                )}
                <span className="font-display text-4xl font-medium leading-none text-brand">0{i + 1}</span>
                <blockquote className="mt-4 text-lg leading-relaxed text-ink">{h.quote}</blockquote>
              </div>
              <figcaption className="mt-6 border-t border-hairline pt-4">
                <p className="font-medium">{h.name}</p>
                <p className="text-sm text-ink-soft">{h.role}</p>
              </figcaption>
            </Hover>
          </Inview>
        ))}
      </ul>
    </section>
  )
}
