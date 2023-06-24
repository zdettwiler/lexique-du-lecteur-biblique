import axios from 'axios';
import genese from "./Genèse.csv"

const bookFiles = {
  'Matthieu': '61-Mt-morphgnt.txt',
  'Marc': '62-Mk-morphgnt.txt',
  'Luc': '63-Lk-morphgnt.txt',
  'Jean': '64-Jn-morphgnt.txt',
  'Actes': '65-Ac-morphgnt.txt',
  'Romains': '66-Ro-morphgnt.txt',
  '1 Corinthiens': '67-1Co-morphgnt.txt',
  '2 Corinthiens': '68-2Co-morphgnt.txt',
  'Galates': '69-Ga-morphgnt.txt',
  'Éphésiens': '70-Eph-morphgnt.txt',
  'Philippiens': '71-Php-morphgnt.txt',
  'Colossiens': '72-Col-morphgnt.txt',
  '1 Thessaloniciens': '73-1Th-morphgnt.txt',
  '2 Thessaloniciens': '74-2Th-morphgnt.txt',
  '1 Timothée': '75-1Ti-morphgnt.txt',
  '2 Timothée': '76-2Ti-morphgnt.txt',
  'Tite': '77-Tit-morphgnt.txt',
  'Philémon': '78-Phm-morphgnt.txt',
  'Hébreux': '79-Heb-morphgnt.txt',
  'Jacques': '80-Jas-morphgnt.txt',
  '1 Pierre': '81-1Pe-morphgnt.txt',
  '2 Pierre': '82-2Pe-morphgnt.txt',
  '1 Jean': '83-1Jn-morphgnt.txt',
  '2 Jean': '84-2Jn-morphgnt.txt',
  '3 Jean': '85-3Jn-morphgnt.txt',
  'Jude': '86-Jud-morphgnt.txt',
  'Apocalypse': '87-Re-morphgnt.txt'
}

const bookOptions = [
    { text: 'Matthieu', value: 'Matthieu' },
]

async function createLexicon(book = 'Genèse') {
    fetch(genese)
        .then(t => t.text())
        .then(text => {
            let rawData = text.split('\n');
            let columns = rawData[0].split(',');

            let bookData = rawData.map(item => {
                let word = item.split(',');
                return {
                    id: word[0],
                    bhsa2021_word_n: word[1],
                    book: word[2],
                    chapter: word[3],
                    verse: word[4],
                    bhsa_text: word[5],
                    voc_lex_utf8: word[6],
                    HStrong: word[7],
                    freq_lex: word[8]
                }
            });

            let lexiconNeeded = rawData.reduce((words, currentWord) => {
                let word = currentWord.split(',');

                if (parseInt(word[8]) < 50) {
                    words.push({
                        id: word[0],
                        bhsa2021_word_n: word[1],
                        book: word[2],
                        chapter: word[3],
                        verse: word[4],
                        bhsa_text: word[5],
                        voc_lex_utf8: word[6],
                        HStrong: word[7],
                        freq_lex: word[8]
                    })
                }

                return words;
            }, []);

            console.log(bookData, lexiconNeeded)
        });
}
  

export default createLexicon;