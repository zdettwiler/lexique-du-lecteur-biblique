import React from 'react';
import styles from './Lexicon.module.css'


function Lexicon({data}) {
  const testament = data[0].strong[0] === "G"
    ? "nt"
    : "ot";

  return (
    <div className={styles.lexicon}>
        {data.map((word, id, data) => {
          let prevChapter = id > 0 ? data[id-1].chapter : 0;
          let chapHeading = prevChapter !== word.chapter
            ? <h3 className={styles.chapterHeading}>CHAPITRE {word.chapter}</h3>
            : null;

          let prevVerse = id > 0 ? data[id-1].verse : 0;
          let verseIndicator = prevVerse !== word.verse
            ? <span className={styles.verseNb}>{word.verse}</span>
            : null;

          return (
            <div key={id}>
              {chapHeading}
                <div className={styles.wordEntry}>
                  <div className={styles.verseNb}>{verseIndicator}</div>
                  { testament == "nt" && (
                    <div className={styles.lexNT}>{word.lex}</div>
                  )}
                  { testament == "ot" && (
                    <div className={styles.lexOT}>{word.lex}</div>
                  )}
                  <div className={styles.freq}>({word.freq})</div>
                  <div className={styles.gloss}>{word.gloss}</div>
                </div>
            </div>
          )
        })}
    </div>
  );
}

export default Lexicon;
