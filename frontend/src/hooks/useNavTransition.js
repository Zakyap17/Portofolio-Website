import { scrollToTarget } from '../lib/scroll'

export function useNavTransition() {
  const navigate = (e, targetId) => {
    e?.preventDefault()
    scrollToTarget(targetId)
  }

  return { navigate }
}
