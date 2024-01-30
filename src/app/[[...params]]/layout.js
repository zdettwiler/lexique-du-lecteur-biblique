import './globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import LLB from "./LexiqueBibliqueFrancais.json";

export const metadata = {
  title: 'Lexique du lecteur biblique',
  description: 'Créez un lexique pour le livre que vous souhaitez étudier avec les mots dont vous avez besoin.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <footer>
          <p>🔧 par Zacharie Dettwiler en 2023<br/>
          avec les données de <a href="https://etcbc.github.io/bhsa/">BHSA</a> (<a href="https://dx.doi.org/10.17026/dans-z6y-skyh">10.17026/dans-z6y-skyh</a>), <a href="https://github.com/STEPBible/STEPBible-Data/tree/master/Translators%20Amalgamated%20OT%2BNT">THGNT</a> et <a href="https://www.levangile.com/Liste-Strong-Grec.php">Levangile</a>.</p>
          <p>LLB {LLB.version}</p>
          <a className="discreet" href="https://github.com/zdettwiler/lexique-du-lecteur-biblique"><i className="bi bi-github"></i></a>
        </footer>
      </body>
    </html>
  )
}
