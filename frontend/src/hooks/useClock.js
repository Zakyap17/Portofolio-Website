import { useEffect, useState } from 'react'

const format = (timeZone) => {
  const now = new Date()
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone, hour: 'numeric', minute: '2-digit', hour12: true,
  }).formatToParts(now)
  const get = t => parts.find(p => p.type === t)?.value || ''
  const time = `${get('hour')}:${get('minute')}${get('dayPeriod').toLowerCase()}`
  const date = new Intl.DateTimeFormat('en-GB', {
    timeZone, day: 'numeric', month: 'long', year: 'numeric',
  }).format(now).replace(/(\w+) (\d{4})$/, '$1, $2')
  return { time, date }
}

/* Jam & tanggal live untuk zona waktu tertentu (update tiap detik) */
export function useClock(timeZone) {
  const [clock, setClock] = useState(() => format(timeZone))
  useEffect(() => {
    const id = setInterval(() => setClock(format(timeZone)), 1000)
    return () => clearInterval(id)
  }, [timeZone])
  return clock
}
