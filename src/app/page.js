'use client';
import React from 'react';
import { createLexicon, otBooksOptions } from './createLexicon'
import {
  Container,
  Alert,
  Button,
  Form,
  Row,
  Col,
  Spinner
 } from 'react-bootstrap';
import { PDFViewer } from '@react-pdf/renderer';

import Lexicon from './Lexicon'
import PDFLexicon from './PDFLexicon'

export default function Home() {
  // const [instance, updateInstance] = usePDF({ document: Lexicon });
  const [isGeneratingPDF, setIsGeneratingPDF] = React.useState(false);
  const [book, setBook] = React.useState('Genèse');
  const [frequency, setFrequency] = React.useState(50);
  const [lexicon, setLexicon] = React.useState([]);

  function handleChangeBook(e) {
    setBook(e.target.value);
    setLexicon([]);
  }

  function handleChangeFrequency(e) {
    setFrequency(e.target.value);
    setLexicon([]);
  }

  async function getBook(e) {
    e.preventDefault();
    setIsGeneratingPDF(true);
    let data = await createLexicon(book, frequency);
    setLexicon(data);
    setIsGeneratingPDF(false);
  }


  return (
    <Container className="p-5">
      <Container className="p-5 pb-2 mb-4 bg-light rounded-3">
        <h1 className="header">📖 Lexique du lecteur biblique</h1>
        
        <Form className="mt-3 mb-4">
            <Row>
              <Form.Label column lg={1}>
                Livre
              </Form.Label>
              <Col>
                  <Form.Select aria-label="Default select example" value={book} onChange={handleChangeBook}>
                    <option>Choisir le livre</option>
                    { otBooksOptions.map((book, id) => (
                      <option value={book} key={id}>{book}</option>
                    ))}
                  </Form.Select>
              </Col>
              
              <Form.Label column lg={1}>
                Fréquence
              </Form.Label>
              <Col>
                <Form.Control type="number" placeholder="50" onChange={handleChangeFrequency}/>
              </Col>

              <Col>
                <Button variant="primary" type="submit" onClick={getBook}>
                  Génerer le lexique
                </Button>
              </Col>
            </Row>        
        </Form>

        { !!lexicon.length && (
          <Alert variant={'info'}>
            Lexique créé! <b>{lexicon.length}</b> des mots du livre de <b>{book}</b> apparaissent moins de <b>{frequency}</b> fois dans l'Ancien Testament.
          </Alert>
        )}
      </Container>

      { isGeneratingPDF && (
        <Spinner className="text-center" animation="border" />
      )}

      { !!lexicon.length && (
        <Lexicon data={lexicon} />
      )}

      { false && !!lexicon.length && (
        <PDFViewer style={{ width: '100%' }} >
          <PDFLexicon
            data={lexicon}
          />
        </PDFViewer>
      )}
    </Container>
  )
}
