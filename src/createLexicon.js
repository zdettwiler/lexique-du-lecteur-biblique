import axios from 'axios';
import genese from "./Jonas.csv"
import strongLexicon from "./ot_strong_lexicon_fr.json"

const otBooks = [
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

function searchStrongLexicon(hstrong) {
    const strong = hstrong[0] === 'H' ? hstrong.slice(1) : hstrong
    const word = strongLexicon.find(entry => entry.strongNb == strong);
    console.log(hstrong, word)
    return word.gloss || '?';
}

async function createLexicon(book='Genèse', frequency=50) {
    // console.log(book)
    let rawData = await fetch(genese)
        .then(t => t.text())
        .then(text => {
            return text.split('\n');
        });

    // let columns = rawData[0].split(',');

    // let bookData = rawData.map(item => {
    //     let word = item.split(',');
    //     return {
    //         id: word[0],
    //         bhsa2021_word_n: word[1],
    //         book: word[2],
    //         chapter: word[3],
    //         verse: word[4],
    //         bhsa_text: word[5],
    //         lex: word[6],
    //         hstrong: word[7],
    //         freq_lex: word[8]
    //     }
    // });

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

    console.log(lexicon)
    return lexicon;
}
  

export {
    createLexicon,
    otBooks
};