import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from '../config/db.js'

const router = Router()

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({ message: 'Username dan password wajib diisi' })
    }

    const { rows } = await pool.query(
      'SELECT * FROM admin_users WHERE username = $1',
      [username]
    )
    const user = rows[0]
    if (!user) {
      return res.status(401).json({ message: 'Username atau password salah' })
    }

    const match = await bcrypt.compare(password, user.password_hash)
    if (!match) {
      return res.status(401).json({ message: 'Username atau password salah' })
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({ token })
  } catch (err) {
    console.error('[auth/login]', err)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
