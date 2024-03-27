import './globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import LLB from "./LLB.json";

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
          avec les données de <a href="https://github.com/STEPBible/">STEPBible</a> et <a href="https://www.levangile.com/Liste-Strong-Grec.php">Levangile</a>.</p>
          <p>LLB {LLB.version}</p>
          <a className="discreet" href="https://github.com/zdettwiler/lexique-du-lecteur-biblique"><i className="bi bi-github"></i></a>
        </footer>
      </body>
    </html>
  )
}
