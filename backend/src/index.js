import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { initDb } from './db/init.js'
import authRoutes  from './routes/auth.js'
import siteRoutes  from './routes/site.js'
import adminRoutes from './routes/admin.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Static — serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Routes
app.use('/api/auth',  authRoutes)
app.use('/api/site',  siteRoutes)
app.use('/api/admin', adminRoutes)

// Health check
app.get('/api/health', (_, res) => res.json({ ok: true, time: new Date().toISOString() }))

// Serve frontend build (production)
const frontendDist = path.join(__dirname, '../../frontend/dist')
app.use(express.static(frontendDist, { maxAge: '1y', etag: false }))
app.get('*', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
  res.sendFile(path.join(frontendDist, 'index.html'))
})

// 404 — tidak akan tercapai jika frontend build ada
app.use((req, res) => res.status(404).json({ message: 'Not found' }))

// Global error handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' })
})

const PORT = process.env.PORT || 3001

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend running → http://localhost:${PORT}`)
    })
  })
  .catch(err => {
    console.error('Gagal koneksi DB / init:', err.message)
    process.exit(1)
  })
