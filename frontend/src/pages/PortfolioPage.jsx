import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Projects from '../components/Projects'
import Footer from '../components/Footer'
import { useNavTransition } from '../hooks/useNavTransition'

export default function PortfolioPage() {
  const { navigate } = useNavTransition()

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117' }}>
      <Navbar onNavigate={navigate} />
      <Hero onNavigate={navigate} />
      <Projects />
      <Footer onNavigate={navigate} />
    </div>
  )
}
