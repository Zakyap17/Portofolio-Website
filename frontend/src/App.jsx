import { SiteProvider } from './context/SiteContext'
import PortfolioPage from './pages/PortfolioPage'
import ErrorBoundary from './components/ErrorBoundary'

export default function App() {
  return (
    <ErrorBoundary>
      <SiteProvider>
        <PortfolioPage />
      </SiteProvider>
    </ErrorBoundary>
  )
}
