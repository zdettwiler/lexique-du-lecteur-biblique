// import strong lexicons
import strongLexicon from "./strong_lexicon_fr.json";


const bookOptions = [
  // OT
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

  // NT
  "Matthieu",
  "Marc",
  "Luc",
  "Jean",
  "Actes",
  "Romains",
  "1 Corinthiens",
  "2 Corinthiens",
  "Galates",
  "Éphésiens",
  "Philippiens",
  "Colossiens",
  "1 Thessaloniciens",
  "2 Thessaloniciens",
  "1 Timothée",
  "2 Timothée",
  "Tite",
  "Philémon",
  "Hébreux",
  "Jacques",
  "1 Pierre",
  "2 Pierre",
  "1 Jean",
  "2 Jean",
  "3 Jean",
  "Jude",
  "Apocalypse"
]

function searchStrongLexicon(strong) {
  const word = strongLexicon[strong[0]].find(entry => entry.strongNb === parseInt(strong.slice(1)));
  return word ? word.gloss : '?';
}

async function createLexicon(book='Genèse', frequency=50) {
  let rawData = await fetch('/lexique-du-lecteur-biblique/bible_books/'+book+'.csv')
    .then(t => t.text())
    .then(text => {
      return text.split('\n');
    });

  let lexicon = rawData.reduce((words, currentWord) => {
    let word = currentWord.split(',');

    if (parseInt(word[8]) <= frequency) {
      words.push({
        // id: word[0],
        book: word[2],
        chapter: word[3],
        verse: word[4],
        // orig: word[5],
        lex: word[6],
        strong: word[7],
        freq: word[8],
        gloss: searchStrongLexicon(word[7])
      })
    }

    return words;
  }, []);

  return lexicon;
}

export {
  createLexicon,
  bookOptions
};
