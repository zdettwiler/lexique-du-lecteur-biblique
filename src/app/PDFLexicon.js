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
      right: 20,
      left: 20,
      bottom: 20
    }
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

  // constants for column display
  const columnGutter = 10;
  const columnWidth = (page.width - 2*page.margin.left - columnGutter) / 2;

  const xTabVerse = page.margin.left + 0;
  const xTabLex = page.margin.left + 3;
  const xTabFreq = page.margin.left + 27;
  const xTabGloss = page.margin.left + 35;
  let topColumnY = currentY;
  const padding = 0;

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

  let writeChapter = (nb, y) => {
    let string = "CHAPITRE " + nb.toString();
    let xOffset = 210/2 - string.length / 2 // accounting for letter spacing
    doc.setFontSize(10)
      .text(string, xOffset, y, {
        align: 'center',
        charSpace: 1
      });
  }

  let writeWord = (word, y, colNb) => {
    let columnOffset = colNb*(columnWidth + columnGutter);

    // verse number
    doc
      .setFont('Helvetica', 'bold')
      .setFontSize(7)
      .text(word.verse.toString(), columnOffset + xTabVerse, y-1)

    // lex
    doc
      .setFont('Times', 'normal')
      .setFontSize(11)
      .text("hebrew/greek", columnOffset + xTabLex, y, { maxWidth: 40 })

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



  // go through all chapters
  for (let currentChapterNb of Object.keys(dataByChap)) {
    let dataToWrite = dataByChap[currentChapterNb];

    // write new chapter
    // if there is not enough room to write words below new chapter division, go to next page.
    if (currentY + 30 > page.height - page.margin.bottom) {
      doc.addPage()
      currentY = page.margin.top;
      topColumnY = page.margin.top;
    }
    writeChapter(currentChapterNb, currentY);
    currentY += 10;
    topColumnY = currentY;

    // go through data
    while (dataToWrite.length > 0) {
      let columnAvailableLines = totalColumnAvailableLines(currentY);
      let dataToWriteLines = getDataTotalLines(dataToWrite)

      // if we can fill both columns to the bottom of the page
      if (dataToWriteLines >= 2 * columnAvailableLines) {
        // first column
        let wordsInColumn = produceColumn(columnAvailableLines, dataToWrite);
        dataToWrite = dataToWrite.slice(wordsInColumn.length);

        for (let word of wordsInColumn) {
          writeWord(word, currentY, 0)
          currentY += lineHeightToMm(word.gloss.length) + padding; // pt to mm
        }

        // second column
        currentY = topColumnY;
        wordsInColumn = produceColumn(columnAvailableLines, dataToWrite);
        dataToWrite = dataToWrite.slice(wordsInColumn.length);

        for (let word of wordsInColumn) {
          writeWord(word, currentY, 1)
          currentY += lineHeightToMm(word.gloss.length) + padding; // pt to mm
        }

        doc.addPage()
        currentY = page.margin.top;
        topColumnY = page.margin.top;
        // currentColumnNb = 0;

      } else { // if we can't, find the middle
        let wordsInColumn = []
        let occupiedLines = 0
        columnAvailableLines = dataToWriteLines/2

        for (let word of dataToWrite) {
          if (occupiedLines + word.gloss.length <= columnAvailableLines) {
            wordsInColumn.push(word);
            occupiedLines += word.gloss.length
          } else { break; }

          wordsInColumn.push(word);
          occupiedLines += word.gloss.length
        }

        // first column
        for (let word of wordsInColumn) {
          writeWord(word, currentY, 0)
          currentY += lineHeightToMm(word.gloss.length) + padding; // pt to mm
        }

        let bottomOfColumn = currentY

        // second column
        currentY = topColumnY;
        dataToWrite = dataToWrite.slice(wordsInColumn.length);

        for (let word of dataToWrite) {
          writeWord(word, currentY, 1)
          currentY += lineHeightToMm(word.gloss.length) + padding; // pt to mm
        }

        // dataToWrite = dataToWrite.slice(wordsInColumn.length);
        dataToWrite = [];
        currentY = Math.max(currentY, bottomOfColumn);
      }


    }

    currentY += 10;
  }


  // let currentColumnNb = 0;
  // let currentChapterNb = 0;

  // let doneLines = 0






  // // all words in two columns
  // data.forEach(word => {
  //   let splitGloss = doc.splitTextToSize(word.gloss, columnWidth - xTabGloss + page.margin.left)


  //   if (word.chapter !== currentChapterNb) {
  //     currentChapterNb = word.chapter
  //     writeChapter(currentChapterNb, currentY + 20);
  //     currentColumnNb = 0;
  //     currentY += 30;
  //     topColumnY = currentY
  //     console.log("new chapter new top", topColumnY)
  //   }


  //   // check there's enough space below
  //   // check if it's the end of the page
  //   if (currentY + lineHeightToMm(splitGloss.length) > page.height-page.margin.bottom) {
  //     if (currentColumnNb === 0) { // if it's the end of the first column, continue on second
  //       currentColumnNb = 1;
  //       currentY = topColumnY;

  //     } else if (currentColumnNb === 1) {
  //       doc.addPage();
  //       currentY = page.margin.top;
  //       topColumnY = page.margin.top;
  //       currentColumnNb = 0;
  //       linesLeft[word.chapter] -= doneLines;
  //       console.log("end of page new page")
  //     }

  //   } else if ((currentY + lineHeightToMm(splitGloss.length)) > (topColumnY + lineHeightToMm((linesLeft[word.chapter]/2-splitGloss.length)) )) { // check if it's the end of the column
  //     // if it's the end of the first column, go to second
  //     if (currentColumnNb === 0) {
  //       console.log("end of column new column", currentY + lineHeightToMm(splitGloss.length), topColumnY + lineHeightToMm(linesLeft[word.chapter])/2, linesLeft[word.chapter])
  //       currentColumnNb = 1;
  //       currentY = topColumnY;
  //       console.log("new column currentY to top", topColumnY, currentY)

  //     } else if (currentColumnNb === 1) { //currentColumnNb === 1) { // if it's the end of the second, it's the end of the chapter
  //       currentY += 30
  //       currentColumnNb = 0;
  //       console.log("end of column end of chapter")
  //     }
  //   }

  //   let columnOffset = currentColumnNb*(columnWidth + columnGutter);

  //   // verse number
  //   doc
  //     .setFont('Helvetica', 'bold')
  //     .setFontSize(7)
  //     .text(word.verse.toString(), columnOffset + xTabVerse, currentY-1)

  //   // lex
  //   doc
  //     .setFont('Times', 'normal')
  //     .setFontSize(11)
  //     .text("hebrew/greek", columnOffset + xTabLex, currentY, { maxWidth: 40 })

  //   // lex freq
  //   doc
  //     .setFontSize(9)
  //     .text("(" + word.freq + ")", columnOffset + xTabFreq, currentY);

  //   // gloss
  //   doc
  //     .setFontSize(11)
  //     .text(splitGloss, columnOffset + xTabGloss, currentY);

  //   currentY += lineHeightToMm(splitGloss.length) + padding; // pt to mm
  //   doneLines += splitGloss.length

    // check if it's the end of the page
    // if (currentY > (page.height - page.margin.top)) {
    //   if (currentColumnNb === 0) {
    //     currentColumnNb = 1;
    //     currentY = topColumnY;

    //   } else if (currentColumnNb === 1) {
    //     doc.addPage();
    //     linesLeft[currentChapterNb] = linesLeft[currentChapterNb] - (2 * (currentY - topColumnY)+20)
    //     currentY = page.margin.top;
    //     topColumnY = page.margin.top;
    //     currentColumnNb = 0;
    //     console.log("new page")
    //   }

    // } else if (currentY > topColumnY + linesLeft[word.chapter]/2) { // check if it's the end of the column
    //   console.log("new column", word.chapter, word.verse, currentY, topColumnY + linesLeft[word.chapter]/2)
    //   if (currentColumnNb === 0) { // if it's the end of the first column, go to second
    //     currentColumnNb = 1;
    //     currentY = topColumnY;

    //   } else if (currentColumnNb === 1) { // if it's the end of the second, it's the end of the chapter
    //     console.log("end chapter")
    //     currentY += 30
    //     currentColumnNb = 0;
    //   }
    // }


  // });

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
