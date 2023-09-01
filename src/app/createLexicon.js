// import strong lexicons
import strongLexicon from "./strong_lexicon_fr.json";


const bookOptions = [
  // OT
  { label: "ANCIEN TESTAMENT" },
  { label: "Pentateuque" },
  "Genèse",
  "Exode",
  "Lévitique",
  "Nombres",
  "Deutéronome",
  { label: "Prophètes" },
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
  { label: "Écrits" },
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
  { label: "NOUVEAU TESTAMENT" },
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
  return word ? word.gloss.split(', ').slice(0,5).join(', ') : '?';
}

function makeChapterArray(chapterString) {
  return chapterString === ""
    ? []
    : chapterString.split(',').reduce((acc, cur) => {
      let chapter = cur.trim();
      if (chapter.includes('-')) {
        let [start, end] = cur.split('-');
        start = parseInt(start.trim());
        end = parseInt(end.trim());

        acc.push(...Array.from({length: end-start+1}, (x, i) => start + i));
      } else {
        chapter = parseInt(chapter.trim());
        if (chapter) {
          acc.push(chapter);
        }
      }

      return acc;
    }, []);
}

async function createLexicon(book='Genèse', chapters='', frequency=50) {
  let rawData = await fetch('/lexique-du-lecteur-biblique/bible_books/'+book+'.csv')
    .then(t => t.text())
    .then(text => {
      return text.split('\n');
    });

  let chapterArray = makeChapterArray(chapters);

  let lexicon = rawData.reduce((words, currentWord) => {
    let word = currentWord.split(',');

    let isSameWordInVerse = words.find(lexiconWord =>
      lexiconWord.chapter === parseInt(word[3])
      && lexiconWord.verse === parseInt(word[4])
      && lexiconWord.strong === word[7]
    );

    if (!isSameWordInVerse
    && parseInt(word[8]) <= frequency
    && (!chapterArray.length || (!!chapterArray.length && chapterArray.includes(parseInt(word[3]))))) {
      words.push({
        // id: word[0],
        book: word[2],
        chapter: parseInt(word[3]),
        verse: parseInt(word[4]),
        // orig: word[5],
        lex: word[6],
        strong: word[7],
        freq: parseInt(word[8]),
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
