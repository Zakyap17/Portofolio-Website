import { useState, useEffect, useRef } from 'react'
import { useReveal } from '../hooks/useReveal'
import { useSite } from '../context/SiteContext'

/* ── Modal dengan inner photo slider ── */
function Modal({ project, onClose }) {
  const [photoIdx, setPhotoIdx] = useState(0)
  const total = project.images.length

  const prevPhoto = () => setPhotoIdx(i => (i - 1 + total) % total)
  const nextPhoto = () => setPhotoIdx(i => (i + 1) % total)

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(5, 10, 20, 0.92)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 900,
          background: '#0f1e35',
          border: '1px solid rgba(0,212,255,0.2)',
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* Photo slider */}
        <div style={{ position: 'relative', height: 400, background: 'rgba(0,212,255,0.04)' }}>
          {total > 0 ? (
            <img
              src={project.images[photoIdx]}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 12,
            }}>
              <svg width="56" height="56" fill="none" viewBox="0 0 48 48">
                <rect x="4" y="4" width="40" height="40" rx="6" stroke="#00d4ff" strokeWidth="1.5" strokeOpacity="0.25"/>
                <path d="M4 30l10-10 8 8 6-6 16 16" stroke="#00d4ff" strokeWidth="1.5" strokeOpacity="0.25" strokeLinecap="round"/>
              </svg>
              <span style={{ fontSize: 13, color: '#334155' }}>Belum ada screenshot</span>
            </div>
          )}

          {total > 1 && (
            <>
              <button onClick={prevPhoto} style={navBtnStyle('left')}>←</button>
              <button onClick={nextPhoto} style={navBtnStyle('right')}>→</button>
              <div style={{
                position: 'absolute', bottom: 14, left: 0, right: 0,
                display: 'flex', justifyContent: 'center', gap: 6,
              }}>
                {project.images.map((_, i) => (
                  <button key={i} onClick={() => setPhotoIdx(i)} style={{
                    width: i === photoIdx ? 20 : 6, height: 6,
                    borderRadius: 3, border: 'none', padding: 0, cursor: 'pointer',
                    background: i === photoIdx ? '#00d4ff' : 'rgba(255,255,255,0.3)',
                    transition: 'all 0.25s',
                  }}/>
                ))}
              </div>
              <div style={{
                position: 'absolute', top: 14, right: 14,
                padding: '3px 10px', borderRadius: 20,
                background: 'rgba(10,22,40,0.8)', backdropFilter: 'blur(8px)',
                fontSize: 11, color: '#94a3b8', fontWeight: 600,
              }}>
                {photoIdx + 1} / {total}
              </div>
            </>
          )}

          {/* Close button */}
          <button onClick={onClose} style={{
            position: 'absolute', top: 14, left: 14,
            width: 32, height: 32, borderRadius: 8,
            background: 'rgba(10,22,40,0.8)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#94a3b8', cursor: 'pointer', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            ✕
          </button>
        </div>

        {/* Detail */}
        <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            {project.company && (
              <p style={{ margin: '0 0 6px', fontSize: 12, color: '#475569' }}>@ {project.company}</p>
            )}
            <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#f1f5f9' }}>
              {project.title}
            </h3>
          </div>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.8, color: '#7a92b0' }}>
            {project.description}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {project.tech.map(t => (
              <span key={t} style={{
                padding: '4px 12px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff',
              }}>{t}</span>
            ))}
          </div>
          {(project.github || project.demo) && (
            <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
              {project.github && (
                <a href={project.github} target="_blank" rel="noreferrer" style={linkBtnStyle('outline')}>
                  GitHub
                </a>
              )}
              {project.demo && (
                <a href={project.demo} target="_blank" rel="noreferrer" style={linkBtnStyle('fill')}>
                  Live Demo →
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Main ── */
export default function Projects() {
  const { data } = useSite()
  const projects = data.projects
  const { ref: sectionRef, style: reveal } = useReveal()
  const [active, setActive] = useState(0)
  const [modal, setModal] = useState(null)
  const [animating, setAnimating] = useState(false)
  const [dir, setDir] = useState('right')
  const total = projects.length
  const autoRef = useRef(null)

  const goTo = (idx, direction = 'right') => {
    if (animating) return
    setDir(direction)
    setAnimating(true)
    setTimeout(() => {
      setActive(idx)
      setAnimating(false)
    }, 420)
  }

  const prev = () => goTo((active - 1 + total) % total, 'left')
  const next = () => goTo((active + 1) % total, 'right')

  useEffect(() => {
    if (modal) return
    autoRef.current = setInterval(() => {
      goTo((active + 1) % total, 'right')
    }, 4000)
    return () => clearInterval(autoRef.current)
  }, [active, modal])

  const getVisible = () => {
    const p = (active - 1 + total) % total
    const n = (active + 1) % total
    return [p, active, n]
  }

  const [prevIdx, curIdx, nextIdx] = getVisible()

  if (total === 0) {
    return (
      <section id="projects" style={{ padding: '100px 0 80px', background: 'linear-gradient(180deg, #0d1117 0%, #131923 40%, #111520 100%)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(24px, 6vw, 80px)', textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 24px', fontWeight: 900, fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#f1f5f9' }}>
            <span style={{ color: '#00d4ff' }}>Project</span>
          </h2>
          <p style={{ color: '#334155', fontSize: 14 }}>Belum ada project yang ditambahkan.</p>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" style={{ padding: '100px 0 80px', background: 'linear-gradient(180deg, #0d1117 0%, #131923 40%, #111520 100%)' }}>
      <div ref={sectionRef} style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(24px, 6vw, 80px)', ...reveal() }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{
            margin: 0, fontWeight: 900, lineHeight: 1.1, letterSpacing: '-1px',
            fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#f1f5f9',
          }}>
            <span style={{ color: '#00d4ff' }}>Project</span>
          </h2>
        </div>

        {/* 3-card row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.15fr 1fr',
          gap: 20,
          alignItems: 'center',
          opacity: animating ? 0 : 1,
          transform: animating
            ? `translateX(${dir === 'right' ? '-32px' : '32px'})`
            : 'translateX(0)',
          transition: animating
            ? 'opacity 0.22s ease, transform 0.22s ease'
            : 'opacity 0.3s ease, transform 0.3s ease',
        }}>
          {[prevIdx, curIdx, nextIdx].map((idx, pos) => {
            const p = projects[idx]
            const isCenter = pos === 1
            return (
              <div
                key={`${pos}-${idx}`}
                onClick={() => !isCenter && goTo(idx, pos === 0 ? 'left' : 'right')}
                style={{
                  borderRadius: 16,
                  overflow: 'hidden',
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isCenter ? 'rgba(0,212,255,0.35)' : 'rgba(255,255,255,0.06)'}`,
                  boxShadow: isCenter ? '0 20px 60px rgba(0,0,0,0.5)' : '0 8px 24px rgba(0,0,0,0.3)',
                  opacity: isCenter ? 1 : 0.55,
                  transform: isCenter ? 'scale(1)' : 'scale(0.96)',
                  transition: 'all 0.35s ease',
                  cursor: isCenter ? 'default' : 'pointer',
                }}
              >
                {/* Image */}
                <div style={{
                  height: isCenter ? 240 : 200,
                  background: 'rgba(0,212,255,0.04)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'height 0.35s ease',
                  overflow: 'hidden',
                }}>
                  {p.images.length > 0 ? (
                    <img src={p.images[0]} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                  ) : (
                    <svg width="40" height="40" fill="none" viewBox="0 0 48 48">
                      <rect x="4" y="4" width="40" height="40" rx="6" stroke="#00d4ff" strokeWidth="1.5" strokeOpacity="0.25"/>
                      <path d="M4 30l10-10 8 8 6-6 16 16" stroke="#00d4ff" strokeWidth="1.5" strokeOpacity="0.25" strokeLinecap="round"/>
                    </svg>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: isCenter ? '20px 22px 24px' : '16px 18px 20px' }}>
                  <h3 style={{
                    margin: '0 0 8px', fontWeight: 700, lineHeight: 1.3,
                    fontSize: isCenter ? '1rem' : '0.9rem', color: '#f1f5f9',
                  }}>
                    {p.title}
                  </h3>
                  <p style={{
                    margin: 0, fontSize: 13, lineHeight: 1.7, color: '#64748b',
                    display: '-webkit-box', WebkitLineClamp: isCenter ? 3 : 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {p.description}
                  </p>

                  {isCenter && (
                    <button
                      onClick={() => setModal(p)}
                      style={{
                        marginTop: 16, padding: '9px 22px', borderRadius: 8,
                        background: '#00d4ff', color: '#0a1628',
                        border: 'none', fontSize: 13, fontWeight: 700,
                        cursor: 'pointer', transition: 'opacity 0.2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                      Lihat Detail →
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Dots + arrows */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 20, marginTop: 40,
        }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {projects.map((_, i) => (
              <button key={i} onClick={() => goTo(i, i > active ? 'right' : 'left')} style={{
                width: i === active ? 28 : 8, height: 8,
                borderRadius: 4, border: 'none', padding: 0, cursor: 'pointer',
                background: i === active ? '#00d4ff' : 'rgba(0,212,255,0.2)',
                transition: 'all 0.3s ease',
              }}/>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            {[{ label: '←', fn: prev }, { label: '→', fn: next }].map(btn => (
              <button key={btn.label} onClick={btn.fn} style={{
                width: 44, height: 44, borderRadius: 10,
                border: '1px solid rgba(0,212,255,0.25)',
                background: 'rgba(0,212,255,0.06)', color: '#00d4ff',
                cursor: 'pointer', fontSize: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,212,255,0.15)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,212,255,0.06)'}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal && <Modal project={modal} onClose={() => setModal(null)} />}
    </section>
  )
}

/* Helpers */
function navBtnStyle(side) {
  return {
    position: 'absolute', [side]: 12, top: '50%', transform: 'translateY(-50%)',
    width: 34, height: 34, borderRadius: 8,
    background: 'rgba(10,22,40,0.8)', backdropFilter: 'blur(8px)',
    border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff',
    cursor: 'pointer', fontSize: 15,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }
}

function linkBtnStyle(type) {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600,
    textDecoration: 'none', cursor: 'pointer',
    ...(type === 'fill'
      ? { background: '#00d4ff', color: '#0a1628' }
      : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1' }),
  }
}
