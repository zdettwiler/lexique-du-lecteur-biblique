// import all OT books
import genese from "./ot_books/Genèse.csv";
import exode from "./ot_books/Exode.csv";
import levitique from "./ot_books/Lévitique.csv";
import nombres from "./ot_books/Nombres.csv";
import deuteronome from "./ot_books/Deutéronome.csv";

import josue from "./ot_books/Josué.csv";
import juges from "./ot_books/Juges.csv";
import asamuel from "./ot_books/1 Samuel.csv";
import bsamuel from "./ot_books/2 Samuel.csv";
import arois from "./ot_books/1 Rois.csv";
import brois from "./ot_books/2 Rois.csv";
import esaie from "./ot_books/Ésaïe.csv";
import jeremie from "./ot_books/Jérémie.csv";
import ezekiel from "./ot_books/Ezékiel.csv";
import osee from "./ot_books/Osée.csv";
import joel from "./ot_books/Joël.csv";
import amos from "./ot_books/Amos.csv";
import abdias from "./ot_books/Abdias.csv";
import jonas from "./ot_books/Jonas.csv";
import michee from "./ot_books/Michée.csv";
import nahum from "./ot_books/Nahum.csv";
import habaquq from "./ot_books/Habaquq.csv";
import sophonie from "./ot_books/Sophonie.csv";
import aggee from "./ot_books/Aggée.csv";
import zacharie from "./ot_books/Zacharie.csv";
import malachie from "./ot_books/Malachie.csv";

import psaumes from "./ot_books/Psaumes.csv";
import proverbes from "./ot_books/Proverbes.csv";
import job from "./ot_books/Job.csv";
import cantique from "./ot_books/Cantique des Cantiques.csv";
import ruth from "./ot_books/Ruth.csv";
import lamentations from "./ot_books/Lamentations.csv";
import ecclesiaste from "./ot_books/Ecclésiastes.csv";
import esther from "./ot_books/Esther.csv";
import daniel from "./ot_books/Daniel.csv";
import esdras from "./ot_books/Esdras.csv";
import nehemie from "./ot_books/Néhémie.csv";
import achroniques from "./ot_books/1 Chroniques.csv";
import bchroniques from "./ot_books/2 Chroniques.csv";

// import strong lexicons
import strongLexicon from "./ot_strong_lexicon_fr.json";

const otBooks = {
    "Genèse": genese,
    "Exode": exode,
    "Lévitique": levitique,
    "Nombres": nombres,
    "Deutéronome": deuteronome,

    "Josué": josue,
    "Juges": juges,
    "1 Samuel": asamuel,
    "2 Samuel": bsamuel,
    "1 Rois": arois,
    "2 Rois": brois,
    "Ésaïe": esaie,
    "Jérémie": jeremie,
    "Ezékiel": ezekiel,
    "Osée": osee,
    "Joël": joel,
    "Amos": amos,
    "Abdias": abdias,
    "Jonas": jonas,
    "Michée": michee,
    "Nahum": nahum,
    "Habaquq": habaquq,
    "Sophonie": sophonie,
    "Aggée": aggee,
    "Zacharie": zacharie,
    "Malachie": malachie,

    "Psaumes": psaumes,
    "Proverbes": proverbes,
    "Job": job,
    "Cantique des Cantiques": cantique,
    "Ruth": ruth,
    "Lamentations": lamentations,
    "Ecclésiastes": ecclesiaste,
    "Esther": esther,
    "Daniel": daniel,
    "Esdras": esdras,
    "Néhémie": nehemie,
    "1 Chroniques": achroniques,
    "2 Chroniques": bchroniques,
}

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
    let rawData = await fetch(otBooks[book])
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