// 'use client'

import Title from '@/components/Title'
import LexiconForm from '@/components/LexiconForm'
import Lexicon from '@/components/Lexicon'
import Nav from "@/components/Nav";
import { Suspense } from "react";

export default async function Home({ params }
  : { params: { ref?: [string, string, string] } }) {

  const ref = await params

  const [book, chapters, occurences] = Array.isArray(ref.ref) && ref.ref.length === 3
    ? ref.ref.map(r => decodeURIComponent(r))
    : ['Genèse', '', '70']

  // (localStorage.getItem('book') || 'Genèse')
  // (localStorage.getItem('chapters') || '')
  // (localStorage.getItem('freoquency') || '70')

  return (
    <>
      <Nav
        book={book}
        chapters={chapters}
        occurences={occurences}
      />
      <main className='container mx-auto'>
        <Title />
        <LexiconForm
          book={book}
          chapters={chapters}
          occurences={occurences}
        />
        <Suspense fallback={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-spin text-center mx-auto mt-20"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        }>
          <Lexicon
            book={book}
            chapters={chapters}
            occurences={occurences}
          />
        </Suspense>
      </main>
    </>
  )
}
