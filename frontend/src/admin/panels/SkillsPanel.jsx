import { useState, useEffect } from 'react'
import { useSite } from '../../context/SiteContext'
import { updateSkills } from '../../api/index.js'

const emptySkill = { label: '', color: '#00d4ff', side: 'right' }

export default function SkillsPanel() {
  const { data, refresh } = useSite()
  const [skills, setSkills] = useState(data.skills)

  useEffect(() => {
    setSkills(data.skills)
  }, [data.skills])
  const [form, setForm]     = useState(emptySkill)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)
  const [error, setError]   = useState('')

  const commitSkills = async (next) => {
    setSaving(true)
    setError('')
    try {
      const saved = await updateSkills(next)
      setSkills(saved)
      await refresh()
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.label.trim()) return
    if (editId !== null) {
      commitSkills(skills.map(s => s.id === editId ? { ...form, id: editId } : s))
      setEditId(null)
    } else {
      commitSkills([...skills, { ...form, id: Date.now() }])
    }
    setForm(emptySkill)
  }

  const handleEdit = (skill) => {
    setForm({ label: skill.label, color: skill.color, side: skill.side })
    setEditId(skill.id)
  }

  const handleDelete = (id) => {
    commitSkills(skills.filter(s => s.id !== id))
    if (editId === id) { setEditId(null); setForm(emptySkill) }
  }

  const leftSkills  = skills.filter(s => s.side === 'left')
  const rightSkills = skills.filter(s => s.side === 'right')

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#f1f5f9' }}>Skills</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#475569' }}>
          Badge yang muncul mengambang di foto — maks 3 per sisi (kiri/kanan)
        </p>
      </div>

      {error && (
        <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: 20,
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
          fontSize: 13, color: '#f87171' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, maxWidth: 860 }}>

        {/* Skill list */}
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#334155', letterSpacing: '1px', margin: '0 0 16px' }}>
            DAFTAR SKILL ({skills.length})
          </p>
          {skills.length === 0 && <p style={{ fontSize: 13, color: '#334155' }}>Belum ada skill.</p>}

          {leftSkills.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 11, color: '#475569', margin: '0 0 8px' }}>KIRI FOTO</p>
              {leftSkills.map(s => (
                <SkillRow key={s.id} skill={s} onEdit={handleEdit} onDelete={handleDelete} disabled={saving} />
              ))}
            </div>
          )}

          {rightSkills.length > 0 && (
            <div>
              <p style={{ fontSize: 11, color: '#475569', margin: '0 0 8px' }}>KANAN FOTO</p>
              {rightSkills.map(s => (
                <SkillRow key={s.id} skill={s} onEdit={handleEdit} onDelete={handleDelete} disabled={saving} />
              ))}
            </div>
          )}

          {saved && <p style={{ fontSize: 13, color: '#22c55e', margin: '16px 0 0' }}>✓ Tersimpan!</p>}
        </div>

        {/* Add/Edit form */}
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#334155', letterSpacing: '1px', margin: '0 0 16px' }}>
            {editId !== null ? 'EDIT SKILL' : 'TAMBAH SKILL'}
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={labelStyle}>NAMA SKILL *</label>
              <input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                required placeholder="Contoh: Laravel" style={{ ...inputStyle, marginTop: 6 }} />
            </div>

            <div>
              <label style={labelStyle}>WARNA</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                <input type="color" value={form.color}
                  onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                  style={{
                    width: 40, height: 36, padding: 2, borderRadius: 6,
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.05)', cursor: 'pointer',
                  }} />
                <input value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                  placeholder="#00d4ff" style={{ ...inputStyle, flex: 1 }} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>POSISI</label>
              <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                {['left', 'right'].map(side => (
                  <button key={side} type="button"
                    onClick={() => setForm(f => ({ ...f, side }))}
                    style={{
                      flex: 1, padding: '9px', borderRadius: 8, border: 'none',
                      fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                      background: form.side === side ? '#00d4ff' : 'rgba(255,255,255,0.05)',
                      color: form.side === side ? '#0a1628' : '#64748b',
                    }}>
                    {side === 'left' ? 'Kiri' : 'Kanan'}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ fontSize: 11, color: '#334155', margin: '0 0 10px', letterSpacing: '0.8px' }}>PREVIEW</p>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '6px 12px', borderRadius: 8,
                background: 'rgba(8,18,35,0.88)', border: '1px solid rgba(255,255,255,0.1)',
                fontSize: 12, fontWeight: 500, color: '#cbd5e1',
              }}>
                <span style={{
                  width: 18, height: 18, borderRadius: 4, background: form.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, fontWeight: 800, color: '#fff',
                }}>{form.label[0] || '?'}</span>
                {form.label || 'Skill Name'}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" disabled={saving} style={{
                flex: 1, padding: '10px', borderRadius: 8, border: 'none',
                background: saving ? 'rgba(0,212,255,0.4)' : '#00d4ff',
                color: '#0a1628', fontSize: 13, fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer',
              }}>
                {saving ? '...' : (editId !== null ? 'Simpan' : 'Tambah')}
              </button>
              {editId !== null && (
                <button type="button" onClick={() => { setEditId(null); setForm(emptySkill) }} style={{
                  padding: '10px 16px', borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'transparent', color: '#64748b', fontSize: 13, cursor: 'pointer',
                }}>Batal</button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function SkillRow({ skill, onEdit, onDelete, disabled }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '9px 12px', borderRadius: 10, marginBottom: 6,
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
    }}>
      <span style={{
        width: 20, height: 20, borderRadius: 4, background: skill.color, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 10, fontWeight: 800, color: '#fff',
      }}>{skill.label[0]}</span>
      <span style={{ flex: 1, fontSize: 13, color: '#cbd5e1', fontWeight: 500 }}>{skill.label}</span>
      <button onClick={() => onEdit(skill)} disabled={disabled} style={rowBtnStyle('#00d4ff', disabled)}>Edit</button>
      <button onClick={() => onDelete(skill.id)} disabled={disabled} style={rowBtnStyle('#f87171', disabled)}>Hapus</button>
    </div>
  )
}

const rowBtnStyle = (color, disabled) => ({
  padding: '4px 12px', borderRadius: 6, border: `1px solid ${color}40`,
  background: 'transparent', color: disabled ? '#334155' : color,
  fontSize: 11, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
})

const labelStyle = { display: 'block', fontSize: 11, fontWeight: 600, color: '#475569', letterSpacing: '0.8px' }
const inputStyle = {
  width: '100%', padding: '10px 13px', borderRadius: 9,
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
  color: '#f1f5f9', fontSize: 13, outline: 'none',
  transition: 'border-color 0.2s', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif',
}
