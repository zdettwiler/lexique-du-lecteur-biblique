import { useState } from 'react';
import './App.css';
import { createLexicon, otBooks } from './createLexicon'
import {
  Container,
  Toast,
  Button,
  Form,
  Row,
  Col
 } from 'react-bootstrap';
import { usePDF, PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import ReactPDF from '@react-pdf/renderer';

import Lexicon from './Lexicon'

function App() {
  const [book, setBook] = useState('Genèse');
  const [frequency, setFrequency] = useState(50);
  const [lexicon, setLexicon] = useState([]);

  function handleChangeBook(e) {
    setBook(e.target.value);
  }

  function handleChangeFrequency(e) {
    setFrequency(e.target.value);
  }

  async function getBook(e) {
    e.preventDefault();
    let data = await createLexicon(book, frequency);
    setLexicon(data);
    console.log(book, frequency)
  }
  

  return (
    <Container className="p-5">
      <Container className="p-5 mb-4 bg-light rounded-3">
        <h1 className="header">📖 Lexique du Lecteur Biblique</h1>
        
        <Form className="mt-3">
            <Row>
              <Form.Label column lg={1}>
                Fréquence
              </Form.Label>
              <Col>
                <Form.Control type="number" placeholder="50" onChange={handleChangeFrequency}/>
              </Col>

              <Form.Label column lg={1}>
                Livre
              </Form.Label>
              <Col>
                  <Form.Select aria-label="Default select example" value={book} onChange={handleChangeBook}>
                    <option>Choisir le livre</option>
                    { otBooks.map((book, id) => (
                      <option value={book} key={id}>{book}</option>
                    ))}
                  </Form.Select>
              </Col>

              <Col>
                <Button variant="primary" type="submit" onClick={getBook}>
                  Génerer le lexique
                </Button>
              </Col>
            </Row>
                       
        </Form>
      </Container>

      { lexicon.length ? (
        <PDFViewer style={{ width: '100%' }} >
          <Lexicon
            data={lexicon}
          />
        </PDFViewer>
      ) : (<p></p>) }
    </Container>    
  );  
}

export default App;
