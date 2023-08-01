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

  console.log(doc.getLineHeight(), data)

  function printChapter(nb, y) {
    let string = "CHAPITRE " + nb;
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

  const xTabVerse = page.margin.left + 0
  const xTabLex = page.margin.left + 3
  const xTabFreq = page.margin.left + 27
  const xTabGloss = page.margin.left + 35
  const yChapter = currentY


  data.forEach(word => {
    let splitGloss = doc.splitTextToSize(word.gloss, columnWidth - xTabGloss + page.margin.left)

    // verse number
    doc
      .setFont('Helvetica', 'bold')
      .setFontSize(7)
      .text(word.verse, xTabVerse, currentY-1)

    // lex
    doc
      .setFont('Times', 'normal')
      .setFontSize(11)
      .text("HEB", xTabLex, currentY, { maxWidth: 40 })

    // lex freq
    doc
      .setFontSize(9)
      .text("(" + word.freq + ")", xTabFreq, currentY);

    // gloss
    doc
      .setFontSize(11)
      .text(splitGloss, xTabGloss, currentY);

    currentY += splitGloss.length * doc.getLineHeight() * 0.3527777778 + 3; // pt to mm

    if (currentY > (page.height - page.margin.top)) {
      doc.addPage()
      currentY = page.margin.top
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
