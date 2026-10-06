/*
  Server statis untuk hasil build frontend — sengaja dibuat sekecil mungkin.
  Tidak ada database, login, upload, maupun endpoint yang menerima data,
  sehingga permukaan serangan (SQLi, CSRF, brute force, defacement lewat aplikasi)
  praktis nol. Yang tersisa dijaga di sini: header keamanan, rate limit,
  validasi path, dan batas waktu koneksi.
*/
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import rateLimit from 'express-rate-limit'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dist = path.join(__dirname, '../../frontend/dist')

const PORT = Number(process.env.PORT) || 3001

/*
  TRUST_PROXY: kosong = tidak percaya header X-Forwarded-* (aman bila server diakses langsung).
  Isi "1" bila ada tepat satu reverse proxy (Nginx/Cloudflare Tunnel) di depan,
  atau "loopback" bila Nginx berada di mesin yang sama.
  Nilai yang salah membuat IP klien bisa dipalsukan dan rate limit terlewati.
*/
const TRUST_PROXY = process.env.TRUST_PROXY

const app = express()
app.disable('x-powered-by')
app.disable('etag')
if (TRUST_PROXY) app.set('trust proxy', /^\d+$/.test(TRUST_PROXY) ? Number(TRUST_PROXY) : TRUST_PROXY)

/* ── Header keamanan ── */
const CSP = [
  "default-src 'none'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "base-uri 'none'",
  "form-action 'none'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  process.env.HTTPS_ONLY === 'true' ? 'upgrade-insecure-requests' : '',
].filter(Boolean).join('; ')

app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', CSP)
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()')
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin')
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none')
  // HSTS hanya dikirim lewat koneksi HTTPS (browser mengabaikannya di HTTP)
  if (req.secure) res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains')
  next()
})

/* ── Rate limit per IP (lapisan aplikasi; DDoS volumetrik harus dihentikan di Nginx/Cloudflare/firewall) ── */
app.use(rateLimit({
  windowMs: 60_000,
  limit: 600,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: 'Too many requests',
}))

/* ── Hanya GET/HEAD ── */
app.use((req, res, next) => {
  if (req.method === 'GET' || req.method === 'HEAD') return next()
  res.setHeader('Allow', 'GET, HEAD')
  res.status(405).type('text/plain').send('Method not allowed')
})

/* ── Validasi URL & path (traversal, null byte, URL berlebihan, file tersembunyi) ── */
app.use((req, res, next) => {
  if (req.url.length > 2048) return res.status(414).type('text/plain').send('URI too long')

  let decoded
  try {
    decoded = decodeURIComponent(req.path)
  } catch {
    return res.status(400).type('text/plain').send('Bad request')
  }

  if (decoded.includes('\0') || decoded.includes('\\') || decoded.split('/').includes('..')) {
    return res.status(400).type('text/plain').send('Bad request')
  }
  // file/folder tersembunyi (.env, .git, ...) tidak pernah dilayani
  if (decoded.split('/').some(seg => seg.startsWith('.') && seg !== '')) {
    return res.status(404).type('text/plain').send('Not found')
  }
  next()
})

/* ── Health check ── */
app.get('/api/health', (_req, res) => {
  res.setHeader('Cache-Control', 'no-store')
  res.json({ ok: true })
})

/* ── Aset statis ── */
app.use('/assets', express.static(path.join(dist, 'assets'), {
  maxAge: '1y', immutable: true, dotfiles: 'ignore', index: false, redirect: false,
}))
app.use(express.static(dist, {
  maxAge: '1h', dotfiles: 'ignore', index: false, redirect: false, fallthrough: true,
}))

/* ── Fallback SPA: hanya untuk path tanpa ekstensi ── */
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/') || path.extname(req.path)) {
    return res.status(404).type('text/plain').send('Not found')
  }
  res.setHeader('Cache-Control', 'no-store')
  res.sendFile(path.join(dist, 'index.html'), { dotfiles: 'deny' })
})

/* ── Error handler: jangan membocorkan detail internal ── */
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).type('text/plain').send('Internal server error')
})

const server = app.listen(PORT, () => console.log(`Server running → http://localhost:${PORT}`))

/* ── Batas waktu koneksi (anti slowloris / koneksi menggantung) ── */
server.headersTimeout = 10_000
server.requestTimeout = 15_000
server.keepAliveTimeout = 5_000
server.maxHeadersCount = 50
server.maxRequestsPerSocket = 200

/* ── Shutdown rapi saat container dihentikan ── */
for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, () => {
    server.close(() => process.exit(0))
    setTimeout(() => process.exit(1), 5_000).unref()
  })
}
