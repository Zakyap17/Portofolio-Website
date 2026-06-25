export function useNavTransition() {
  const navigate = (e, targetId) => {
    e.preventDefault()
    const target = document.querySelector(targetId)
    if (!target) return
    target.scrollIntoView({ behavior: 'smooth' })
  }

  return { navigate }
}
