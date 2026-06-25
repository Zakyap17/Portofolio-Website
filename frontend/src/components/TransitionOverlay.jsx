import { forwardRef, useImperativeHandle, useState } from 'react'

const TransitionOverlay = forwardRef((_, ref) => {
  const [phase, setPhase] = useState('hidden') // hidden | in | out

  useImperativeHandle(ref, () => ({
    async trigger() {
      return new Promise(resolve => {
        setPhase('in')
        setTimeout(() => {
          resolve()
          setPhase('out')
          setTimeout(() => setPhase('hidden'), 350)
        }, 180)
      })
    },
  }))

  if (phase === 'hidden') return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: '#0a1628',
      pointerEvents: 'none',
      opacity: phase === 'in' ? 1 : 0,
      transition: phase === 'in'
        ? 'opacity 0.18s ease'
        : 'opacity 0.35s ease',
    }} />
  )
})

TransitionOverlay.displayName = 'TransitionOverlay'
export default TransitionOverlay
