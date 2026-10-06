import { useEffect, useRef, useState } from 'react'
import { Hover, SpringLayer } from './motion/Spring'
import { StackedLines } from './motion/Text'
import { Eyebrow } from './ui/Controls'
import { CheckIcon, CloseIcon } from './ui/icons'
import { usePresence } from '../hooks/usePresence'
import { lockScroll, unlockScroll } from '../lib/scroll'
import { useSite } from '../context/SiteContext'

const labelCls = 'mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-ink-soft'
const inputCls = 'w-full rounded-xl border border-hairline bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-brand-light focus:ring-1 focus:ring-brand-light'

/* Modal kontak: submit membuka aplikasi email dengan pesan terisi (mailto) */
export default function ContactModal({ open, onClose }) {
  const mounted = usePresence(open, 450)
  const { data } = useSite()
  const email = data.personal.email
  const nameRef = useRef(null)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | sent

  useEffect(() => {
    if (!open) return
    lockScroll()
    const focus = setTimeout(() => nameRef.current?.focus(), 120)
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(focus)
      window.removeEventListener('keydown', onKey)
      unlockScroll()
    }
  }, [open, onClose])

  // reset form setelah modal tertutup
  useEffect(() => {
    if (open) return
    const t = setTimeout(() => { setForm({ name: '', email: '', message: '' }); setStatus('idle') }, 350)
    return () => clearTimeout(t)
  }, [open])

  if (!mounted) return null
  const phase = open ? 'in' : 'out'
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = e => {
    e.preventDefault()
    setStatus('sending')
    const subject = `Portfolio inquiry from ${form.name}`
    const body = `${form.message}\n\n— ${form.name} (${form.email})`
    setTimeout(() => {
      if (email) window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      setStatus('sent')
    }, 400)
  }

  const firstName = form.name.trim().split(/\s+/)[0] || 'there'

  return (
    <div
      className={`fixed inset-0 z-90 flex items-end justify-center p-3 sm:items-center sm:p-6 ${open ? '' : 'pointer-events-none'}`}
      role="dialog"
      aria-modal="true"
      aria-label="Get in touch"
    >
      <SpringLayer
        phase={phase}
        from={{ opacity: 0 }}
        to={{ opacity: 1 }}
        config={{ tension: 240, friction: 30 }}
        onClick={onClose}
        className="absolute inset-0 bg-brand-deep/40 backdrop-blur"
      />

      <SpringLayer
        phase={phase}
        from={{ opacity: 0, y: 28, scale: 0.96 }}
        to={{ opacity: 1, y: 0, scale: 1 }}
        config={{ tension: 240, friction: 26 }}
        data-lenis-prevent
        className="relative max-h-[92svh] w-full overflow-y-auto rounded-card-lg bg-surface-card p-6 text-ink shadow-[0_32px_80px_rgba(15,47,99,0.35)] sm:max-w-lg sm:p-8"
      >
        <div className="flex items-start justify-between">
          <div>
            <Eyebrow>Get in touch</Eyebrow>
            <StackedLines
              as="h2"
              lines={['Let’s build', 'something']}
              stagger={90}
              duration={800}
              className="mt-3 text-4xl font-medium leading-[0.95] tracking-tight sm:text-5xl"
            />
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            data-hover-root
            className="grid size-10 place-items-center rounded-pill bg-surface transition-colors hover:bg-hairline"
          >
            <Hover from={{ rotate: 0 }} to={{ rotate: 90 }} config={{ tension: 300, friction: 18 }} trigger="[data-hover-root]" className="inline-flex">
              <CloseIcon className="size-4" />
            </Hover>
          </button>
        </div>

        {status === 'sent' ? (
          <div className="mt-8 rounded-card bg-surface p-6 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-pill bg-brand text-white">
              <CheckIcon className="size-6" />
            </span>
            <p className="mt-4 text-lg font-medium">Message ready to send</p>
            <p className="mt-1 text-sm text-ink-soft">
              Thanks, {firstName} — your email app should open with the message prepared.
              {email && <> If it doesn’t, write to <a href={`mailto:${email}`} className="underline">{email}</a>.</>}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 rounded-pill bg-ink px-7 py-3.5 text-sm font-medium uppercase tracking-wide text-white transition-colors hover:bg-brand-deep"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="mt-7 flex flex-col gap-4">
            <label>
              <span className={labelCls}>Full name</span>
              <input ref={nameRef} required value={form.name} onChange={set('name')} placeholder="Alex Rivera" className={inputCls} />
            </label>
            <label>
              <span className={labelCls}>Email</span>
              <input required type="email" value={form.email} onChange={set('email')} placeholder="you@email.com" className={inputCls} />
            </label>
            <label>
              <span className={labelCls}>What would you like to discuss?</span>
              <textarea required rows={3} value={form.message} onChange={set('message')} placeholder="Tell me about your project or opportunity…" className={`${inputCls} resize-none`} />
            </label>
            <button
              type="submit"
              disabled={status === 'sending' || !form.name.trim() || !form.email.trim() || !form.message.trim()}
              className="mt-1 rounded-pill bg-ink px-7 py-3.5 text-sm font-medium uppercase tracking-wide text-white transition-colors hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === 'sending' ? 'Sending…' : 'Send message'}
            </button>
          </form>
        )}
      </SpringLayer>
    </div>
  )
}
