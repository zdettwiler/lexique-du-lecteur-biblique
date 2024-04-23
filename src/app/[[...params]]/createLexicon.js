// import strong lexicons
import LLB from "./LLB.json";


const bookOptions = [
  // OT
  { label: "ANCIEN TESTAMENT" },
  { label: "Pentateuque" },
  { value: "Genèse", label: "Genèse" },
  { value: "Exode", label: "Exode" },
  { value: "Lévitique", label: "Lévitique" },
  { value: "Nombres", label: "Nombres" },
  { value: "Deutéronome", label: "Deutéronome" },
  { label: "Prophètes" },
  { value: "Josué", label: "Josué" },
  { value: "Juges", label: "Juges" },
  { value: "1Samuel", label: "1 Samuel" },
  { value: "2Samuel", label: "2 Samuel" },
  { value: "1Rois", label: "1 Rois" },
  { value: "2Rois", label: "2 Rois" },
  { value: "Ésaïe", label: "Ésaïe" },
  { value: "Jérémie", label: "Jérémie" },
  { value: "Ezékiel", label: "Ezékiel" },
  { value: "Osée", label: "Osée" },
  { value: "Joël", label: "Joël" },
  { value: "Amos", label: "Amos" },
  { value: "Abdias", label: "Abdias" },
  { value: "Jonas", label: "Jonas" },
  { value: "Michée", label: "Michée" },
  { value: "Nahum", label: "Nahum" },
  { value: "Habaquq", label: "Habaquq" },
  { value: "Sophonie", label: "Sophonie" },
  { value: "Aggée", label: "Aggée" },
  { value: "Zacharie", label: "Zacharie" },
  { value: "Malachie", label: "Malachie" },
  { label: "Écrits" },
  { value: "Psaumes", label: "Psaumes" },
  { value: "Proverbes", label: "Proverbes" },
  { value: "Job", label: "Job" },
  { value: "Cantiques", label: "Cantique des cantiques" },
  { value: "Ruth", label: "Ruth" },
  { value: "Lamentations", label: "Lamentations" },
  { value: "Ecclésiastes", label: "Ecclésiastes" },
  { value: "Esther", label: "Esther" },
  { value: "Daniel", label: "Daniel" },
  { value: "Esdras", label: "Esdras" },
  { value: "Néhémie", label: "Néhémie" },
  { value: "1Chroniques", label: "1 Chroniques" },
  { value: "2Chroniques", label: "2 Chroniques" },

  // NT
  { label: "NOUVEAU TESTAMENT" },
  { value: "Matthieu", label: "Matthieu" },
  { value: "Marc", label: "Marc" },
  { value: "Luc", label: "Luc" },
  { value: "Jean", label: "Jean" },
  { value: "Actes", label: "Actes" },
  { value: "Romains", label: "Romains" },
  { value: "1Corinthiens", label: "1 Corinthiens" },
  { value: "2Corinthiens", label: "2 Corinthiens" },
  { value: "Galates", label: "Galates" },
  { value: "Éphésiens", label: "Éphésiens" },
  { value: "Philippiens", label: "Philippiens" },
  { value: "Colossiens", label: "Colossiens" },
  { value: "1Thessaloniciens", label: "1 Thessaloniciens" },
  { value: "2Thessaloniciens", label: "2 Thessaloniciens" },
  { value: "1Timothée", label: "1 Timothée" },
  { value: "2Timothée", label: "2 Timothée" },
  { value: "Tite", label: "Tite" },
  { value: "Philémon", label: "Philémon" },
  { value: "Hébreux", label: "Hébreux" },
  { value: "Jacques", label: "Jacques" },
  { value: "1Pierre", label: "1 Pierre" },
  { value: "2Pierre", label: "2 Pierre" },
  { value: "1Jean", label: "1 Jean" },
  { value: "2Jean", label: "2 Jean" },
  { value: "3Jean", label: "3 Jean" },
  { value: "Jude", label: "Jude" },
  { value: "Apocalypse", label: "Apocalypse" },
]

function searchStrongLexicon(strong) {
  const word = LLB.lexique[strong[0]].find(entry => entry.strongNb === parseInt(strong.slice(1)));
  // return word ? word.gloss.split(', ').slice(0,5).join(', ') : '?';
  return word ? word.gloss : '?';
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
  let rawData = await fetch('/bible_books/'+book+'.csv')
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
        lex: word[6], // TODO: Replace with lex from LLB?
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
