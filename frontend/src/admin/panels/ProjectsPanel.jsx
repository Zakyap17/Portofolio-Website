import { useState } from 'react'
import { useSite } from '../../context/SiteContext'
import { createProject, editProject, deleteProject } from '../../api/index.js'
import ProjectForm from '../ProjectForm'

export default function ProjectsPanel() {
  const { data, refresh } = useSite()
  const projects = data.projects
  const [showForm, setShowForm]       = useState(false)
  const [editTarget, setEditTarget]   = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [saving, setSaving]           = useState(false)
  const [error, setError]             = useState('')

  const buildFormData = ({ title, description, year, company, tech, github, demo, existingImages, newFiles }) => {
    const fd = new FormData()
    fd.append('title',       title)
    fd.append('description', description || '')
    fd.append('year',        year  || '')
    fd.append('company',     company || '')
    fd.append('tech',        JSON.stringify(tech))
    fd.append('github',      github || '')
    fd.append('demo',        demo   || '')
    fd.append('keepImages',  JSON.stringify(existingImages || []))
    for (const file of (newFiles || [])) fd.append('images', file)
    return fd
  }

  const handleSave = async (formState) => {
    setSaving(true)
    setError('')
    try {
      if (editTarget) {
        await editProject(editTarget.id, buildFormData(formState))
      } else {
        await createProject(buildFormData(formState))
      }
      await refresh()
      setShowForm(false)
      setEditTarget(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    setSaving(true)
    setError('')
    try {
      await deleteProject(id)
      await refresh()
      setDeleteConfirm(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const openEdit = (project) => {
    setEditTarget(project)
    setShowForm(true)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#f1f5f9' }}>Projects</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#475569' }}>{projects.length} project tersimpan</p>
        </div>
        <button
          onClick={() => { setEditTarget(null); setShowForm(true) }}
          disabled={saving}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', borderRadius: 10, border: 'none',
            background: '#00d4ff', color: '#0a1628',
            fontSize: 13, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.5 : 1, transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => !saving && (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => e.currentTarget.style.opacity = saving ? '0.5' : '1'}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
          Tambah Project
        </button>
      </div>

      {error && (
        <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: 16,
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
          fontSize: 13, color: '#f87171' }}>
          {error}
        </div>
      )}

      {/* Project List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {projects.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '60px 24px',
            border: '1px dashed rgba(0,212,255,0.2)', borderRadius: 16,
            color: '#334155', fontSize: 14,
          }}>
            Belum ada project. Klik "Tambah Project" untuk mulai.
          </div>
        )}

        {projects.map(p => (
          <div key={p.id} style={{
            display: 'flex', alignItems: 'center', gap: 16,
            padding: '16px 20px', borderRadius: 14,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            transition: 'border-color 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,212,255,0.2)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
          >
            {/* Thumbnail */}
            <div style={{
              width: 72, height: 52, borderRadius: 8, flexShrink: 0,
              background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
            }}>
              {p.images?.[0]
                ? <img src={p.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="3" stroke="#00d4ff" strokeWidth="1.5" strokeOpacity="0.4"/>
                    <path d="M3 15l4-4 4 4 4-4 4 4" stroke="#00d4ff" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round"/>
                  </svg>
              }
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {p.title}
                </p>
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: 'rgba(0,212,255,0.1)', color: '#00d4ff', flexShrink: 0 }}>
                  {p.year}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                {p.tech?.slice(0, 4).map(t => (
                  <span key={t} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.05)', color: '#64748b' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button onClick={() => openEdit(p)} disabled={saving} style={{
                padding: '7px 16px', borderRadius: 8, border: '1px solid rgba(0,212,255,0.25)',
                background: 'transparent', color: saving ? '#334155' : '#00d4ff', fontSize: 12, fontWeight: 600,
                cursor: saving ? 'not-allowed' : 'pointer', transition: 'background 0.2s',
              }}
                onMouseEnter={e => !saving && (e.currentTarget.style.background = 'rgba(0,212,255,0.1)')}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >Edit</button>
              <button onClick={() => setDeleteConfirm(p.id)} disabled={saving} style={{
                padding: '7px 16px', borderRadius: 8, border: '1px solid rgba(239,68,68,0.25)',
                background: 'transparent', color: saving ? '#334155' : '#f87171', fontSize: 12, fontWeight: 600,
                cursor: saving ? 'not-allowed' : 'pointer', transition: 'background 0.2s',
              }}
                onMouseEnter={e => !saving && (e.currentTarget.style.background = 'rgba(239,68,68,0.1)')}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >Hapus</button>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <ProjectForm
          initial={editTarget}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditTarget(null) }}
        />
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div onClick={() => setDeleteConfirm(null)} style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(5,10,20,0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#0f1e35', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 16, padding: '32px', maxWidth: 360, width: '100%', textAlign: 'center',
          }}>
            <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9', margin: '0 0 8px' }}>Hapus Project?</p>
            <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 24px' }}>Tindakan ini tidak bisa dibatalkan.</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button onClick={() => setDeleteConfirm(null)} disabled={saving} style={{
                padding: '9px 24px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)',
                background: 'transparent', color: '#64748b', cursor: 'pointer', fontSize: 13,
              }}>Batal</button>
              <button onClick={() => handleDelete(deleteConfirm)} disabled={saving} style={{
                padding: '9px 24px', borderRadius: 8, border: 'none',
                background: saving ? '#7f1d1d' : '#ef4444', color: '#fff',
                cursor: saving ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 700,
              }}>
                {saving ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
