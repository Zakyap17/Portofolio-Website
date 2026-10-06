import { useEffect, useState } from 'react'

/* true begitu elemen pertama kali masuk viewport (sekali saja) */
export function useInView(ref, { rootMargin = '0px 0px -8% 0px', threshold = 0 } = {}) {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || inView) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { rootMargin, threshold }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, inView, rootMargin, threshold])

  return inView
}
