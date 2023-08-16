'use client';
import React from 'react';
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


export default function Page() {


  return (
    <Container fluid="sm">
      <Container className="p-5 pb-2 mb-4 bg-white rounded-3" fluid>
        <p className="chirho">📓</p>{/* ☧ */}
        <h1 className="header">Lexique du lecteur biblique</h1>
        <p className="description">À propos</p>
      </Container>

      <p>Au lieu d'être présentés dans un ordre alphabétique, les mots sont regroupés verset par verset pour faciliter la lecture cursive du texte. Pour prendre en compte son niveau, le lecteur peut choisir la rareté des mots figurant dans le lexique.</p>

      <h3>Constitution des données</h3>
      <p>
        Le lexique hébreu-français est un recoupement:
        <ul>
          <li>du texte biblique de la <a href="https://etcbc.github.io/bhsa/">BHSA</a> (<a href="https://dx.doi.org/10.17026/dans-z6y-skyh">10.17026/dans-z6y-skyh</a>);</li>
          <li>de son alignement avec des codes Strong de <a href="https://github.com/eliranwong/OpenHebrewBible">OpenHebrewBible</a>;</li>
          <li>et du lexique Strong en français collecté chez <a href="https://emcitv.com/bible/strong-biblique-hebreu.html">emcitv</a>.</li>
        </ul>
      </p>

      <p>
        Le lexique grec-français est un recoupement:
        <ul>
          <li>du texte biblique de la <a href="https://github.com/STEPBible/STEPBible-Data/tree/master/Translators%20Amalgamated%20OT%2BNT">THGNT</a>;</li>
          <li>et du lexique Strong en français collecté chez <a href="https://emcitv.com/bible/strong-biblique-grec.html">emcitv</a>.</li>
        </ul>
      </p>

      <p>Les lexiques sont ensuite modifiés au fur et à mesure de leur utilisation et des corrections des utilisateurs.</p>

      <h3>À venir</h3>
      <p>
        ☑️ Formulaire pour proposer des rectifications du lexique
      </p>
    </Container>
  );
}
