/*
  Validasi URL eksternal sebelum dipasang ke href.
  Hanya http(s) dan mailto yang lolos; javascript:, data:, vbscript: ditolak.
  Path relatif (mis. /cv/file.pdf) diizinkan.
*/
const ALLOWED = new Set(['http:', 'https:', 'mailto:'])

export function safeHref(url) {
  if (!url || typeof url !== 'string') return undefined
  const value = url.trim()
  if (value.startsWith('/') && !value.startsWith('//')) return value
  try {
    return ALLOWED.has(new URL(value).protocol) ? value : undefined
  } catch {
    return undefined
  }
}
