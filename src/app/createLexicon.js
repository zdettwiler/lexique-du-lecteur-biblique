// import strong lexicons
import strongLexicon from "./ot_strong_lexicon_fr.json";
// import { usePapaParse } from 'react-papaparse';

const otBooksOptions = [
    "Genèse",
    "Exode",
    "Lévitique",
    "Nombres",
    "Deutéronome",
    "Josué",
    "Juges",
    "1 Samuel",
    "2 Samuel",
    "1 Rois",
    "2 Rois",
    "Ésaïe",
    "Jérémie",
    "Ezékiel",
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
    "Psaumes",
    "Proverbes",
    "Job",
    "Cantique des cantiques",
    "Ruth",
    "Lamentations",
    "Ecclésiastes",
    "Esther",
    "Daniel",
    "Esdras",
    "Néhémie",
    "1 Chroniques",
    "2 Chroniques",
]

function searchStrongLexicon(hstrong) {
    const strong = hstrong[0] === 'H' ? parseInt(hstrong.slice(1)) : parseInt(hstrong)
    const word = strongLexicon.find(entry => entry.strongNb === strong);
    return word ? word.gloss : '?';
}

async function createLexicon(book='Genèse', frequency=50) {
    let rawData = await fetch('/lexique-du-lecteur-biblique/ot_books/'+book+'.csv')
        .then(t => t.text())
        .then(text => {
            return text.split('\n');
        });

    // let columns = rawData[0].split(',');

    let lexicon = rawData.reduce((words, currentWord) => {
        let word = currentWord.split(',');

        if (parseInt(word[8]) <= frequency) {
            words.push({
                id: word[0],
                bhsa2021_word_n: word[1],
                book: word[2],
                chapter: word[3],
                verse: word[4],
                bhsa_text: word[5],
                voc_lex: word[6],
                hstrong: word[7],
                freq_lex: word[8],
                gloss: searchStrongLexicon(word[7])
            })
        }

        return words;
    }, []);

    return lexicon;
}
  

export {
    createLexicon,
    otBooksOptions
};