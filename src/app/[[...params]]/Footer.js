export default function Footer({ version, date_updated }) {
  return (
    <footer>
      <p>🔧 par Zacharie Dettwiler en 2023</p>
      <p className="sources">
        avec les données de<br/>
        <a href="https://github.com/STEPBible/STEPBible-Data/tree/master/Translators%20Amalgamated%20OT%2BNT">THHOT</a> ∙ <a href="https://github.com/STEPBible/STEPBible-Data/tree/master/Translators%20Amalgamated%20OT%2BNT">THGNT</a><br/>
        <a href="https://www.levangile.com/Liste-Strong-Grec.php">Levangile</a> ∙ R. Pigeon (<a href="https://editeurbpc.com">editeurbpc.com</a>).
      </p>
      <p>LLB {version} ({date_updated})</p>
      <a className="discreet" href="https://github.com/zdettwiler/lexique-du-lecteur-biblique"><i className="bi bi-github"></i></a>
    </footer>
  );
};
