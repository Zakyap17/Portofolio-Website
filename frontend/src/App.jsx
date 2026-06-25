import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SiteProvider } from './context/SiteContext'
import PortfolioPage from './pages/PortfolioPage'
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'

export default function App() {
  return (
    <ErrorBoundary>
      <SiteProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PortfolioPage />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </BrowserRouter>
      </SiteProvider>
    </ErrorBoundary>
  )
}
