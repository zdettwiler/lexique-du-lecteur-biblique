import './globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import LLB from "./LLB.json";
import DarkModeContextProvider from './DarkMode';

export const metadata = {
  title: 'Lexique du lecteur biblique',
  description: 'Créez un lexique pour le livre que vous souhaitez étudier avec les mots dont vous avez besoin.',
  background_color: 'white',
  theme_color: 'black',
  display: "standalone",
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
      src: "/img/icon-192.png",
      sizes: "192x192",
      type: "image/png"
    },
    {
      src: "/img/icon-512.png",
      sizes: "512x512",
      type: "image/png"
    }
  ],
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr" data-bs-theme="light">
      <body>
        <DarkModeContextProvider>
          {children}

          <footer>
            <p>🔧 par Zacharie Dettwiler en 2023</p>
            <p className="sources">
              avec les données de<br/>
              <a href="https://github.com/STEPBible/STEPBible-Data/tree/master/Translators%20Amalgamated%20OT%2BNT">THHOT</a> ∙ <a href="https://github.com/STEPBible/STEPBible-Data/tree/master/Translators%20Amalgamated%20OT%2BNT">THGNT</a><br/>
              <a href="https://www.levangile.com/Liste-Strong-Grec.php">Levangile</a> ∙ R. Pigeon (<a href="https://editeurbpc.com">editeurbpc.com</a>).
            </p>
            <p>LLB {LLB.version}</p>
            <a className="discreet" href="https://github.com/zdettwiler/lexique-du-lecteur-biblique"><i className="bi bi-github"></i></a>
          </footer>
        </DarkModeContextProvider>
      </body>
    </html>
  )
}
