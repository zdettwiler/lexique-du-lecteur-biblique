import axios from 'axios';
import genese from "./Jonas.csv"

const atBooks = [
    "Genèse",
    "Exode",
    "Lévitique",
    "Nombres",
    "Deutéronome",
    "Josué",
    "Juges",
    "Ruth",
    "1 Samuel",
    "2 Samuel",
    "1 Rois",
    "2 Rois",
    "1 Chroniques",
    "2 Chroniques",
    "Esdras",
    "Néhémie",
    "Esther",
    "Job",
    "Psaumes",
    "Proverbes",
    "Ecclésiastes",
    "Cantique des Cantiques",
    "Ésaïe",
    "Jérémie",
    "Lamentations",
    "Ezékiel",
    "Daniel",
    "Osée",
    "Joël",
    "Amos",
    "Abdias",
    "Jonas",
    "Michée",
    "Nahum",
    "Habaquq",
    "Sophonie",
    "Aggée",
    "Zacharie",
    "Malachie",
]

const bookOptions = [
    { text: 'Gen', value: 'Matthieu' },
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
  

export {
    createLexicon,
    atBooks
};