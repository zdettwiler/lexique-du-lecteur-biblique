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
  InputGroup,
  Dropdown,
  Spinner
 } from 'react-bootstrap';
import Script from 'next/script';

import Lexicon from './Lexicon';
import PDFLexicon from './PDFLexicon';
import * as ga from './ga.js';

export default function Home() {
  const [isGeneratingPDF, setIsGeneratingPDF] = React.useState(false);
  const [book, setBook] = React.useState('Genèse');
  const [chapter, setChapter] = React.useState([]);
  const [frequency, setFrequency] = React.useState(70);
  const [lexicon, setLexicon] = React.useState([]);

  function handleChangeBook(e) {
    setBook(e.target.value);
    setLexicon([]);
  }

  function handleChangeChapter(e) {
    setChapter(e.target.value);
    setLexicon([]);
  }

  function handleChangeFrequency(e) {
    setFrequency(e.target.value);
    setLexicon([]);
  }

  async function getBook(e) {
    e.preventDefault();
    ga.event({
      action: "make_lexicon",
      params : {
        book,
        frequency
      }
    });

    setLexicon([]);
    setIsGeneratingPDF(true);
    let data = await createLexicon(book, chapter, frequency);
    setLexicon(data);
    setIsGeneratingPDF(false);
    // setViewPdf(true)
  }


  return (
    <Container fluid="sm">
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-5Q8NE1RT7F" />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-5Q8NE1RT7F');
        `}
      </Script>

      <Container className="p-5 pb-2 mb-4 bg-white rounded-3" fluid>
        <p className="chirho">📓</p>{/* ☧ */}
        <h1 className="header">Lexique du lecteur biblique</h1>
        <p className="description">Lexique verset par verset pour le lecteur de la Bible dans ses langues originales.</p>

        <Form className="mt-10 mb-4">
          <Row className="mb-3 align-items-end d-flex justify-content-center">
            <Col xs={8} lg={3} className="mb-3" >
              <Form.Label>Livre</Form.Label>
              <Form.Select aria-label="Book selection" value={book} onChange={handleChangeBook}>
                <option>Choisir le livre</option>
                { bookOptions.map((book, id) => (
                  <option value={book} key={id}>{book}</option>
                ))}
              </Form.Select>
            </Col>

            <Col xs={4} lg={1} className="mb-3" >
              <Form.Label>Chapitres</Form.Label>
              <Form.Control aria-label="Selectionner les chapitres" value={chapter} onChange={handleChangeChapter}>
              </Form.Control>
            </Col>

            <Col xs={12} lg={4} className="mb-3" >
              <Form.Label>Fréquence des mots dans le testament</Form.Label>
              <Form.Select aria-label="Frequency selection" value={frequency} onChange={handleChangeFrequency}>
                { [
                    { text: "Débutant (<150x)", value: 150 },
                    { text: "Intermédiaire (<70x)", value: 70 },
                    { text: "Connaisseur (<50x)", value: 50 },
                    { text: "Expérimenté (<30x)", value: 30 },
                    { text: "Expert (<10x)", value: 10 },
                  ].map((option, id) => (
                  <option value={option.value} key={id}>{option.text}</option>
                ))}
              </Form.Select>
              {/* <Form.Control type="number" value={frequency} onChange={handleChangeFrequency}/> */}
            </Col>

            <Col xs="auto" className="d-flex align-items-baseline mb-3">
              <Button variant="dark" type="submit" onClick={getBook}>
                Génerer le lexique
              </Button>
            </Col>
          </Row>


        </Form>

        { !!lexicon.length && (
          <Alert variant="light">
            <Alert.Heading>📌 Lexique créé!</Alert.Heading>
            <p><b>{lexicon.length}</b> des mots du livre de <b>{book}</b> apparaissent moins de <b>{frequency}</b> fois dans { lexicon[0].strong[0] === 'G' ? "le Nouveau Testament" : "l'Ancien Testament" }.</p>
            <PDFLexicon frequency={frequency} data={lexicon} />
          </Alert>
        )}
      </Container>

      { isGeneratingPDF && (
        <Spinner id="loading-spinner" animation="border" />
      )}

      { !!lexicon.length && (
        // <PDFLexicon frequency={frequency} data={lexicon} />
        <Lexicon frequency={frequency} data={lexicon} />
      )}
    </Container>
  );
}
