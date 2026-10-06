import { createContext, useContext } from 'react'

/* true setelah loader selesai & data termuat — semua reveal above-the-fold menunggu ini */
export const IntroContext = createContext(false)
export const useIntro = () => useContext(IntroContext)
