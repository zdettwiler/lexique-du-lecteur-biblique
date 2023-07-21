'use client';
import Link from 'next/link'
import React from 'react';
import { createLexicon, otBooksOptions } from './createLexicon'
import {
  Container,
  Alert,
  Button,
  Form,
  Row,
  Col,
  Spinner,
  Navbar
 } from 'react-bootstrap';
import { PDFViewer } from '@react-pdf/renderer';

import Lexicon from './Lexicon'
import PDFLexicon from './PDFLexicon'

export default function Home() {
  // const [instance, updateInstance] = usePDF({ document: Lexicon });
  const [isGeneratingPDF, setIsGeneratingPDF] = React.useState(false);
  const [book, setBook] = React.useState('Amos');
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
    setIsGeneratingPDF(true);
    let data = await createLexicon(book, frequency);
    setLexicon(data);
    setIsGeneratingPDF(false);
    // setViewPdf(true)
  }


  return !viewPdf ? (
    <Container className="p-5">
      <Container className="p-5 pb-2 mb-4 bg-light rounded-3">
        <h1 className="header">📖 Lexique du lecteur biblique</h1>

        <Form className="mt-3 mb-4">
          <Row className="mb-3 align-items-end">
            <Col xs="auto">
              <Form.Label>Livre</Form.Label>
              <Form.Select aria-label="Book selection" value={book} onChange={handleChangeBook}>
                  <option>Choisir le livre</option>
                  { otBooksOptions.map((book, id) => (
                    <option value={book} key={id}>{book}</option>
                  ))}
                </Form.Select>
            </Col>

            <Col xs="auto">
              <Form.Label>Mots apparaissant moins de</Form.Label>
              <Form.Control type="number" placeholder="50" onChange={handleChangeFrequency}/>
            </Col>

            <Col xs="auto" className="d-flex align-items-baseline">
              <Button variant="primary" type="submit" onClick={getBook}>
                <i class="bi bi-lightning"></i> Génerer le lexique
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

      { false && !!lexicon.length && (
        <Lexicon data={lexicon} />
      )}

      { !!lexicon.length && (
        <PDFViewer style={{ width: '100%', height: '100%', minHeight: '500px' }} >
          <PDFLexicon
            data={lexicon}
          />
        </PDFViewer>
      )}



    </Container>
  ) : (
    <>
    <Navbar className="bg-body-tertiary">
        <Container>
          {/* <Navbar.Brand href="#home">Brand link</Navbar.Brand> */}
          <h1 className="header">📖 Lexique du lecteur biblique</h1>
        </Container>
      </Navbar>

    { !!lexicon.length && (
      <PDFViewer style={{ position: 'absolute', width: '100%', height: '100%' }} >
        <PDFLexicon
          data={lexicon}
        />
      </PDFViewer>
    )}
    </>
  );
}
