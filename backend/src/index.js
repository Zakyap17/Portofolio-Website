import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

// Health check
app.get('/api/health', (_, res) => res.json({ ok: true, time: new Date().toISOString() }))

// Serve hasil build frontend
const dist = path.join(__dirname, '../../frontend/dist')
app.use('/assets', express.static(path.join(dist, 'assets'), { maxAge: '1y', immutable: true }))
app.use(express.static(dist, { index: false, maxAge: '1h' }))

// index.html tidak boleh di-cache agar deploy baru langsung terlihat
app.get('*', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
  res.sendFile(path.join(dist, 'index.html'))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running → http://localhost:${PORT}`))
