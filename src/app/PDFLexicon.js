import React from 'react';
import { jsPDF } from "jspdf";



function PDFLexicon({frequency, data}) {
  // Font.register({
  //   family: 'TimesNewRoman',
  //   fonts: [{
  //     src: 'https://db.onlinewebfonts.com/t/32441506567156636049eb850b53f02a.ttf',
  //     fontStyle: 'normal',
  //     // fontWeight: 400
  //   }]
  // });


  // Default export is a4 paper, portrait, using millimeters for units
  const doc = new jsPDF();

  doc.text("Hello world!", 10, 10);
  // doc.save("a4.pdf");


  // doc.addHTML(element, function () {
  //     var blob = pdf.output('blob');
  // });

  let blob = doc.output('blob');
  console.log(blob)
  // URL.createObjectURL(document.output("blob")

  return (<iframe title="preview" width="600" height="775" src={URL.createObjectURL(blob)} ></iframe>);
}

export default PDFLexicon;
