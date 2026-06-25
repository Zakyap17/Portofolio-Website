/* API client — semua request ke backend lewat sini */

async function apiFetch(path, options = {}) {
  const token    = localStorage.getItem('admin_token')
  const isFormData = options.body instanceof FormData

  const headers = {}
  if (token) headers.Authorization = `Bearer ${token}`
  if (!isFormData && options.body) headers['Content-Type'] = 'application/json'
  Object.assign(headers, options.headers || {})

  const res = await fetch(`/api${path}`, { ...options, headers })

  if (res.status === 401) {
    localStorage.removeItem('admin_token')
    window.location.href = '/admin'
    return null
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || `HTTP ${res.status}`)
  }
  return res.json()
}

/* ── Public ── */
export const getSiteData = () => apiFetch('/site')

/* ── Auth ── */
export const login = (username, password) =>
  apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })

/* ── Admin: Personal ── */
export const getPersonal    = ()      => apiFetch('/admin/personal')
export const updatePersonal = (fd)    => apiFetch('/admin/personal', { method: 'PUT', body: fd })

/* ── Admin: Skills ── */
export const updateSkills = (skills) =>
  apiFetch('/admin/skills', {
    method: 'PUT',
    body: JSON.stringify({ skills }),
  })

/* ── Admin: Projects ── */
export const createProject = (fd)     => apiFetch('/admin/projects',     { method: 'POST',   body: fd })
export const editProject   = (id, fd) => apiFetch(`/admin/projects/${id}`, { method: 'PUT', body: fd })
export const deleteProject = (id)     => apiFetch(`/admin/projects/${id}`, { method: 'DELETE' })
