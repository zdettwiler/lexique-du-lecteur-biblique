'use client'
// import React, { useContext } from 'react'
// import { DarkModeContext } from './DarkMode'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function DarkModeSwitch () {
  // const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext)
  const isDarkMode = false
  const toggleDarkMode = () => {}

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button onClick={toggleDarkMode}>
          {isDarkMode ? '🌛' : '🌞'}
        </button>
      </TooltipTrigger>
      <TooltipContent side='left'>
        <p>Passer au mode {isDarkMode ? 'clair' : 'sombre'}</p>
      </TooltipContent>
    </Tooltip>
  )
}
