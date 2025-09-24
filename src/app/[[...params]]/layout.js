import './globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import LLB from './LLB.json'
import DarkModeContextProvider from './DarkMode'
import LLBNav from './LLBNav'
import Footer from './Footer'

import { cookies } from 'next/headers'

export const metadata = {
  title: 'Lexique du lecteur biblique',
  description:
    'Créez un lexique pour le livre que vous souhaitez étudier avec les mots dont vous avez besoin.',
  background_color: 'white',
  theme_color: 'black',
  display: 'standalone',
  icons: [
    {
      rel: 'icon',
      type: 'image/png',
      media: '(prefers-color-scheme: light)',
      url: '/favicon-light.png'
    },
    {
      rel: 'icon',
      type: 'image/png',
      media: '(prefers-color-scheme: dark)',
      url: '/favicon-dark.png'
    },
    {
      src: '/img/icon-192.png',
      sizes: '192x192',
      type: 'image/png'
    },
    {
      src: '/img/icon-512.png',
      sizes: '512x512',
      type: 'image/png'
    }
  ]
}

export default function RootLayout({ children }) {
  const cookieStore = cookies()
  let theme = cookieStore.get('isDarkMode')
  theme = theme ? JSON.parse(theme.value) : false

  const [y, m, d] = LLB.updated.split(/\D/)
  const event = new Date(y, m - 1, d)
  const date_updated = event.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })

  return (
    <html lang='fr' data-bs-theme={theme ? 'dark' : 'light'}>
      <body>
        <DarkModeContextProvider theme={theme}>
          <LLBNav />
          {children}
          <Footer version={LLB.version} date_updated={date_updated} />
        </DarkModeContextProvider>
      </body>
    </html>
  )
}
