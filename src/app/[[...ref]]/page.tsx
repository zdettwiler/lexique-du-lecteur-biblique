// 'use client'

import Title from '@/components/Title'
import LexiconForm from '@/components/LexiconForm'
import Lexicon from '@/components/Lexicon'
import { Suspense } from "react"
import { LoaderCircle } from 'lucide-react'

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
    <main className='container mx-auto dark:bg-red'>
      <Title />
      <LexiconForm
        book={book}
        chapters={chapters}
        occurences={occurences}
      />
      <Suspense fallback={
        <LoaderCircle className="animate-spin w-12 h-12 text-blue-500 text-center mx-auto mt-20" />
      }>
        <Lexicon
          book={book}
          chapters={chapters}
          occurences={occurences}
        />
      </Suspense>
    </main>
  )
}
