import { Router } from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { pool } from '../config/db.js'
import { requireAuth } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadsDir = path.join(__dirname, '../../uploads')

const router = Router()
router.use(requireAuth)

/* ════════════════ PERSONAL INFO ════════════════ */

router.get('/personal', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM personal_info LIMIT 1')
    const p = rows[0] || {}
    res.json({
      name:      p.name        || '',
      role:      p.role        || '',
      description: p.description || '',
      yearLabel: p.year_label  || '',
      yearsExp:  p.years_exp   || '',
      linkedin:  p.linkedin    || '',
      email:     p.email       || '',
      github:    p.github      || '',
      cvUrl:     p.cv_url      || '',
      photo:     p.photo_url   || null,
    })
  } catch (err) {
    console.error('[admin/personal GET]', err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.put('/personal', upload.single('photo'), async (req, res) => {
  try {
    const { name, role, description, yearLabel, yearsExp, linkedin, email, github, cvUrl } = req.body

    const { rows } = await pool.query('SELECT id, photo_url FROM personal_info LIMIT 1')
    const existing = rows[0]

    // Tentukan photo_url baru
    let photoUrl = existing?.photo_url || null
    if (req.file) {
      // File baru diupload — hapus lama kalau ada
      if (existing?.photo_url) {
        const oldFile = path.join(uploadsDir, path.basename(existing.photo_url))
        fs.unlink(oldFile, () => {})
      }
      photoUrl = `/uploads/${req.file.filename}`
    } else if (req.body.removePhoto === 'true') {
      if (existing?.photo_url) {
        const oldFile = path.join(uploadsDir, path.basename(existing.photo_url))
        fs.unlink(oldFile, () => {})
      }
      photoUrl = null
    }

    if (!existing) {
      await pool.query(`
        INSERT INTO personal_info
          (name, role, description, year_label, years_exp, linkedin, email, github, cv_url, photo_url)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      `, [name, role, description, yearLabel, yearsExp, linkedin, email, github, cvUrl, photoUrl])
    } else {
      await pool.query(`
        UPDATE personal_info
        SET name=$1, role=$2, description=$3, year_label=$4, years_exp=$5,
            linkedin=$6, email=$7, github=$8, cv_url=$9, photo_url=$10, updated_at=NOW()
        WHERE id=$11
      `, [name, role, description, yearLabel, yearsExp, linkedin, email, github, cvUrl, photoUrl, existing.id])
    }

    res.json({ ok: true, photoUrl })
  } catch (err) {
    console.error('[admin/personal PUT]', err)
    res.status(500).json({ message: 'Server error' })
  }
})

/* ════════════════ SKILLS ════════════════ */

router.put('/skills', async (req, res) => {
  try {
    const { skills } = req.body // [{ label, color, side }]

    await pool.query('DELETE FROM skills')

    if (skills?.length > 0) {
      const values = skills.map((_, i) => `($${i*4+1},$${i*4+2},$${i*4+3},$${i*4+4})`).join(',')
      const params = skills.flatMap((s, i) => [s.label, s.color, s.side, i + 1])
      await pool.query(
        `INSERT INTO skills (label, color, side, sort_order) VALUES ${values}`,
        params
      )
    }

    const { rows } = await pool.query(
      'SELECT id, label, color, side FROM skills ORDER BY side, sort_order'
    )
    res.json(rows)
  } catch (err) {
    console.error('[admin/skills PUT]', err)
    res.status(500).json({ message: 'Server error' })
  }
})

/* ════════════════ PROJECTS ════════════════ */

router.post('/projects', upload.array('images', 10), async (req, res) => {
  try {
    const { title, description, year, company, github, demo } = req.body
    const tech = req.body.tech ? JSON.parse(req.body.tech) : []

    const { rows: maxRows } = await pool.query('SELECT COALESCE(MAX(sort_order),0) AS max FROM projects')
    const sortOrder = Number(maxRows[0].max) + 1

    const { rows } = await pool.query(`
      INSERT INTO projects (title, description, year, company, tech, github, demo, sort_order)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING id
    `, [
      title,
      description || '',
      year || '',
      company || '',
      tech,
      github || null,
      demo || null,
      sortOrder,
    ])

    const projectId = rows[0].id

    if (req.files?.length > 0) {
      const imgVals = req.files
        .map((f, i) => `(${projectId}, '/uploads/${f.filename}', ${i})`)
        .join(',')
      await pool.query(
        `INSERT INTO project_images (project_id, url, sort_order) VALUES ${imgVals}`
      )
    }

    res.status(201).json({ id: projectId })
  } catch (err) {
    console.error('[admin/projects POST]', err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.put('/projects/:id', upload.array('images', 10), async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const { title, description, year, company, github, demo } = req.body
    const tech       = req.body.tech       ? JSON.parse(req.body.tech)       : []
    const keepImages = req.body.keepImages ? JSON.parse(req.body.keepImages) : []

    await pool.query(`
      UPDATE projects
      SET title=$1, description=$2, year=$3, company=$4, tech=$5, github=$6, demo=$7
      WHERE id=$8
    `, [
      title,
      description || '',
      year || '',
      company || '',
      tech,
      github || null,
      demo || null,
      id,
    ])

    // Hapus gambar yang tidak ada di keepImages
    const { rows: existingImgs } = await pool.query(
      'SELECT id, url FROM project_images WHERE project_id=$1',
      [id]
    )
    for (const img of existingImgs) {
      if (!keepImages.includes(img.url)) {
        await pool.query('DELETE FROM project_images WHERE id=$1', [img.id])
        const filePath = path.join(uploadsDir, path.basename(img.url))
        fs.unlink(filePath, () => {})
      }
    }

    // Tambah gambar baru
    if (req.files?.length > 0) {
      const { rows: maxRows } = await pool.query(
        'SELECT COALESCE(MAX(sort_order),-1) AS max FROM project_images WHERE project_id=$1',
        [id]
      )
      let order = Number(maxRows[0].max) + 1
      for (const f of req.files) {
        await pool.query(
          'INSERT INTO project_images (project_id, url, sort_order) VALUES ($1,$2,$3)',
          [id, `/uploads/${f.filename}`, order++]
        )
      }
    }

    res.json({ ok: true })
  } catch (err) {
    console.error('[admin/projects PUT]', err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.delete('/projects/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)

    // Hapus file gambar dulu
    const { rows: imgs } = await pool.query(
      'SELECT url FROM project_images WHERE project_id=$1',
      [id]
    )
    for (const img of imgs) {
      const filePath = path.join(uploadsDir, path.basename(img.url))
      fs.unlink(filePath, () => {})
    }

    await pool.query('DELETE FROM projects WHERE id=$1', [id])
    res.json({ ok: true })
  } catch (err) {
    console.error('[admin/projects DELETE]', err)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
