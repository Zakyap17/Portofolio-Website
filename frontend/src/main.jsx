import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

/* ── Global error catcher ── */
function showError(msg) {
  const el = document.createElement('div')
  el.style.cssText = [
    'position:fixed', 'top:0', 'left:0', 'right:0', 'z-index:99999',
    'background:#dc2626', 'color:#fff', 'padding:12px 16px',
    'font-family:monospace', 'font-size:13px', 'white-space:pre-wrap',
    'word-break:break-all', 'max-height:200px', 'overflow-y:auto',
  ].join(';')
  el.textContent = '🔴 ERROR: ' + msg
  document.body.appendChild(el)
}

window.addEventListener('error', e => {
  showError(e.message + '\n' + (e.filename || '') + ':' + e.lineno)
})
window.addEventListener('unhandledrejection', e => {
  showError('Promise rejected: ' + (e.reason?.message || e.reason))
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
