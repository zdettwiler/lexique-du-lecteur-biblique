'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { actionToggleDarkMode } from '@/lib/actions'
import * as ga from '@/lib/ga'

export const DarkModeContext = createContext()

// const themeFromLocalStorage = () => {
//   if (typeof window !== 'undefined') {
//     const isDarkMode = JSON.parse(localStorage.getItem('isDarkMode'));
//     return isDarkMode || false;
//   } else { return false }
// }

const DarkModeProvider = ({ children }) => {
  const { isDarkMode } = useContext(DarkModeContext)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (mounted) {
    document.querySelector('html').setAttribute('data-bs-theme', isDarkMode ? 'dark' : 'light')
    return children
  }
}

export default function DarkModeContextProvider ({ children, theme }) {
  const [isDarkMode, setDarkMode] = useState(theme)

  const toggleDarkMode = () => {
    ga.event({
      action: 'change_theme',
      params: {
        theme: !isDarkMode ? 'dark' : 'light'
      }
    })
    setDarkMode(!isDarkMode)
    actionToggleDarkMode(!isDarkMode)
  }

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      <DarkModeProvider>
        {children}
      </DarkModeProvider>
    </DarkModeContext.Provider>
  )
}
