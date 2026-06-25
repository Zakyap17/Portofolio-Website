import bcrypt from 'bcryptjs'
import { pool } from '../config/db.js'

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS personal_info (
      id          SERIAL PRIMARY KEY,
      name        VARCHAR(100)  NOT NULL DEFAULT 'Zaky Aprilian',
      role        VARCHAR(100)  NOT NULL DEFAULT 'Backend Developer',
      description TEXT          NOT NULL DEFAULT '',
      year_label  VARCHAR(20)   NOT NULL DEFAULT '2026',
      years_exp   VARCHAR(20)   NOT NULL DEFAULT '1+',
      linkedin    TEXT          NOT NULL DEFAULT '',
      email       VARCHAR(100)  NOT NULL DEFAULT '',
      github      TEXT          NOT NULL DEFAULT '',
      cv_url      TEXT          NOT NULL DEFAULT '',
      photo_url   TEXT,
      updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS skills (
      id         SERIAL  PRIMARY KEY,
      label      VARCHAR(50)  NOT NULL,
      color      VARCHAR(20)  NOT NULL DEFAULT '#00d4ff',
      side       VARCHAR(10)  NOT NULL DEFAULT 'right' CHECK (side IN ('left','right')),
      sort_order INTEGER      NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS projects (
      id          SERIAL  PRIMARY KEY,
      title       VARCHAR(200) NOT NULL,
      description TEXT         NOT NULL DEFAULT '',
      year        VARCHAR(10)  NOT NULL DEFAULT '',
      company     VARCHAR(200) NOT NULL DEFAULT '',
      tech        TEXT[]       NOT NULL DEFAULT '{}',
      github      TEXT,
      demo        TEXT,
      sort_order  INTEGER      NOT NULL DEFAULT 0,
      created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS project_images (
      id         SERIAL  PRIMARY KEY,
      project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      url        TEXT    NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id            SERIAL      PRIMARY KEY,
      username      VARCHAR(50) UNIQUE NOT NULL,
      password_hash TEXT        NOT NULL
    );
  `)

  // Seed: personal_info (row tunggal)
  const { rowCount: pCount } = await pool.query('SELECT 1 FROM personal_info LIMIT 1')
  if (pCount === 0) {
    await pool.query(`
      INSERT INTO personal_info
        (name, role, description, year_label, years_exp, linkedin, email, github, cv_url)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    `, [
      'Zaky Aprilian',
      'Backend Developer',
      'Information Systems student at Telkom University with experience developing and deploying internal web applications in enterprise environments. Skilled in backend development, PostgreSQL, and Linux server management.',
      '2026', '1+',
      'https://linkedin.com/in/zaky-aprilian-38113529b',
      'zakyaprilian17@gmail.com',
      '',
      '/cv/ZAKY_APRILIAN_CV.pdf',
    ])
    console.log('[init] personal_info seeded')
  }

  // Seed: skills
  const { rowCount: sCount } = await pool.query('SELECT 1 FROM skills LIMIT 1')
  if (sCount === 0) {
    await pool.query(`
      INSERT INTO skills (label, color, side, sort_order) VALUES
      ('Laravel',    '#FF4433', 'right', 1),
      ('Node.js',    '#68A063', 'right', 2),
      ('PostgreSQL', '#336791', 'right', 3),
      ('PHP',        '#7B7FB5', 'left',  1),
      ('Git',        '#F05032', 'left',  2),
      ('Linux',      '#FCC624', 'left',  3)
    `)
    console.log('[init] skills seeded')
  }

  // Seed: projects
  const { rowCount: prCount } = await pool.query('SELECT 1 FROM projects LIMIT 1')
  if (prCount === 0) {
    await pool.query(`
      INSERT INTO projects (title, description, year, company, tech, sort_order)
      VALUES ($1,$2,$3,$4,$5,$6)
    `, [
      'Loan Warehouse Management System',
      'Internal web application for warehouse asset tracking at PT Lestari Banten Energi with LDAP authentication and borrowing workflow.',
      '2026',
      'PT Lestari Banten Energi',
      ['Laravel', 'PostgreSQL', 'LDAP', 'Ubuntu LTS'],
      1,
    ])
    console.log('[init] projects seeded')
  }

  // Seed: admin user
  const { rowCount: aCount } = await pool.query('SELECT 1 FROM admin_users LIMIT 1')
  if (aCount === 0) {
    const username = process.env.ADMIN_USERNAME || 'admin'
    const password = process.env.ADMIN_PASSWORD || 'admin123'
    const hash = await bcrypt.hash(password, 12)
    await pool.query(
      'INSERT INTO admin_users (username, password_hash) VALUES ($1,$2)',
      [username, hash]
    )
    console.log(`[init] Admin user created: ${username}`)
  }
}
