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
  Collapse,
  Stack
 } from 'react-bootstrap';
import Script from 'next/script';

import Lexicon from './Lexicon';
import PDFLexicon from './PDFLexicon';
import * as ga from './ga.js';

export default function Home() {
  const [isGeneratingPDF, setIsGeneratingPDF] = React.useState(false);
  const [book, setBook] = React.useState('Jonas');
  const [chapter, setChapter] = React.useState("");
  const [chooseChapters, setChooseChapters] = React.useState(false);
  const [frequency, setFrequency] = React.useState(70);
  const [lexicon, setLexicon] = React.useState([]);

  function handleChangeBook(e) {
    setBook(e.target.value);
    setChapter("");
    setChooseChapters(false);
    setLexicon([]);
  }

  function handleChangeChooseChapters() {
    setChooseChapters(!chooseChapters);
    if (!chooseChapters) {
      setChapter("");
    }
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
        chapter: chapter !== "" ? book + " " + chapter : undefined,
        frequency
      }
    });

    setLexicon([]);
    setIsGeneratingPDF(true);
    let data = await createLexicon(book, chooseChapters ? chapter : "", frequency);
    setLexicon(data);
    setIsGeneratingPDF(false);
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
            <Col xs={12} lg={4} className="mb-3" >
              <Form.Label className="d-flex justify-content-between" style={{ width: "100%" }}>Livre
                <span style={{ fontSize: "14px" }}>
                  <Form.Check
                    type="switch"
                    inline
                    id="custom-switch"
                    label="Choisir les chs."
                    checked={chooseChapters}
                    onChange={handleChangeChooseChapters}
                  />
                  <OverlayTrigger
                    key="top"
                    placement="top"
                    overlay={
                      <Popover id="popover-basic">
                        <Popover.Header as="h3">Sélection des chapitres</Popover.Header>
                        <Popover.Body>
                          Indiquer les chapitres désirés, séparés par une virgule. Pour des sections, séparer d'un tiret.<br/>
                          P. ex. pour les chapitres 1, 3 et 7 noter: <strong>1,3,7</strong>. Pour les chapitres 1 et 5 à 8 noter: <strong>1,5-8</strong>.
                        </Popover.Body>
                      </Popover>
                    }
                  >
                    <i className="bi bi-info-circle"></i>
                  </OverlayTrigger>
                </span>
              </Form.Label>

              <Stack direction="horizontal" gap={2} style={{ height: "38px" }}>
                <Form.Select aria-label="Book selection" value={book} onChange={handleChangeBook}>
                  { bookOptions.map((book, id) => (
                    book.label
                      ? <optgroup label={book.label} key={id}></optgroup>
                      : <option value={book} key={id}>{book}</option>
                  ))}
                </Form.Select>

                <Collapse in={chooseChapters} dimension="width">
                  <div>
                    <Form.Control
                      value={chapter}
                      onChange={handleChangeChapter}
                      disabled={!chooseChapters}
                      type="text"
                      placeholder="Chapitres"
                      aria-label="Selectionner les chapitres"
                    >
                    </Form.Control>
                  </div>
                </Collapse>
              </Stack>


            </Col>



            <Col xs={12} lg={3} className="mb-3" >
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

            <Col xs="auto" lg="auto" className="d-flex align-items-baseline mb-3">
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
