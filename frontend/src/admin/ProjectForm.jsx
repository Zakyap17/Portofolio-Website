import { useState, useEffect, useRef } from 'react'

/*
  Props:
  - initial: project object (edit mode) atau null (create mode)
  - onSave(formState):
      { title, description, year, company, tech, github, demo,
        existingImages: string[],  // URL yang dipertahankan
        newFiles: File[] }         // File baru yang diupload
  - onClose()
*/
export default function ProjectForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState({
    title: '', description: '',
    year: new Date().getFullYear().toString(),
    company: '', github: '', demo: '', tech: '',
  })
  const [existingImages, setExistingImages] = useState([]) // URL yang ada (edit mode)
  const [newFiles, setNewFiles]             = useState([]) // File objects baru
  const [newPreviews, setNewPreviews]       = useState([]) // ObjectURL preview
  const [dragOver, setDragOver]             = useState(false)
  const previewsRef = useRef([])

  useEffect(() => {
    if (initial) {
      setForm({
        title:       initial.title || '',
        description: initial.description || '',
        year:        initial.year  || new Date().getFullYear().toString(),
        company:     initial.company || '',
        github:      initial.github  || '',
        demo:        initial.demo    || '',
        tech:        Array.isArray(initial.tech) ? initial.tech.join(', ') : (initial.tech || ''),
      })
      setExistingImages(initial.images || [])
    }
    return () => {
      previewsRef.current.forEach(url => URL.revokeObjectURL(url))
    }
  }, [initial])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleFiles = (files) => {
    const arr = Array.from(files)
    const urls = arr.map(f => URL.createObjectURL(f))
    previewsRef.current = [...previewsRef.current, ...urls]
    setNewFiles(f => [...f, ...arr])
    setNewPreviews(p => [...p, ...urls])
  }

  const removeExisting = (idx) => {
    setExistingImages(imgs => imgs.filter((_, i) => i !== idx))
  }

  const removeNew = (idx) => {
    URL.revokeObjectURL(newPreviews[idx])
    previewsRef.current = previewsRef.current.filter(u => u !== newPreviews[idx])
    setNewFiles(f => f.filter((_, i) => i !== idx))
    setNewPreviews(p => p.filter((_, i) => i !== idx))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      title:       form.title,
      description: form.description,
      year:        form.year,
      company:     form.company,
      tech:        form.tech.split(',').map(t => t.trim()).filter(Boolean),
      github:      form.github || null,
      demo:        form.demo   || null,
      existingImages,
      newFiles,
    })
  }

  const totalImages = existingImages.length + newFiles.length

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(5,10,20,0.88)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24, overflowY: 'auto',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 600,
          background: '#0f1e35', border: '1px solid rgba(0,212,255,0.2)',
          borderRadius: 20, overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9' }}>
            {initial ? 'Edit Project' : 'Tambah Project Baru'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 20 }}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Foto Upload */}
          <div>
            <label style={labelStyle}>FOTO PROJECT</label>
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
              onClick={() => document.getElementById('img-input').click()}
              style={{
                border: `2px dashed ${dragOver ? 'rgba(0,212,255,0.6)' : 'rgba(0,212,255,0.2)'}`,
                borderRadius: 12, padding: '20px',
                background: dragOver ? 'rgba(0,212,255,0.06)' : 'rgba(255,255,255,0.02)',
                textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              <input id="img-input" type="file" accept="image/*" multiple hidden
                onChange={e => handleFiles(e.target.files)} />
              <p style={{ margin: 0, fontSize: 13, color: '#475569' }}>
                Drag & drop foto atau <span style={{ color: '#00d4ff', fontWeight: 600 }}>klik untuk upload</span>
              </p>
              <p style={{ margin: '4px 0 0', fontSize: 11, color: '#334155' }}>PNG, JPG, WEBP — bisa lebih dari 1 foto</p>
            </div>

            {/* Preview grid */}
            {totalImages > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                {/* Existing (sudah tersimpan di server) */}
                {existingImages.map((url, i) => (
                  <div key={`ex-${i}`} style={{ position: 'relative' }}>
                    <img src={url} style={{ width: 72, height: 52, objectFit: 'cover', borderRadius: 6, border: '1px solid rgba(0,212,255,0.2)' }} />
                    <button type="button" onClick={() => removeExisting(i)} style={removeImgBtnStyle}>✕</button>
                  </div>
                ))}
                {/* New files */}
                {newPreviews.map((url, i) => (
                  <div key={`new-${i}`} style={{ position: 'relative' }}>
                    <img src={url} style={{ width: 72, height: 52, objectFit: 'cover', borderRadius: 6, border: '1px solid rgba(0,212,255,0.2)', opacity: 0.85 }} />
                    <div style={{ position: 'absolute', top: -4, left: -4, width: 12, height: 12, borderRadius: '50%', background: '#22c55e', border: '2px solid #0f1e35' }}/>
                    <button type="button" onClick={() => removeNew(i)} style={removeImgBtnStyle}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Title */}
          <Field label="NAMA PROJECT *">
            <input value={form.title} onChange={e => set('title', e.target.value)}
              placeholder="Contoh: Warehouse Management System" required style={inputStyle} />
          </Field>

          {/* Description */}
          <Field label="DESKRIPSI *">
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="Jelaskan project kamu secara singkat..." required rows={3}
              style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }} />
          </Field>

          {/* Year + Company */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
            <Field label="TAHUN">
              <input value={form.year} onChange={e => set('year', e.target.value)}
                placeholder="2026" style={inputStyle} />
            </Field>
            <Field label="PERUSAHAAN / INSTANSI">
              <input value={form.company} onChange={e => set('company', e.target.value)}
                placeholder="PT Contoh Indonesia (opsional)" style={inputStyle} />
            </Field>
          </div>

          {/* Tech Stack */}
          <Field label="TECH STACK" hint="Pisahkan dengan koma">
            <input value={form.tech} onChange={e => set('tech', e.target.value)}
              placeholder="Laravel, PostgreSQL, Linux" style={inputStyle} />
          </Field>

          {/* Links */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="LINK GITHUB">
              <input value={form.github} onChange={e => set('github', e.target.value)}
                placeholder="https://github.com/..." style={inputStyle} />
            </Field>
            <Field label="LINK DEMO">
              <input value={form.demo} onChange={e => set('demo', e.target.value)}
                placeholder="https://..." style={inputStyle} />
            </Field>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 4 }}>
            <button type="button" onClick={onClose} style={{
              padding: '10px 22px', borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'transparent', color: '#64748b', fontSize: 13, cursor: 'pointer',
            }}>Batal</button>
            <button type="submit" style={{
              padding: '10px 28px', borderRadius: 8, border: 'none',
              background: '#00d4ff', color: '#0a1628',
              fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'opacity 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              {initial ? 'Simpan Perubahan' : 'Tambah Project'}
            </button>
          </div>
        </form>
      </div>
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

const labelStyle = {
  display: 'block', fontSize: 11, fontWeight: 600,
  color: '#475569', letterSpacing: '0.8px',
}
const inputStyle = {
  width: '100%', padding: '10px 13px', borderRadius: 9,
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.08)',
  color: '#f1f5f9', fontSize: 13, outline: 'none',
  transition: 'border-color 0.2s', boxSizing: 'border-box',
  fontFamily: 'Inter, sans-serif',
}
const removeImgBtnStyle = {
  position: 'absolute', top: -6, right: -6,
  width: 18, height: 18, borderRadius: '50%',
  background: '#ef4444', border: 'none', color: '#fff',
  fontSize: 10, cursor: 'pointer', lineHeight: 1,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}
