'use client'
import { useTheme } from "next-themes"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function DarkModeSwitch () {
  const { theme, setTheme } = useTheme()

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          {theme === 'light' ? '🌞' : '🌛'}
        </button>
      </TooltipTrigger>
      <TooltipContent side='left'>
        <p>Passer au mode {theme === 'light' ? 'sombre' : 'clair'}</p>
      </TooltipContent>
    </Tooltip>
  )
}
