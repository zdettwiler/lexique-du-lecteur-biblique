'use client'
import { useContext } from 'react'
import { FeedbackFormContext } from '@/components/FeedbackFormProvider'
import { Button } from '@/components/ui/button'

export default function LexiconWord({ chapHeading, verse, word }) {
  const { setIsOpen, setFeedbackWord } = useContext(FeedbackFormContext)

  const lang = word.strong[0]

  return (
    <div>
      {chapHeading}
      <div key={word.id} className='flex flex-row items-baseline'>
        <div className='font-sans font-bold text-lg w-6 shrink-0 text-right mr-1'><sup>{verse}</sup></div>
        <div className={`shrink-0 font-serif font-semibold ${lang === 'H' ? 'min-w-[80px] text-2xl text-right' : 'min-w-[120px] text-xl'} `}>{word.lemma}</div>
        <div className='font-serif text-center text-sm w-9 pt-2 shrink-0 text-gray-500 dark:text-gray-400'>({word.llbword.freq})</div>
        <div className='font-serif text-xl grow ml-3'>{word.llbword.gloss}</div>
        <Button size='sm' className='' onClick={() => {
          setIsOpen(true)
          setFeedbackWord(word)
        }}>feedback</Button>
      </div>
    </div>
  )
}
