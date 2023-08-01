import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font
} from '@react-pdf/renderer';


function PDFLexicon({frequency, data}) {
  Font.register({
    family: 'TimesNewRoman',
    fonts: [{
      src: 'https://db.onlinewebfonts.com/t/32441506567156636049eb850b53f02a.ttf',
      fontStyle: 'normal',
      // fontWeight: 400
    }]
  });

  // Create styles
  const styles = StyleSheet.create({
    page: {
      padding: 50,
      fontFamily: "TimesNewRoman",
      fontSize: 12,
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1
    },
    header: {
      textAlign: 'center',
      letterSpacing: 2,
      fontSize: 9,
    },
    bookTitle: {
      textAlign: 'center',
      fontSize: 30,
      letterSpacing: 10,
      textTransform: 'uppercase'
    },
    freqNotice: {
      textAlign: 'center',
      // letterSpacing: 2,
      fontSize: 10,
    },
    chapter: {
      fontSize: 8,
      letterSpacing: 5,
      textTransform: 'uppercase',
      margin: '20 0 10',
      textAlign: 'center'
    },
    wordEntry: {
      marginBottom: 5,
    },
    greek: {
      fontWeight: 'bold',
    },
    hebrew: {
      fontSize: 15,
      direction: 'rtl'
    },
    verse: {
      verticalAlign: 'super',
      fontSize: 8,
      marginTop: 20
    }
  });

  const styleLang = data[0].strong[0] === "G"
    ? styles.greek
    : styles.hebrew;


  // Create Document Component

  return (
    <Document>
      <Page
        size="A4"
        style={styles.page}
        title={data[0].book+" – Lexique du Lecteur Biblique"}
        author={"zdettwiler.github.io/lexique-du-lecteur-biblique"}
      >
        <Text style={styles.bookTitle}>{data[0].book}</Text>
        <Text style={styles.header}>LEXIQUE DU LECTEUR BIBLIQUE</Text>
        <Text style={styles.freqNotice}>Mots apparaissant moins de {frequency} fois dans le Testament</Text>

        <Text style={styles.chapter}>CHAPITRE {data[0].chapter}</Text>
        {data.map((word, id, data) => {
          let prevChapter = id > 0 ? data[id-1].chapter : word.chapter;
          let chapHeading = prevChapter !== word.chapter
            ? <Text style={styles.chapter}>CHAPITRE {word.chapter}</Text>
            : null;

          let prevVerse = id > 0 ? data[id-1].verse : 0;
          let verseIndicator = prevVerse !== word.verse
            ? <Text style={styles.verse}>{word.verse}</Text>
            : null;

          return (
            <div style={styles.wordEntry} key={id}>
              {chapHeading}
              <Text style={styles.word}>
                {verseIndicator} <Text style={styleLang}>{word.lex}</Text> ({word.freq}) <Text style={styles.word}>{word.gloss}</Text>
              </Text>
            </div>
          )
        })}
      </Page>
    </Document>
  );
}

export default PDFLexicon;
