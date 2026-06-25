import { Router } from 'express'
import { pool } from '../config/db.js'

const router = Router()

/* GET /api/site — semua data publik untuk landing page */
router.get('/', async (req, res) => {
  try {
    const [personalRes, skillsRes, projectsRes] = await Promise.all([
      pool.query('SELECT * FROM personal_info LIMIT 1'),
      pool.query('SELECT id, label, color, side FROM skills ORDER BY side, sort_order'),
      pool.query(`
        SELECT
          p.id, p.title, p.description, p.year, p.company,
          p.tech, p.github, p.demo,
          COALESCE(
            json_agg(pi.url ORDER BY pi.sort_order)
            FILTER (WHERE pi.url IS NOT NULL),
            '[]'
          ) AS images
        FROM projects p
        LEFT JOIN project_images pi ON pi.project_id = p.id
        GROUP BY p.id
        ORDER BY p.sort_order, p.created_at
      `),
    ])

    const p = personalRes.rows[0] || {}

    res.json({
      personal: {
        name:        p.name        || '',
        role:        p.role        || '',
        description: p.description || '',
        yearLabel:   p.year_label  || '',
        yearsExp:    p.years_exp   || '',
        linkedin:    p.linkedin    || '',
        email:       p.email       || '',
        github:      p.github      || '',
        cvUrl:       p.cv_url      || '',
        photo:       p.photo_url   || null,
      },
      skills: skillsRes.rows,
      projects: projectsRes.rows.map(pr => ({
        id:          pr.id,
        title:       pr.title,
        description: pr.description,
        year:        pr.year,
        company:     pr.company,
        tech:        pr.tech,
        github:      pr.github,
        demo:        pr.demo,
        images:      pr.images,
      })),
    })
  } catch (err) {
    console.error('[site/]', err)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
