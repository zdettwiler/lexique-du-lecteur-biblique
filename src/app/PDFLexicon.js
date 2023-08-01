import React from 'react';
import { jsPDF } from "jspdf";



function PDFLexicon({frequency, data}) {
  // https://db.onlinewebfonts.com/t/32441506567156636049eb850b53f02a.ttf

  const doc = new jsPDF();
  const page = {
    height: doc.internal.pageSize.getHeight(),
    width: doc.internal.pageSize.getWidth(),
    margin: {
      top: 20,
      left: 20
    }
  }


  function printChapter(nb, y) {
    let string = "CHAPITRE " + nb.toString();
    let xOffset = 210/2 - string.length / 2 // accounting for letter spacing
    doc.setFontSize(10)
      .text(string, xOffset, y, {
        align: 'center',
        charSpace: 1
      });
  }

  // book title
  doc
    .setFont('Times')
    .setFontSize(30);

  let string = data[0].book.toUpperCase();
  let xOffset = 210/2 - ((string.length-1) * 3 / 2) // accounting for letter spacing
  doc.text(string, 210/2 - ((string.length-1) * 3 / 2), page.margin.top, {
    align: 'center',
    charSpace: 3
  });

  // Lexique du lecteur biblique
  string = "LEXIQUE DU LECTEUR BIBLIQUE";
  xOffset = 210/2 - ((string.length-1) * 1 / 2) // accounting for letter spacing
  doc.setFontSize(9)
    .text(string, xOffset, 25, {
      align: 'center',
      charSpace: 1
    });

  // Mots apparaissant moins de X fois dans le Testament
  let testament = data[0].strong[0] === 'G'
    ? "le Nouveau Testament"
    : "l'Ancien Testament";
  string = "Mots apparaissant moins de " + frequency + " fois dans " + testament + ".";
  xOffset = 210/2
  doc.setFontSize(9)
    .text(string, xOffset, 35, {
      align: 'center'
    });

  let currentY = 50;

  // print chapter
  printChapter(1, currentY);
  currentY += 10;

  // two-column layout
  // doc.internal.getLineHeight()
  const columnGutter = 10;
  const columnWidth = (page.width - 2*page.margin.left - columnGutter) / 2;

  const xTabVerse = page.margin.left + 0;
  const xTabLex = page.margin.left + 3;
  const xTabFreq = page.margin.left + 27;
  const xTabGloss = page.margin.left + 35;
  let topColumnY = currentY;
  const padding = 1;

  // need to determine number of lines per chapter in order to make columns
  let colHeights = data.reduce((acc, cur) => {
    if (acc[cur.chapter]) {
      acc[cur.chapter] += doc.splitTextToSize(cur.gloss, columnWidth - xTabGloss + page.margin.left).length * (doc.getLineHeight() * 0.3527777778 + padding)
    } else {
      acc[cur.chapter] = doc.splitTextToSize(cur.gloss, columnWidth - xTabGloss + page.margin.left).length * (doc.getLineHeight() * 0.3527777778 + padding)
    }

    return acc;
  }, {})
  console.log(colHeights)

  let currentColumnNb = 0;
  let currentChapterNb = 1

  // all words in two columns
  data.forEach(word => {
    let splitGloss = doc.splitTextToSize(word.gloss, columnWidth - xTabGloss + page.margin.left)
    let columnOffset = currentColumnNb*(columnWidth + columnGutter);

    if (word.chapter !== currentChapterNb) {
      currentChapterNb = word.chapter
      printChapter(currentChapterNb, currentY + 10);
      currentColumnNb = 0;
      topColumnY = currentY + 20;
    }

    // verse number
    doc
      .setFont('Helvetica', 'bold')
      .setFontSize(7)
      .text(word.verse.toString(), columnOffset + xTabVerse, currentY-1)

    // lex
    doc
      .setFont('Times', 'normal')
      .setFontSize(11)
      .text("hebrew/greek", columnOffset + xTabLex, currentY, { maxWidth: 40 })

    // lex freq
    doc
      .setFontSize(9)
      .text("(" + word.freq + ")", columnOffset + xTabFreq, currentY);

    // gloss
    doc
      .setFontSize(11)
      .text(splitGloss, columnOffset + xTabGloss, currentY);

    currentY += splitGloss.length * doc.getLineHeight() * 0.3527777778 + padding; // pt to mm

    // check if it's the end of the page
    if (currentY > (page.height - page.margin.top)) {
      if (currentColumnNb === 0) {
        currentColumnNb = 1;
        currentY = topColumnY;

      } else if (currentColumnNb === 1) {
        doc.addPage();
        colHeights[currentChapterNb] = colHeights[currentChapterNb] - (2 * (currentY - topColumnY)+20)
        currentY = page.margin.top;
        topColumnY = page.margin.top;
        currentColumnNb = 0;
        console.log(colHeights)
      }
    } else if (currentY > topColumnY + colHeights[word.chapter]/2) { // check if it's the end of the column
      console.log("new column", word.chapter, word.verse, currentY, topColumnY + colHeights[word.chapter]/2)
      if (currentColumnNb === 0) { // if it's the end of the first column, go to second
        currentColumnNb = 1;
        currentY = topColumnY;

      } else if (currentColumnNb === 1) { // if it's the end of the second, it's the end of the chapter
        console.log("end chapter")
        currentY += 30
      }
    }


  });

  // doc.save("a4.pdf");


  // doc.addHTML(element, function () {
  //     var blob = pdf.output('blob');
  // });

  let blob = doc.output('blob');
  console.log(blob)
  // URL.createObjectURL(document.output("blob")

  return (<iframe title="preview" width="100%" height="500" src={URL.createObjectURL(blob)} ></iframe>);
}

export default PDFLexicon;
