import { createContext, useContext, useState, useEffect } from 'react'
import { getSiteData } from '../api/index.js'

const emptyData = {
  personal: {
    name: '', role: '', description: '',
    yearLabel: '', yearsExp: '',
    linkedin: '', email: '', github: '',
    cvUrl: '', photo: null,
  },
  skills:   [],
  projects: [],
}

const SiteContext = createContext(null)

export function SiteProvider({ children }) {
  const [data,    setData]    = useState(emptyData)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const normalize = (d) => ({
    personal: d.personal || emptyData.personal,
    skills:   Array.isArray(d.skills)   ? d.skills   : [],
    projects: Array.isArray(d.projects) ? d.projects : [],
  })

  const refresh = () =>
    getSiteData()
      .then(d => { if (d) setData(normalize(d)) })
      .catch(err => setError(err.message))

  useEffect(() => {
    getSiteData()
      .then(d => { if (d) setData(normalize(d)) })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <SiteContext.Provider value={{ data, loading, error, refresh }}>
      {children}
    </SiteContext.Provider>
  )
}

export const useSite = () => useContext(SiteContext)
