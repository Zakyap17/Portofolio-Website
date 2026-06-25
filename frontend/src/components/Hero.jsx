import { useSite } from '../context/SiteContext'
import defaultPhoto from '../assets/images/Photo.jpeg'

const sidePositions = {
  right: [
    { top: '8%',     right: '-155px' },
    { top: '40%',    right: '-145px' },
    { bottom: '18%', right: '-155px' },
  ],
  left: [
    { top: '12%',   left: '-130px' },
    { top: '42%',   left: '-120px' },
    { bottom: '20%', left: '-125px' },
  ],
}

export default function Hero({ onNavigate }) {
  const { data } = useSite()
  const { personal, skills, projects } = data

  const photoSrc = personal.photo || defaultPhoto

  const leftSkills  = skills.filter(s => s.side === 'left').slice(0, 3)
  const rightSkills = skills.filter(s => s.side === 'right').slice(0, 3)
  const badges = [
    ...rightSkills.map((s, i) => ({ ...s, pos: sidePositions.right[i], delay: `${i * 0.5}s` })),
    ...leftSkills.map((s,  i) => ({ ...s, pos: sidePositions.left[i],  delay: `${(i * 0.5) + 0.3}s` })),
  ]

  return (
    <section
      id="home"
      className="hero-section"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(145deg, #0d1117 0%, #0e2040 30%, #131c2e 55%, #1a1a2e 80%, #0d1117 100%)',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '80px',
        paddingBottom: '40px',
        position: 'relative',
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 55% 60% at 75% 45%, rgba(0,180,255,0.09) 0%, transparent 70%)',
      }}/>

      <div className="hero-grid" style={{
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 clamp(24px, 6vw, 80px)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '60px',
        alignItems: 'center',
      }}>

        {/* ── LEFT: Text Content ── */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          animation: 'heroFadeIn 0.8s ease both',
        }}>
          {/* Year tag */}
          <span style={{
            fontSize: 13, fontWeight: 600, letterSpacing: '3px',
            textTransform: 'uppercase', color: '#00d4ff', opacity: 0.8,
          }}>
            {personal.yearLabel}
          </span>

          {/* Name + Role */}
          <div>
            <h1 style={{
              margin: 0,
              fontSize: 'clamp(3rem, 5.5vw, 5.5rem)',
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: '-2px',
              color: '#00d4ff',
            }}>
              {personal.name}
            </h1>
            <p style={{
              margin: '12px 0 0',
              fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
              fontWeight: 500,
              color: '#cbd5e1',
              letterSpacing: '0.5px',
            }}>
              {personal.role}
            </p>
            <div style={{ marginTop: 14, width: 48, height: 3, borderRadius: 4, background: '#00d4ff' }}/>
          </div>

          {/* Description */}
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.8, color: '#7a92b0', maxWidth: 420 }}>
            {personal.description}
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a
              href="#projects"
              onClick={e => onNavigate?.(e, '#projects')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '11px 26px', borderRadius: 8,
                background: '#00d4ff', color: '#0a1628',
                fontSize: 14, fontWeight: 700, textDecoration: 'none',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Lihat Projects
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>
            </a>

            {personal.cvUrl && (
              <a
                href={personal.cvUrl}
                download
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '11px 26px', borderRadius: 8,
                  border: '1.5px solid rgba(0,212,255,0.45)',
                  color: '#00d4ff', fontSize: 14, fontWeight: 600,
                  textDecoration: 'none', background: 'transparent',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,212,255,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                Download CV
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                </svg>
              </a>
            )}
          </div>

          {/* Social links */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {personal.linkedin && (
              <a href={personal.linkedin} target="_blank" rel="noreferrer"
                style={socialLinkStyle('#0077B5')}
                onMouseEnter={e => e.currentTarget.style.background = '#0077B518'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >LinkedIn</a>
            )}
            {personal.email && (
              <a href={`mailto:${personal.email}`}
                style={socialLinkStyle('#00d4ff')}
                onMouseEnter={e => e.currentTarget.style.background = '#00d4ff18'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >Email</a>
            )}
            {personal.github && (
              <a href={personal.github} target="_blank" rel="noreferrer"
                style={socialLinkStyle('#cbd5e1')}
                onMouseEnter={e => e.currentTarget.style.background = '#ffffff12'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >GitHub</a>
            )}
          </div>
        </div>

        {/* ── RIGHT: Photo ── */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          position: 'relative',
          animation: 'heroFadeIn 0.8s ease 0.2s both',
        }}>
          <div style={{ position: 'relative' }}>
            {/* Photo card */}
            <div style={{
              width: '220px', height: '290px',
              borderRadius: 20, overflow: 'hidden',
              background: '#0a1628',
              border: '2px solid rgba(0,212,255,0.25)',
              boxShadow: '0 0 80px rgba(0,180,255,0.12), 0 32px 64px rgba(0,0,0,0.5)',
              position: 'relative',
            }}>
              <img
                src={photoSrc}
                alt={personal.name}
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover', objectPosition: 'center top',
                  display: 'block', filter: 'brightness(0.95)',
                }}
              />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px',
                background: 'linear-gradient(to top, rgba(10,22,40,0.8) 0%, transparent 100%)',
              }}/>
            </div>

            {/* Stat card — kiri */}
            <div className="hero-stat" style={{
              position: 'absolute', top: '22%', left: '-55px',
              background: 'rgba(8,18,35,0.92)', border: '1px solid rgba(0,212,255,0.3)',
              backdropFilter: 'blur(16px)', borderRadius: 12,
              padding: '12px 18px', textAlign: 'center', minWidth: 80,
            }}>
              <p style={{ margin: 0, fontSize: 26, fontWeight: 900, color: '#00d4ff', lineHeight: 1 }}>{personal.yearsExp}</p>
              <p style={{ margin: '4px 0 0', fontSize: 10, color: '#4a6080', lineHeight: 1.4 }}>Years of<br/>Experience</p>
            </div>

            {/* Stat card — kanan */}
            <div className="hero-stat" style={{
              position: 'absolute', bottom: '20%', right: '-55px',
              background: 'rgba(8,18,35,0.92)', border: '1px solid rgba(0,212,255,0.3)',
              backdropFilter: 'blur(16px)', borderRadius: 12,
              padding: '12px 18px', textAlign: 'center', minWidth: 80,
            }}>
              <p style={{ margin: 0, fontSize: 26, fontWeight: 900, color: '#00d4ff', lineHeight: 1 }}>{projects.length}</p>
              <p style={{ margin: '4px 0 0', fontSize: 10, color: '#4a6080', lineHeight: 1.4 }}>Finish<br/>Project</p>
            </div>

            {/* Floating skill badges */}
            {badges.map((b, i) => (
              <div
                className="hero-badge"
                key={b.id ?? i}
                style={{
                  position: 'absolute',
                  ...b.pos,
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '6px 12px', borderRadius: 8,
                  background: 'rgba(8, 18, 35, 0.88)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(12px)',
                  fontSize: 12, fontWeight: 500, color: '#cbd5e1',
                  whiteSpace: 'nowrap',
                  animation: 'floatY 4s ease-in-out infinite',
                  animationDelay: b.delay,
                }}
              >
                <span style={{
                  width: 18, height: 18, borderRadius: 4,
                  background: b.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, fontWeight: 800, color: '#fff', flexShrink: 0,
                }}>
                  {b.label[0]}
                </span>
                {b.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .hero-badge, .hero-stat { display: none !important; }
          .hero-section {
            min-height: auto !important;
            padding-bottom: 60px !important;
          }
        }
      `}</style>
    </section>
  )
}

function socialLinkStyle(color) {
  return {
    padding: '8px 20px', borderRadius: 7,
    border: `1px solid ${color}35`,
    color, fontSize: 13, fontWeight: 500,
    textDecoration: 'none', background: 'transparent',
    transition: 'background 0.2s',
  }
}
