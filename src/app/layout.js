import './globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';

export const metadata = {
  title: 'Lexique du lecteur Biblique',
  description: 'Crée un lexique pour le livre que tu veux étudier avec les mots dont tu as besoin.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <footer>
          🔧 par Zach Dettwiler en 2023 avec les données de <a href="https://etcbc.github.io/bhsa/">BHSA</a> (<a href="https://dx.doi.org/10.17026/dans-z6y-skyh">10.17026/dans-z6y-skyh</a>), <a href="https://github.com/STEPBible/STEPBible-Data/tree/master/Translators%20Amalgamated%20OT%2BNT">THGNT</a> et <a href="https://emcitv.com/bible/strong-biblique.html">emcitv</a>.
        </footer>
      </body>
    </html>
  )
}
