import { useReveal } from '../hooks/useReveal'
import { useSite } from '../context/SiteContext'

const socialIcons = {
  linkedin: {
    color: '#0077B5',
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  email: {
    color: '#00d4ff',
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>
      </svg>
    ),
  },
  github: {
    color: '#e2e8f0',
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    ),
  },
}

export default function Footer({ onNavigate }) {
  const { data } = useSite()
  const { personal } = data
  const { ref, style } = useReveal()

  const socials = [
    personal.linkedin && { key: 'linkedin', label: 'LinkedIn', href: personal.linkedin,          external: true  },
    personal.email    && { key: 'email',    label: 'Email',    href: `mailto:${personal.email}`, external: false },
    personal.github   && { key: 'github',   label: 'GitHub',   href: personal.github,            external: true  },
  ].filter(Boolean)

  return (
    <footer
      id="contact"
      style={{ background: '#0d1117', position: 'relative' }}
    >
      {/* Gradient top line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.35) 50%, transparent 100%)',
      }}/>

      <div
        ref={ref}
        style={{
          maxWidth: 1200, margin: '0 auto',
          padding: '36px clamp(24px, 6vw, 80px)',
          display: 'flex', flexWrap: 'wrap',
          alignItems: 'center', justifyContent: 'space-between',
          gap: 20,
          ...style('0s'),
        }}
      >
        {/* Left: Logo + role */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#e2e8f0', letterSpacing: '-0.5px' }}>ZA</span>
            <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#00d4ff' }}>.</span>
          </div>
          <span style={{ fontSize: 12, color: '#334155' }}>
            {personal.role || 'Backend Developer'}
          </span>
        </div>

        {/* Center: Social icon buttons */}
        {socials.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {socials.map(s => {
              const { color, icon } = socialIcons[s.key]
              return (
                <a
                  key={s.key}
                  href={s.href}
                  target={s.external ? '_blank' : undefined}
                  rel={s.external ? 'noreferrer' : undefined}
                  title={s.label}
                  style={{
                    width: 40, height: 40, borderRadius: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid rgba(255,255,255,0.07)',
                    background: 'rgba(255,255,255,0.03)',
                    color: '#475569',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = color
                    e.currentTarget.style.borderColor = `${color}40`
                    e.currentTarget.style.background = `${color}10`
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = '#475569'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                  }}
                >
                  {icon}
                </a>
              )
            })}

          </div>
        )}

        {/* Right: Copyright */}
        <p style={{ fontSize: 12, color: '#1e293b', margin: 0, whiteSpace: 'nowrap' }}>
          © {new Date().getFullYear()} {personal.name || 'Zaky Aprilian'}
        </p>
      </div>
    </footer>
  )
}
