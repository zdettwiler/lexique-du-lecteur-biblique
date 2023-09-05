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
  OverlayTrigger,
  Popover,
  Spinner,
  InputGroup,
  Stack
 } from 'react-bootstrap';
import Script from 'next/script';

import Lexicon from './Lexicon';
import PDFLexicon from './PDFLexicon';
import * as ga from './ga.js';

export default function Home() {
  const [isGeneratingPDF, setIsGeneratingPDF] = React.useState(false);
  const [book, setBook] = React.useState('Genèse');
  const [chapters, setChapters] = React.useState("");
  const [frequency, setFrequency] = React.useState(70);
  const [lexicon, setLexicon] = React.useState([]);

  function handleChangeBook(e) {
    setBook(e.target.value);
    setChapters("");
    setLexicon([]);
  }

  function handleChangeChapters(e) {
    setChapters(e.target.value);
    setLexicon([]);
  }

  function handleClickClearChapters() {
    setChapters("");
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
        chapters: chapters !== "" ? book + " " + chapters : "tous",
        frequency
      }
    });

    setLexicon([]);
    setIsGeneratingPDF(true);
    let data = await createLexicon(book, chapters, frequency);
    setLexicon(data);
    setIsGeneratingPDF(false);
  }


  return (
    <Container fluid="sm">
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga.GA_TRACKING_ID}`} />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${ga.GA_TRACKING_ID}');
        `}
      </Script>


        <p className="logo">📓</p>{/* ☧ */}
        <h1 className="header">Lexique du lecteur biblique</h1>
        <p className="description">Lexique verset par verset pour le lecteur de la Bible dans ses langues originales.</p>

      <Container className="p-3 pb-2 mb-4 bg-white rounded-3">
        <Form className="mt-10 mb-4">
          <Row className="mb-3 align-items-end d-flex justify-content-center">

            <Col xs={7} lg={3} className="mb-3" >
              <Form.Label className="d-flex justify-content-between">Livre</Form.Label>
              <Form.Select aria-label="Book selection" value={book} onChange={handleChangeBook}>
                { bookOptions.map((book, id) => (
                  book.label
                    ? <optgroup label={book.label} key={id}></optgroup>
                    : <option value={book} key={id}>{book}</option>
                ))}
              </Form.Select>
            </Col>

            <Col xs={5} lg={2} className="mb-3" >
                <Form.Label>Chapitres <OverlayTrigger
                    key="top"
                    placement="top"
                    overlay={
                      <Popover id="popover-basic">
                        <Popover.Header as="h3">Sélection des chapitres</Popover.Header>
                        <Popover.Body>
                          Indiquer les chapitres désirés, séparés par une virgule. Pour des sections, séparer d'un tiret.<br/>
                          P. ex. pour les chapitres 1, 3 et 7 noter: <strong>1,3,7</strong>. Pour les chapitres 1 et 5 à 8 noter: <strong>1,5-8</strong>.<br/>
                          Pour sélectionner tous les chapitres, laisser le champ vide.
                        </Popover.Body>
                      </Popover>
                    }
                  ><i className="bi bi-info-circle"></i></OverlayTrigger>
                </Form.Label>

                <InputGroup>
                  <Form.Control
                    value={chapters}
                    onChange={handleChangeChapters}
                    type="text"
                    placeholder="tous"
                    aria-label="Selectionner les chapitres"
                    className="clear-chapters-input-button"
                  ></Form.Control>
                  { chapters !== "" && (
                  <Button onClick={handleClickClearChapters} className="clear-chapters-input-button">
                    <i className="bi bi-x-circle-fill"></i>
                  </Button>
                  )}
                </InputGroup>
            </Col>

            <Col xs={12} lg={3} className="mb-3" >
              <Form.Label>Fréq. des mots dans le testament</Form.Label>
              <Form.Select aria-label="Frequency selection" value={frequency} onChange={handleChangeFrequency}>
                { [
                    { text: "Étudiant raté (<1000x)", value: 1000 },
                    { text: "Débutant (<150x)", value: 150 },
                    { text: "Intermédiaire (<70x)", value: 70 },
                    { text: "Connaisseur (<50x)", value: 50 },
                    { text: "Expérimenté (<30x)", value: 30 },
                    { text: "Expert (<10x)", value: 10 },
                  ].map((option, id) => (
                  <option value={option.value} key={id}>{option.text}</option>
                ))}
              </Form.Select>
            </Col>

            <Col xs="auto" lg="auto" className="d-flex align-items-baseline mb-3">
              <Button variant="dark" type="submit" onClick={getBook}>
                Générer le lexique
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
