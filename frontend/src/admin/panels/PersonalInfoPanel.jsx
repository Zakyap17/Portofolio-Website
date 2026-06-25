import { useState, useEffect } from 'react'
import { useSite } from '../../context/SiteContext'
import { getPersonal, updatePersonal } from '../../api/index.js'

export default function PersonalInfoPanel() {
  const { refresh } = useSite()
  const [form, setForm]         = useState(null)
  const [photoFile, setPhotoFile] = useState(null)     // File object baru
  const [photoPreview, setPhotoPreview] = useState(null) // URL preview
  const [removePhoto, setRemovePhoto]   = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [error, setError]       = useState('')

  useEffect(() => {
    getPersonal().then(data => {
      setForm({ ...data, photo: undefined }) // photo_url dihandle terpisah
      setPhotoPreview(data.photo || null)
    }).catch(err => setError(err.message))
  }, [])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handlePhotoFile = (files) => {
    const file = files[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
    setRemovePhoto(false)
  }

  const handleRemovePhoto = (e) => {
    e.stopPropagation()
    setPhotoFile(null)
    setPhotoPreview(null)
    setRemovePhoto(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('name',        form.name)
      fd.append('role',        form.role)
      fd.append('description', form.description)
      fd.append('yearLabel',   form.yearLabel)
      fd.append('yearsExp',    form.yearsExp)
      fd.append('linkedin',    form.linkedin  || '')
      fd.append('email',       form.email     || '')
      fd.append('github',      form.github    || '')
      fd.append('cvUrl',       form.cvUrl     || '')
      if (photoFile)    fd.append('photo', photoFile)
      if (removePhoto)  fd.append('removePhoto', 'true')

      await updatePersonal(fd)
      await refresh()
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (!form) {
    return <p style={{ color: '#475569', fontSize: 14 }}>Memuat data...</p>
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#f1f5f9' }}>Info Pribadi</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#475569' }}>Data yang ditampilkan di halaman utama</p>
      </div>

      {error && (
        <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: 20,
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
          fontSize: 13, color: '#f87171' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 640 }}>

        {/* Photo Upload */}
        <div>
          <label style={labelStyle}>FOTO PROFIL</label>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginTop: 8 }}>
            <div style={{
              width: 90, height: 112, borderRadius: 12, overflow: 'hidden', flexShrink: 0,
              border: '1px solid rgba(0,212,255,0.2)', background: 'rgba(255,255,255,0.03)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {photoPreview
                ? <img src={photoPreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: 28, opacity: 0.3 }}>👤</span>
              }
            </div>

            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handlePhotoFile(e.dataTransfer.files) }}
              onClick={() => document.getElementById('photo-input').click()}
              style={{
                flex: 1, border: `2px dashed ${dragOver ? 'rgba(0,212,255,0.6)' : 'rgba(0,212,255,0.2)'}`,
                borderRadius: 10, padding: '20px 16px',
                background: dragOver ? 'rgba(0,212,255,0.06)' : 'rgba(255,255,255,0.02)',
                textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              <input id="photo-input" type="file" accept="image/*" hidden
                onChange={e => handlePhotoFile(e.target.files)} />
              <p style={{ margin: 0, fontSize: 13, color: '#475569' }}>
                Drag & drop atau <span style={{ color: '#00d4ff' }}>klik upload</span>
              </p>
              <p style={{ margin: '4px 0 0', fontSize: 11, color: '#334155' }}>PNG, JPG, WEBP — maks 5MB</p>
              {photoPreview && (
                <button type="button" onClick={handleRemovePhoto}
                  style={{ marginTop: 8, fontSize: 11, color: '#f87171', background: 'none', border: 'none', cursor: 'pointer' }}>
                  Hapus foto
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Name + Role */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Field label="NAMA *">
            <input value={form.name} onChange={e => set('name', e.target.value)}
              required placeholder="Zaky Aprilian" style={inputStyle} />
          </Field>
          <Field label="ROLE / JABATAN *">
            <input value={form.role} onChange={e => set('role', e.target.value)}
              required placeholder="Backend Developer" style={inputStyle} />
          </Field>
        </div>

        {/* Description */}
        <Field label="DESKRIPSI *">
          <textarea value={form.description} onChange={e => set('description', e.target.value)}
            required rows={4} placeholder="Ceritakan tentang dirimu secara singkat..."
            style={{ ...inputStyle, resize: 'vertical', minHeight: 90 }} />
        </Field>

        {/* Year + Years Exp */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Field label="LABEL TAHUN" hint="Contoh: 2026">
            <input value={form.yearLabel} onChange={e => set('yearLabel', e.target.value)}
              placeholder="2026" style={inputStyle} />
          </Field>
          <Field label="PENGALAMAN" hint="Contoh: 1+">
            <input value={form.yearsExp} onChange={e => set('yearsExp', e.target.value)}
              placeholder="1+" style={inputStyle} />
          </Field>
        </div>

        {/* LinkedIn + Email */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Field label="LINKEDIN">
            <input value={form.linkedin} onChange={e => set('linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/..." style={inputStyle} />
          </Field>
          <Field label="EMAIL">
            <input value={form.email} onChange={e => set('email', e.target.value)}
              placeholder="email@example.com" style={inputStyle} />
          </Field>
        </div>

        {/* GitHub + CV URL */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Field label="GITHUB">
            <input value={form.github} onChange={e => set('github', e.target.value)}
              placeholder="https://github.com/..." style={inputStyle} />
          </Field>
          <Field label="LINK CV" hint="Path atau URL">
            <input value={form.cvUrl} onChange={e => set('cvUrl', e.target.value)}
              placeholder="/cv/nama.pdf" style={inputStyle} />
          </Field>
        </div>

        {/* Save */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingTop: 4 }}>
          <button type="submit" disabled={saving} style={{
            padding: '11px 32px', borderRadius: 9, border: 'none',
            background: saving ? 'rgba(0,212,255,0.4)' : '#00d4ff',
            color: '#0a1628', fontSize: 13, fontWeight: 700,
            cursor: saving ? 'not-allowed' : 'pointer', transition: 'opacity 0.2s',
          }}
            onMouseEnter={e => !saving && (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
          {saved && <span style={{ fontSize: 13, color: '#22c55e', fontWeight: 500 }}>✓ Tersimpan!</span>}
        </div>
      </form>
    </div>
  )
}

function Field({ label, hint, children }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <label style={labelStyle}>{label}</label>
        {hint && <span style={{ fontSize: 11, color: '#334155' }}>{hint}</span>}
      </div>
      {children}
    </div>
  )
}

const labelStyle = { display: 'block', fontSize: 11, fontWeight: 600, color: '#475569', letterSpacing: '0.8px' }
const inputStyle = {
  width: '100%', padding: '10px 13px', borderRadius: 9,
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
  color: '#f1f5f9', fontSize: 13, outline: 'none',
  transition: 'border-color 0.2s', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif',
}
