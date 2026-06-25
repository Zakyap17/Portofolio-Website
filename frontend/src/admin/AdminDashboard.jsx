import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PersonalInfoPanel from './panels/PersonalInfoPanel'
import SkillsPanel from './panels/SkillsPanel'
import ProjectsPanel from './panels/ProjectsPanel'

const sidebarItems = [
  {
    id: 'personal',
    label: 'Info Pribadi',
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      </svg>
    ),
  },
  {
    id: 'skills',
    label: 'Skills',
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/>
        <rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/>
      </svg>
    ),
  },
]

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [activePanel, setActivePanel] = useState('projects')

  useEffect(() => {
    if (!localStorage.getItem('admin_token')) navigate('/admin')
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    navigate('/admin')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', color: '#e2e8f0', display: 'flex', flexDirection: 'column' }}>

      {/* Topbar */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        borderBottom: '1px solid rgba(0,212,255,0.1)',
        padding: '0 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 60, position: 'sticky', top: 0, zIndex: 50,
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 20, fontWeight: 900, color: '#00d4ff' }}>ZA.</span>
          <span style={{ fontSize: 13, color: '#334155' }}>Admin Panel</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a href="/" style={{
            padding: '7px 16px', borderRadius: 8, fontSize: 13,
            border: '1px solid rgba(255,255,255,0.1)', color: '#64748b',
            textDecoration: 'none', transition: 'color 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.color = '#cbd5e1'}
            onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
          >
            Lihat Portfolio
          </a>
          <button onClick={handleLogout} style={{
            padding: '7px 16px', borderRadius: 8, fontSize: 13,
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
            color: '#f87171', cursor: 'pointer', transition: 'background 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>

        {/* Sidebar */}
        <aside style={{
          width: 220, flexShrink: 0,
          borderRight: '1px solid rgba(255,255,255,0.06)',
          padding: '28px 14px',
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#1e293b', letterSpacing: '1.2px', margin: '0 0 12px 8px' }}>
            KONTEN
          </p>
          {sidebarItems.map(item => {
            const isActive = activePanel === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActivePanel(item.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 10, border: 'none',
                  background: isActive ? 'rgba(0,212,255,0.12)' : 'transparent',
                  color: isActive ? '#00d4ff' : '#64748b',
                  fontSize: 13, fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer', textAlign: 'left', width: '100%',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                    e.currentTarget.style.color = '#cbd5e1'
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = '#64748b'
                  }
                }}
              >
                {item.icon}
                {item.label}
                {isActive && (
                  <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#00d4ff' }}/>
                )}
              </button>
            )
          })}
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '40px 44px' }}>
          {activePanel === 'personal'  && <PersonalInfoPanel />}
          {activePanel === 'skills'    && <SkillsPanel />}
          {activePanel === 'projects'  && <ProjectsPanel />}
        </main>
      </div>
    </div>
  )
}
