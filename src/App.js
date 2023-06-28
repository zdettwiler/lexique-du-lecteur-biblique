import { useState } from 'react';
import './App.css';
import { createLexicon, otBooks } from './createLexicon'
import {
  Container,
  Toast,
  Button,
  Form
 } from 'react-bootstrap';
import { usePDF, PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import ReactPDF from '@react-pdf/renderer';

import Lexicon from './Lexicon'

function App() {
  const [book, setBook] = useState('Genèse');
  const [frequency, setFrequency] = useState(50);

  function handleChangeBook(e) {
    setBook(e.target.value);
  }

  function getBook() {
    createLexicon(book);
  }
  

  
// <PDFViewer style={{ width: window.innerWidth, height: window.innerHeight }} >
//   <Lexicon
//     data={data}
//   />
// </PDFViewer>


  return (
    <Container className="p-3">
      <Container className="p-5 mb-4 bg-light rounded-3">
        <h1 className="header">📖 Lexique du Lecteur Biblique</h1>
        
          We now have Toasts <span role="img" aria-label="tada">🎉</span>

          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Fréquence des mots connus</Form.Label>
              <Form.Control type="email" placeholder="name@example.com" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label>Livre: </Form.Label>
              <Form.Select aria-label="Default select example">
                <option>Choisir le livre</option>
                { otBooks.map((book, id) => (
                  <option value={book} key={id}>{book}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit">
              Génerer le lexique
            </Button>
          </Form>
      </Container>
    </Container>    
  );
}

export default App;
