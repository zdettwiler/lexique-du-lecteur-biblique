import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font
} from '@react-pdf/renderer';
import TimesNewRoman from './Times New Roman.ttf'


function Lexicon({data}) {
  // Register Font
  Font.register({
    family: "TimesNewRoman",
    src: TimesNewRoman
  });

  // Create styles
  const styles = StyleSheet.create({
    page: {
      // flexDirection: 'row',
      // backgroundColor: '#E4E4E4'
      padding: 50,
      fontFamily: 'TimesNewRoman',
      fontSize: 12
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
    wordEntry: {
      marginBottom: 5,
    },
    word: {

    },
    verse: {

    }
  });




  // Create Document Component

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Lexique du lecteur biblique</Text>

        <Text style={styles.bookTitle}>{data[0].book}</Text>

        {data.map((word, id) => (
          <div style={styles.wordEntry} key={id}>
            <Text style={styles.verse}>{word.verse}</Text>
            <Text style={styles.word}>{word.voc_lex} ({word.freq_lex})</Text>
            <Text style={styles.word}>{word.gloss}</Text>
          </div>
        ))}


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