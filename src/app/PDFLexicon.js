import React from 'react';
import { jsPDF } from "jspdf";
import timesNewRoman from "./timesNewRoman_binary.js";
import { Button } from 'react-bootstrap';


export default function PDFLexicon({frequency, data}) {
  const doc = new jsPDF();
  const page = {
    height: doc.internal.pageSize.getHeight(),
    width: doc.internal.pageSize.getWidth(),
    margin: {
      top: 23,
      right: 20,
      left: 20,
      bottom: 20
    }
  }

  // add font
  doc.addFileToVFS("Times New Roman.ttf", timesNewRoman);
  doc.addFont("Times New Roman.ttf", "Times New Roman", "normal");
  doc.setFont("Times New Roman");

  // book title
  let string = data[0].book.toUpperCase();
  let xOffset = page.width/2 - ((string.length-1) * 0.84) // manually accounting for letter spacing!
  doc
    .setFontSize(30)
    .text(string, xOffset, page.margin.top, {
      align: 'center',
      charSpace: 3
    });

  // Lexique du lecteur biblique
  string = "LEXIQUE DU LECTEUR BIBLIQUE";
  xOffset = page.width/2 - ((string.length-1) * .31) // manually accounting for letter spacing!
  doc
    .setFontSize(9)
    .text(string, xOffset, page.margin.top+5, {
      align: 'center',
      charSpace: 1
    });

  // Mots apparaissant moins de X fois dans le Testament
  let testament = data[0].strong[0] === 'G'
    ? "le Nouveau Testament"
    : "l'Ancien Testament";
  string = [
    "Mots apparaissant moins de " + frequency + " fois dans " + testament + ".",
    "Entre parenthèses figure le nombre d'apparitions du mot dans " + testament + ".",
    "Généré par zdettwiler.github.io/lexique-du-lecteur-biblique."
  ];
  let textWidth = doc
    .setFont('Times', 'italic')
    .setFontSize(9)
    .getTextWidth(string[0]);
  xOffset = page.width/2 - textWidth/2;
  doc.text(string[0], xOffset, page.margin.top+15)

  textWidth = doc
    .setFont('Times', 'italic')
    .setFontSize(9)
    .getTextWidth(string[1]);
  xOffset = page.width/2 - textWidth/2;
  doc.text(string[1], xOffset, page.margin.top+15 + doc.getLineHeight() * 0.3527777778);

  textWidth = doc
    .setFont('Times', 'italic')
    .setFontSize(9)
    .getTextWidth(string[2]);
  xOffset = page.width/2 - textWidth/2;
  // doc.text(string[2], xOffset, 35 + 2 * doc.getLineHeight() * 0.3527777778);
  doc.textWithLink("Généré par zdettwiler.github.io/lexique-du-lecteur-biblique.", xOffset, page.margin.top+15 + 2 * doc.getLineHeight() * 0.3527777778, {url: 'https://zdettwiler.github.io/lexique-du-lecteur-biblique/'});
  doc.line(
    xOffset+15.3, page.margin.top+15.5 + 2 * doc.getLineHeight() * 0.3527777778,
    xOffset+75.5, page.margin.top+15.5 + 2 * doc.getLineHeight() * 0.3527777778
  );



  let currentY = 55;

  // constants for column display
  const columnGutter = 10;
  const columnWidth = (page.width - 2*page.margin.left - columnGutter) / 2;

  const xTabVerse = page.margin.left + 2;
  const xTabLex = page.margin.left + 3;
  const xTabFreq = page.margin.left + 27;
  const xTabGloss = page.margin.left + 35;
  let topColumnY = currentY;
  let padding = 0;

  // group data by chapter
  doc.setFontSize(11);

  let dataByChap = data.reduce((acc, word) => {
    if (acc[word.chapter]) {
      acc[word.chapter].push({
        ...word,
        gloss: doc.splitTextToSize(word.gloss, columnWidth - xTabGloss + page.margin.left)
      });

    } else {
      acc[word.chapter] = [{
        ...word,
        gloss: doc.splitTextToSize(word.gloss, columnWidth - xTabGloss + page.margin.left)
      }];
    }

    return acc;
  }, {})


  let lineHeightToMm = (nbLines) => {
    doc.setFontSize(11);
    return nbLines * doc.getLineHeight() * 0.3527777778
  }

  let totalColumnAvailableLines = (y) => {
    doc.setFontSize(11);
    return Math.floor((page.height - page.margin.top - y) / (doc.getLineHeight() * 0.3527777778));
  }

  let produceColumn = (columnAvailableLines, data) => {
    let wordsInColumn = []
    let occupiedLines = 0
    for (let word of data) {
      if (occupiedLines + word.gloss.length <= columnAvailableLines) {
        wordsInColumn.push(word);
        occupiedLines += word.gloss.length
      } else { break; }
    }

    return wordsInColumn
  }

  let writePageHeaderFooter = (pageNb, book, chapter, verse) => {
    doc
      .setFont('Times', 'italic')
      .setFontSize(8)
      .text("Lexique du lecteur biblique", page.margin.left, 15);

    doc
      .setFont('Times', 'italic')
      .text(book.toUpperCase() + " " + chapter + "." + verse, page.width - page.margin.right, 15, { align: 'right' });
  }

  let writeChapter = (nb, y) => {
    let string = "CHAPITRE " + nb.toString();
    let xOffset = 210/2 - string.length / 2 // accounting for letter spacing
    doc
      .setFont('Times', 'italic')
      .setFontSize(10)
      .text(string, xOffset, y, {
        align: 'center',
        charSpace: 1
      });
  }

  let writeWord = (word, y, colNb, writeVerseNb) => {
    let columnOffset = colNb*(columnWidth + columnGutter);

    // verse number
    if (writeVerseNb) {
      doc
        .setFont('Helvetica', 'bold')
        .setFontSize(7)
        .text(word.verse.toString(), columnOffset + xTabVerse, y-1, { align: 'right' })
    }

    // lex
    let isHebrew = word.strong[0] === 'H';

    doc
      .setFont('Times New Roman', 'normal')
      .setFontSize(isHebrew ? 13 : 11)
      .setR2L(isHebrew)
      .text(word.lex, columnOffset + xTabLex, y, { maxWidth: 40 })
      .setR2L(false);

    // lex freq
    doc
      .setFontSize(9)
      .text("(" + word.freq + ")", columnOffset + xTabFreq, y);

    // gloss
    doc
      .setFontSize(11)
      .text(word.gloss, columnOffset + xTabGloss, y);

    return
  }

  let getDataTotalLines = (data) => data.reduce((sum, word) => sum + word.gloss.length, 0)

  let splitDataColumns = (words, availableLines) => {
    if (words.length === 1) return [ words, [] ];

    let occupiedLines = 0;
    let columnData = [ [], [] ];

    for (let i = 0; i < words.length; i++) {
      if (occupiedLines < getDataTotalLines(words.slice(i))) {
        columnData[0].push(words[i]);
        occupiedLines += words[i].gloss.length;
      } else {
        columnData[1] = words.slice(i);
        break;
      }
    }

    return columnData;
  }

  // go through all chapters
  for (let currentChapterNb of Object.keys(dataByChap)) {
    let dataToWrite = dataByChap[currentChapterNb];
    let currentVerseNb = 0;

    // write new chapter
    // if there is not enough room to write words below new chapter division, go to next page.
    if (currentY + 30 > page.height - page.margin.bottom) {
      doc.addPage();
      writePageHeaderFooter("X", dataToWrite[0].book, dataToWrite[0].chapter, dataToWrite[0].verse)
      currentY = page.margin.top;
      topColumnY = page.margin.top;
    }
    writeChapter(currentChapterNb, currentY);
    currentY += 10;
    topColumnY = currentY;

    // go through data
    while (dataToWrite.length > 0) {
      let isVerseFirstWord = true;
      let columnAvailableLines = totalColumnAvailableLines(currentY);
      let dataToWriteLines = getDataTotalLines(dataToWrite);

      // if we can fill both columns to the bottom of the page
      if (dataToWriteLines >= 2 * columnAvailableLines) {
        // first column
        let wordsInColumn = produceColumn(columnAvailableLines, dataToWrite);
        dataToWrite = dataToWrite.slice(wordsInColumn.length);

        for (let word of wordsInColumn) {
          writeWord(word, currentY, 0, currentVerseNb !== word.verse);
          currentVerseNb = word.verse;
          currentY += lineHeightToMm(word.gloss.length) + padding; // pt to mm
        }

        // second column
        currentY = topColumnY;
        wordsInColumn = produceColumn(columnAvailableLines, dataToWrite);
        dataToWrite = dataToWrite.slice(wordsInColumn.length);

        for (let word of wordsInColumn) {
          isVerseFirstWord = currentVerseNb !== word.verse
          writeWord(word, currentY, 1, currentVerseNb !== word.verse);
          currentVerseNb = word.verse;
          currentY += lineHeightToMm(word.gloss.length) + padding; // pt to mm
        }

        doc.addPage()
        // write header/footer with correct bible ref
        if (dataToWrite.length > 0) {
          let refChapter = dataToWrite[0].chapter
          let refVerse = dataToWrite[0].verse

          if (dataToWrite[0].verse === currentVerseNb) {
            let nextVerse = dataToWrite.find(word => word.verse !== currentVerseNb)
            refVerse = nextVerse ? nextVerse.verse : 1
            refChapter = refVerse === 1 ? refChapter+1 : refChapter
          }

          // console.log(dataToWrite[0])
          writePageHeaderFooter("X", dataToWrite[0].book, refChapter, refVerse)
        }
        currentY = page.margin.top;
        topColumnY = page.margin.top;
        // currentVerseNb = 0;

      } else { // if we can't, find the middle
        columnAvailableLines = dataToWriteLines/2;
        const columnData = splitDataColumns(dataToWrite, columnAvailableLines);

        // do we want padding to make columns equal height?
        // const linesLeft = getDataTotalLines(columnData[0]);
        // const linesRight = getDataTotalLines(columnData[1]);

        // if (linesLeft > linesRight && columnData[1].length > 1) {
        //   padding = [0, lineHeightToMm(Math.abs(linesLeft - linesRight) / (columnData[1].length - 1))];
        // } else if (linesLeft < linesRight && columnData[0].length > 1) {
        //   padding = [lineHeightToMm(Math.abs(linesLeft - linesRight) / (columnData[0].length - 1)), 0];
        // } else { padding = [ 0, 0 ] }
        // console.log(padding)
        padding = [ 0, 0 ]

        // first column
        for (let word of columnData[0]) {
          writeWord(word, currentY, 0, currentVerseNb !== word.verse);
          currentVerseNb = word.verse;
          currentY += lineHeightToMm(word.gloss.length) + padding[0]; // pt to mm
        }

        let bottomOfColumn = currentY

        // second column
        currentY = topColumnY;

        for (let word of columnData[1]) {
          writeWord(word, currentY, 1, currentVerseNb !== word.verse);
          currentVerseNb = word.verse;
          currentY += lineHeightToMm(word.gloss.length) + padding[1]; // pt to mm
        }

        dataToWrite = [];
        currentY = Math.max(currentY, bottomOfColumn);
        padding = 0;
      }
    }

    currentY += 10;
  }

  let blob = doc.output('blob');

  // return (<iframe title="preview" width="100%" height="500" src={URL.createObjectURL(blob)} ></iframe>);
  return (
    <a href={URL.createObjectURL(blob)} download={data[0].book + " (" + frequency + "+) - Lexique du lecteur biblique.pdf"} className='text-decoration-none d-flex justify-content-end'>
      <Button variant="outline-dark" size="sm"  ><i className="bi bi-file-earmark-arrow-down"></i> Télécharger en PDF</Button>
    </a>
  );
}
