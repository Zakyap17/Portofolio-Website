import { useState, useEffect } from 'react'
import { useSite } from '../context/SiteContext'

const navLinks = [
  { label: 'Home',     href: '#home'     },
  { label: 'About',    href: '#about'    },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact',  href: '#contact'  },
]

export default function Navbar({ onNavigate }) {
  const { data } = useSite()
  const { personal } = data
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive]     = useState('home')
  const [scrolled, setScrolled] = useState(false)

  // Detect scroll untuk shadow effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Active section detection
  useEffect(() => {
    const sections = ['home', 'projects', 'contact']
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) })
      },
      { threshold: 0.4 }
    )
    sections.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const handleClick = (e, href) => {
    if (onNavigate) { onNavigate(e, href); setMenuOpen(false) }
  }

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: scrolled
        ? 'rgba(13, 17, 23, 0.95)'
        : 'rgba(13, 17, 23, 0.75)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.4)' : 'none',
      transition: 'background 0.3s ease, box-shadow 0.3s ease',
    }}>
      {/* Gradient border bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.4) 50%, transparent 100%)',
      }}/>

      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: '0 clamp(20px, 5vw, 48px)',
        height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>

        {/* Logo */}
        <a
          href="#home"
          onClick={e => handleClick(e, '#home')}
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 2 }}
        >
          <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#e2e8f0', letterSpacing: '-1px' }}>ZA</span>
          <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#00d4ff' }}>.</span>
        </a>

        {/* Desktop Nav */}
        <ul style={{
          display: 'flex', alignItems: 'center', gap: 4,
          listStyle: 'none', margin: 0, padding: 0,
        }}
          className="hidden-mobile"
        >
          {navLinks.map(link => {
            const id = link.href.replace('#', '')
            const isActive = active === id
            return (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={e => handleClick(e, link.href)}
                  style={{
                    display: 'block',
                    padding: '6px 16px', borderRadius: 8,
                    fontSize: 13.5, fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#00d4ff' : '#94a3b8',
                    textDecoration: 'none',
                    background: isActive ? 'rgba(0,212,255,0.08)' : 'transparent',
                    transition: 'color 0.2s, background 0.2s',
                    position: 'relative',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#cbd5e1'
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#94a3b8'
                      e.currentTarget.style.background = 'transparent'
                    }
                  }}
                >
                  {link.label}
                  {/* Active dot */}
                  {isActive && (
                    <span style={{
                      position: 'absolute', bottom: -2, left: '50%',
                      transform: 'translateX(-50%)',
                      width: 4, height: 4, borderRadius: '50%',
                      background: '#00d4ff',
                    }}/>
                  )}
                </a>
              </li>
            )
          })}
        </ul>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* Social icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginRight: 8 }}
            className="hidden-mobile"
          >
            {[
              personal.linkedin && {
                href: personal.linkedin,
                title: 'LinkedIn',
                icon: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              },
              personal.email && {
                href: `mailto:${personal.email}`,
                title: 'Email',
                icon: <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>
              },
            ].filter(Boolean).map(s => (
              <a
                key={s.title}
                href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                title={s.title}
                style={{
                  width: 34, height: 34, borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#475569', transition: 'color 0.2s, background 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#00d4ff'
                  e.currentTarget.style.background = 'rgba(0,212,255,0.08)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = '#475569'
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">{s.icon}</svg>
              </a>
            ))}
          </div>


          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'none', flexDirection: 'column', gap: 5,
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 6, borderRadius: 8,
            }}
            className="show-mobile"
          >
            {[0,1,2].map(i => (
              <span key={i} style={{
                display: 'block', width: 22, height: 2,
                background: '#64748b', borderRadius: 2,
                transition: 'all 0.3s',
                transform: menuOpen && i === 0 ? 'rotate(45deg) translate(5px,5px)'
                         : menuOpen && i === 2 ? 'rotate(-45deg) translate(5px,-5px)'
                         : 'none',
                opacity: menuOpen && i === 1 ? 0 : 1,
              }}/>
            ))}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '12px 24px 16px',
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              onClick={e => handleClick(e, link.href)}
              style={{
                padding: '10px 12px', borderRadius: 8,
                fontSize: 14, color: '#94a3b8', textDecoration: 'none',
                transition: 'color 0.2s',
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
          .hidden-mobile { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}
