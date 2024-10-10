import React from 'react'
import { Modal, Button, Form, Row, Col, Container, Spinner, Alert } from 'react-bootstrap'
import styles from './Lexicon.module.css'

function Lexicon ({ frequency, data }) {
  const [showLexiconCorrectionModal, setShowLexiconCorrectionModal] = React.useState(false)
  const [correctorName, setCorrectorName] = React.useState(localStorage.getItem('name') || '')
  const [correctorEmail, setCorrectorEmail] = React.useState(localStorage.getItem('email') || '')
  const [correctingWord, setCorrectingWord] = React.useState({})
  const [isSendingCorrection, setIsSendingCorrection] = React.useState(false)
  const [correctionStatus, setCorrectionStatus] = React.useState(false)
  const [validatedCorrectionForm, setValidatedCorrectionForm] = React.useState(false)

  const handleShowLexiconCorrectionModal = (word) => {
    setCorrectingWord(word)
    setIsSendingCorrection(false)
    setCorrectionStatus(false)
    setShowLexiconCorrectionModal(true)
  }
  const handleCloseLexiconCorrectionModal = () => setShowLexiconCorrectionModal(false)

  const handleCorrectingWordChange = (e) => {
    setCorrectingWord({
      ...correctingWord,
      gloss: e.target.value
    })
  }

  const handleSubmit = (event) => {
    const form = document.querySelector('form#correction')
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    } else {
      sendLexiconCorrection()
    }
    setValidatedCorrectionForm(true)
  }

  async function sendLexiconCorrection () {
    setIsSendingCorrection(true)

    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: correctorName,
        email: correctorEmail,
        book: correctingWord.book,
        chapter: correctingWord.chapter,
        verse: correctingWord.verse,
        strong: correctingWord.strong,
        lex: correctingWord.lex,
        corrected_gloss: correctingWord.gloss
      })
    })

    localStorage.setItem('name', correctorName)
    localStorage.setItem('email', correctorEmail)
    setCorrectionStatus(response.status)
    setIsSendingCorrection(false)
  };

  const styleLang = data[0].strong[0] === 'G'
    ? styles.lexNT
    : styles.lexOT

  const testament = data[0].strong[0] === 'G'
    ? 'le Nouveau Testament'
    : "l'Ancien Testament"

  return (
    <>
      <Modal
        show={showLexiconCorrectionModal}
        size='lg'
        aria-labelledby='contained-modal-title-vcenter'
        centered
      >
        <Modal.Header closeButton onHide={handleCloseLexiconCorrectionModal}>
          <Modal.Title id='contained-modal-title-vcenter'>
            Proposer une modification du mot <span className='lex'>{correctingWord.lex}</span> ({correctingWord.strong})
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {correctionStatus === 201 && (
            <Alert variant='success'>
              <i className='bi bi-check2' /> Bien reçu! Merci pour votre contribution au LLB!
            </Alert>
          )}

          {correctionStatus === 500 && (
            <Alert variant='danger'>
              <i className='bi bi-x-lg' /> Oups! Ça n'a pas marché...
            </Alert>
          )}

          {!correctionStatus && (
            <Form id='correction' validated={validatedCorrectionForm}>
              <Row>
                <Col>
                  <Form.Group className='mb-3'>
                    <Form.Label>Nom</Form.Label>
                    <Form.Control
                      required type='text' id='name' placeholder='Nom'
                      value={correctorName}
                      onChange={(e) => setCorrectorName(e.target.value)}
                      disabled={isSendingCorrection}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className='mb-3'>
                    <Form.Label>Adresse courriel</Form.Label>
                    <Form.Control
                      required type='email' id='email' placeholder='name@example.com'
                      value={correctorEmail}
                      onChange={(e) => setCorrectorEmail(e.target.value)}
                      disabled={isSendingCorrection}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className='mb-3'>
                <Form.Label>Modifier la définition</Form.Label>
                <Form.Control
                  required as='textarea' id='glossInput' rows={3}
                  value={correctingWord.gloss}
                  onChange={handleCorrectingWordChange}
                  disabled={isSendingCorrection}
                />
              </Form.Group>
            </Form>
          )}

        </Modal.Body>

        {!correctionStatus && (<Modal.Footer>
          <Button
            variant='dark'
            onClick={handleSubmit}
            disabled={isSendingCorrection}
          >
            {isSendingCorrection ? <Spinner animation='border' size='sm' /> : 'Envoyer'}
          </Button>
          <Button variant='outline-dark' onClick={handleCloseLexiconCorrectionModal}>Annuler</Button>
        </Modal.Footer>)}

      </Modal>

      <Container className={styles.lexicon}>
        <h1 className={styles.lexiconTitle}>{data[0].book}</h1>
        <h2 className={styles.lexiconSubTitle}>Lexique du lecteur biblique</h2>

        <p className={styles.lexiconFreq}>
          Mots apparaissant moins de {frequency} fois dans {testament}. <br />
          Entre parenthèses figure le nombre d'occurences du mot dans {testament}.
        </p>

        {data.map((word, id, data) => {
          const prevChapter = id > 0 ? data[id - 1].chapter : 0
          const chapHeading = prevChapter !== word.chapter
            ? <h3 className={styles.chapterHeading}>CHAPITRE {word.chapter}</h3>
            : null

          const prevVerse = id > 0 ? data[id - 1].verse : 0
          const verseIndicator = prevVerse !== word.verse
            ? <span className={styles.verseNb}>{word.verse}</span>
            : null

          return (
            <div key={id}>
              {chapHeading}
              <div className={styles.wordEntry}>
                <div className={styles.verseNb}>{verseIndicator}</div>
                <div className={styleLang} onClick={() => handleShowLexiconCorrectionModal(word)}><span>{word.lex}</span></div>
                <div className={styles.freq}>({word.freq})</div>
                <div className={styles.gloss}>{word.gloss}</div>
              </div>
            </div>
          )
        })}
      </Container>
    </>
  )
}

export default Lexicon
