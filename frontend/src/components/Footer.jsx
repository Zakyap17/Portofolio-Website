import { Inview } from './motion/Spring'
import { StackedLines } from './motion/Text'
import { Eyebrow, PillButton } from './ui/Controls'
import { BrandMark } from './ui/icons'
import { useSite } from '../context/SiteContext'
import { EXPERTISE, MENU_LINKS } from '../content/site'

export default function Footer({ onNavigate, onOpenContact }) {
  const { data } = useSite()
  const { personal } = data

  const connect = [
    personal.linkedin && { label: 'LinkedIn', href: personal.linkedin, external: true },
    personal.github   && { label: 'GitHub',   href: personal.github,   external: true },
    personal.email    && { label: 'Email',    href: `mailto:${personal.email}` },
    personal.cvUrl    && { label: 'Download CV', href: personal.cvUrl, download: true },
  ].filter(Boolean)

  return (
    <footer
      id="contact"
      className="relative mt-3 overflow-hidden rounded-card-lg bg-brand-deep px-6 py-14 text-white sm:px-10 sm:py-16"
    >
      {/* Watermark (Lumora) */}
      <p
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-6 select-none text-center font-medium uppercase leading-none text-white/5"
        style={{ fontSize: '13rem' }}
      >
        Zaky
      </p>

      <div className="relative">
        {/* CTA band */}
        <div className="flex flex-col justify-between gap-6 border-b border-white/15 pb-14 sm:flex-row sm:items-end">
          <div>
            <Eyebrow tone="light">Contact</Eyebrow>
            <StackedLines
              as="p"
              lines={['Ready to', 'build?']}
              className="mt-4 text-6xl font-medium leading-[0.92] tracking-tight"
            />
          </div>
          <Inview
            from={{ opacity: 0, y: 20 }}
            to={{ opacity: 1, y: 0 }}
            config={{ tension: 200, friction: 24 }}
            delayIn={150}
          >
            <PillButton variant="light" onClick={onOpenContact}>Get in Touch</PillButton>
          </Inview>
        </div>

        {/* Columns */}
        <div className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 text-lg font-medium uppercase tracking-[0.2em]">
              <BrandMark className="size-5" />
              Zaky
            </div>
            <p className="mt-4 text-sm text-white/65">
              {personal.role || 'Full-Stack Developer'} — building reliable systems and clean interfaces, from database to deployment.
            </p>
            {personal.email && (
              <address className="mt-6 text-sm not-italic text-white/80">
                <a href={`mailto:${personal.email}`} className="block hover:text-white">{personal.email}</a>
              </address>
            )}
          </div>

          <nav aria-label="Navigate">
            <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">Navigate</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              {MENU_LINKS.map(l => (
                <li key={l.href}>
                  <a href={l.href} onClick={e => onNavigate(e, l.href)} className="hover:text-white">{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Expertise">
            <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">Expertise</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              {EXPERTISE.map(e => (
                <li key={e.index}>
                  <a href="#skills" onClick={ev => onNavigate(ev, '#skills')} className="hover:text-white">{e.name}</a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Connect">
            <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">Connect</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              {connect.map(c => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    target={c.external ? '_blank' : undefined}
                    rel={c.external ? 'noreferrer' : undefined}
                    download={c.download || undefined}
                    className="hover:text-white"
                  >
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-center gap-5 border-t border-white/15 pt-8 text-sm text-white/60">
          <p>© {new Date().getFullYear()} {personal.name || 'Zaky Aprilian'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
