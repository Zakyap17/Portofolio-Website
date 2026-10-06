import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import Loader from '../components/Loader'
import Hero from '../components/Hero'
import About from '../components/About'
import Skills from '../components/Skills'
import Projects from '../components/Projects'
import Stats from '../components/Stats'
import Highlights from '../components/Highlights'
import Footer from '../components/Footer'
import MenuOverlay from '../components/MenuOverlay'
import ContactModal from '../components/ContactModal'
import { IntroContext } from '../context/IntroContext'
import { useNavTransition } from '../hooks/useNavTransition'
import { initScroll } from '../lib/scroll'

const FONT_BASE = 16
const BASE_WIDTH = 1920
const COEF = 0.6666

/* Adaptive rem grid: skala turun lewat media query (index.css), skala naik di atas 1920px lewat JS */
function applyAdaptiveGrid() {
  const html = document.documentElement
  const reduction = ((BASE_WIDTH - window.innerWidth) / BASE_WIDTH) * 100 * COEF
  const size = FONT_BASE - (FONT_BASE * reduction) / 100
  if (size > FONT_BASE) html.style.fontSize = `${size}px`
  else html.style.removeProperty('font-size')
}

export default function PortfolioPage() {
  const { navigate } = useNavTransition()
  const [introDone, setIntroDone] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)

  useLayoutEffect(() => {
    const html = document.documentElement
    html.classList.add('adaptive-grid')
    applyAdaptiveGrid()
    window.addEventListener('resize', applyAdaptiveGrid)
    return () => {
      window.removeEventListener('resize', applyAdaptiveGrid)
      html.classList.remove('adaptive-grid')
      html.style.removeProperty('font-size')
    }
  }, [])

  useEffect(() => initScroll(), [])

  const onIntroDone = useCallback(() => setIntroDone(true), [])
  const openMenu = useCallback(() => setMenuOpen(true), [])
  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const openContact = useCallback(() => setContactOpen(true), [])
  const closeContact = useCallback(() => setContactOpen(false), [])

  return (
    <IntroContext.Provider value={introDone}>
      <Loader dataSettled onDone={onIntroDone} />

      <main className="w-full overflow-x-clip p-2 sm:p-3">
        <Hero onNavigate={navigate} onOpenMenu={openMenu} onOpenContact={openContact} />
        <About />
        <Skills onNavigate={navigate} />
        <Projects />
        <Stats />
        <Highlights />
        <Footer onNavigate={navigate} onOpenContact={openContact} />
      </main>
      <MenuOverlay open={menuOpen} onClose={closeMenu} onOpenContact={openContact} />
      <ContactModal open={contactOpen} onClose={closeContact} />
    </IntroContext.Provider>
  )
}
