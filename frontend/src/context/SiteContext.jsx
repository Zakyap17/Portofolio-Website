import { createContext, useContext } from 'react'
import { personal, skills, projects } from '../content/data'

/* Data situs statis — diedit langsung di src/content/data.js */
const value = { data: { personal, skills, projects } }

const SiteContext = createContext(value)

export function SiteProvider({ children }) {
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}

export const useSite = () => useContext(SiteContext)
