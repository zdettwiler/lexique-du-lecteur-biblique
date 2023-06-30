import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font
} from '@react-pdf/renderer';
// import TimesNewRoman from './Times New Roman.ttf'


function Lexicon({data}) {
  // Register Font
  Font.register({
    // family: "TimesNewRoman",
    family: "TimesNewRoman",
    src: 'Noto Sans Hebrew'
  });

  // Create styles
  const styles = StyleSheet.create({
    page: {
      padding: 50,
      fontFamily: 'Times-Roman',
      fontSize: 12,
      // flexDirection: 'row',
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1
    },
    header: {
      textAlign: 'center',
      fontSize: 10,
    },
    bookTitle: {
      textAlign: 'center',
      fontSize: 50,
      letterSpacing: 10,
      textTransform: 'uppercase'
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
    word: {

    },
    verse: {
      verticalAlign: 'super',
      fontSize: 8,
      marginTop: 20
    }
  });




  // Create Document Component

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>LEXIQUE DU LECTEUR BIBLIQUE</Text>
        <Text style={styles.bookTitle}>{data[0].book}</Text>
        <Text style={styles.header}>Mots apparaissant moins de X fois</Text>

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
                {verseIndicator} {word.voc_lex} ({word.freq_lex}) <Text style={styles.word}>{word.gloss}</Text>
              </Text>
            </div>
          )
        })}


        <View style={styles.section}>
          <Text>Section #1</Text>
        </View>
        <View style={styles.section}>
          <Text>Section #2</Text>
        </View>
      </Page>
    </Document>
  );
}

export default Lexicon;