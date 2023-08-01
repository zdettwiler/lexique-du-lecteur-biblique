'use client';
import React from 'react';
import { createLexicon, bookOptions } from './createLexicon'
import {
  Container,
  Alert,
  Button,
  Form,
  Row,
  Col,
  DropdownButton,
  Dropdown,
  Spinner,
  Navbar,
  Tab,
  Tabs
 } from 'react-bootstrap';
import { usePDF, PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';

import Lexicon from './Lexicon'
import PDFLexicon from './PDFLexicon'

export default function Home() {
  // const [instance, updateInstance] = usePDF({ document: PDFLexicon });
  const [isGeneratingPDF, setIsGeneratingPDF] = React.useState(false);
  const [book, setBook] = React.useState('Jonas');
  const [frequency, setFrequency] = React.useState(50);
  const [lexicon, setLexicon] = React.useState([]);
  const [viewPdf, setViewPdf] = React.useState(false);

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
    setLexicon([]);
    setIsGeneratingPDF(true);
    let data = await createLexicon(book, frequency);
    setLexicon(data);
    setIsGeneratingPDF(false);
    // setViewPdf(true)
  }


  return (
    <Container className="p-5">
      <Container className="p-5 pb-2 mb-4 bg-light rounded-3">
        <h1 className="header">📖 Lexique du lecteur biblique</h1>

        <Form className="mt-3 mb-4">
          <Row className="mb-3 align-items-end">
            <Col xs="auto">
              <Form.Label>Livre</Form.Label>
              <Form.Select aria-label="Book selection" value={book} onChange={handleChangeBook}>
                  <option>Choisir le livre</option>
                  { bookOptions.map((book, id) => (
                    <option value={book} key={id}>{book}</option>
                  ))}
                </Form.Select>
            </Col>

            <Col xs="auto">
              <Form.Label>Mots apparaissant moins de</Form.Label>
              <Form.Control type="number" value={frequency} onChange={handleChangeFrequency}/>
            </Col>

            <Col xs="auto" className="d-flex align-items-baseline">
              <Button variant="primary" type="submit" onClick={getBook}>
                Génerer le lexique
              </Button>
            </Col>
          </Row>


        </Form>

        { !!lexicon.length && (
          <Alert variant={'info'}>
            <Alert.Heading>🚀 Lexique créé!</Alert.Heading>
            <p><b>{lexicon.length}</b> des mots du livre de <b>{book}</b> apparaissent moins de <b>{frequency}</b> fois dans l'Ancien Testament.</p>
          </Alert>
        )}
      </Container>

      { isGeneratingPDF && (
        <Spinner className="text-center" animation="border" style={{ position: 'fixed', left: '50%' }} />
      )}

      { !!lexicon.length && (
        <PDFLexicon frequency={frequency} data={lexicon} />
        // <Lexicon frequency={frequency} data={lexicon} />
      )}
    </Container>
  );
}
