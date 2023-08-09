import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

import styles from './Lexicon.module.css';


function Lexicon({frequency, data}) {
  const [showLexiconCorrectionModal, setShowLexiconCorrectionModal] = React.useState(false);
  const [correctingWord, setCorrectingWord] = React.useState({});

  const handleShowLexiconCorrectionModal = (word) => {
    setCorrectingWord(word);
    setShowLexiconCorrectionModal(true);
  };
  const handleCloseLexiconCorrectionModal = () => setShowLexiconCorrectionModal(false);

  const handleCorrectingWordChange = (e) => {
    setCorrectingWord({
      ...correctingWord,
      gloss: e.target.value
    });
  };

  async function sendLexiconCorrection() {
    console.log("sending new definition for review:", correctingWord.gloss);

    const response = await fetch("/lexique-du-lecteur-biblique/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: 'Test',
        email: 'test@test.com',
        book: correctingWord.book,
        chapter: correctingWord.chapter,
        verse: correctingWord.verse,
        strong: correctingWord.strong,
        corrected_gloss: correctingWord.gloss
      }),
    });

    console.log(response.json())
  };

  const styleLang = data[0].strong[0] === "G"
    ? styles.lexNT
    : styles.lexOT;

  const testament = data[0].strong[0] === 'G'
    ? "le Nouveau Testament"
    : "l'Ancien Testament";

  return (
    <>
      <Modal
        show={showLexiconCorrectionModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton onHide={handleCloseLexiconCorrectionModal}>
          <Modal.Title id="contained-modal-title-vcenter">
            Proposer une modification du mot <span className="lex">{correctingWord.lex}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" id="email" placeholder="name@example.com" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Modifier la définition</Form.Label>
              <Form.Control as="textarea" id="glossInput" rows={3}
                value={correctingWord.gloss}
                onChange={handleCorrectingWordChange}/>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={() => sendLexiconCorrection(document. querySelector('#glossInput').value)}>Envoyer</Button>
          <Button variant="outline-dark" onClick={handleCloseLexiconCorrectionModal}>Annuler</Button>
        </Modal.Footer>
      </Modal>

      <div className={styles.lexicon}>
        <h1 className={styles.lexiconTitle}>{ data[0].book }</h1>
        <h2 className={styles.lexiconSubTitle}>Lexique du lecteur biblique</h2>

        <p className={styles.lexiconFreq}>
          Mots apparaissant moins de {frequency} fois dans {testament}. <br />
          Entre parenthèses figure le nombre d'apparition du mot dans {testament}.
        </p>

        {data.map((word, id, data) => {
          let prevChapter = id > 0 ? data[id-1].chapter : 0;
          let chapHeading = prevChapter !== word.chapter
            ? <h3 className={styles.chapterHeading}>CHAPITRE {word.chapter}</h3>
            : null;

          let prevVerse = id > 0 ? data[id-1].verse : 0;
          let verseIndicator = prevVerse !== word.verse
            ? <span className={styles.verseNb}>{word.verse}</span>
            : null;

          return (
            <div key={id}>
              {chapHeading}
                <div className={styles.wordEntry}>
                  <div className={styles.verseNb}>{verseIndicator}</div>
                  <div className={styleLang} onClick={() => handleShowLexiconCorrectionModal(word)}>{word.lex}</div>
                  <div className={styles.freq}>({word.freq})</div>
                  <div className={styles.gloss}>{word.gloss}</div>
                </div>
            </div>
          )
        })}
      </div>
    </>
  );
}

export default Lexicon;
