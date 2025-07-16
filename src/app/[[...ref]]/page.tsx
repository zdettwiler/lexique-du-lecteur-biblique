// 'use client'

import Title from '@/components/Title'
import LexiconForm from '@/components/LexiconForm'
import Lexicon from '@/components/Lexicon'
import { Suspense } from "react"
import { LoaderCircle } from 'lucide-react'

export default async function Home({ params }
  : { params: { ref?: [string, string, string] } }) {

  const ref = await params

  const [book, chapter, occurences] = Array.isArray(ref.ref) && ref.ref.length === 3
    ? ref.ref.map(r => decodeURIComponent(r))
    : ['Genèse', 1, '70']

  // (localStorage.getItem('book') || 'Genèse')
  // (localStorage.getItem('chapters') || '')
  // (localStorage.getItem('freoquency') || '70')

  return (
    <main className='container mx-auto dark:bg-red'>
      <Title />
      <LexiconForm
        book={book}
        chapter={Number(chapter)}
        occurences={occurences}
      />
      <Suspense fallback={
        <LoaderCircle className="animate-spin size-10 text-primary text-center mx-auto mt-20" />
      }>
        <Lexicon
          book={book}
          chapter={chapter}
          occurences={occurences}
        />
      </Suspense>
    </main>
  )
}
