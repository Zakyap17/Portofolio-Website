import { useEffect, useState } from 'react'

/* Menjaga komponen tetap ter-mount selama animasi keluar (exitMs) */
export function usePresence(open, exitMs = 450) {
  const [mounted, setMounted] = useState(open)

  useEffect(() => {
    if (open) { setMounted(true); return }
    const t = setTimeout(() => setMounted(false), exitMs)
    return () => clearTimeout(t)
  }, [open, exitMs])

  return open || mounted
}
