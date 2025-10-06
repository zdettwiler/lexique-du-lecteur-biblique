'use client'
import { useContext } from 'react'
import { LLBCorrectionFormContext } from '@/components/CorrectionFormProvider'
import type { BibleWithLLB } from '@/types'

type Props = {
  verseNb: number | null
  word: BibleWithLLB
}

export default function LexiconWord({ chapHeading, verseNb, word }: Props) {
  const context = useContext(LLBCorrectionFormContext)
  if (!context) throw new Error("Must be inside LLBCorrectionFormProvider")

  const { setIsLLBCorrectionDrawerOpen, setLLBCorrectionWord } = context

  const lang = word.strong[0]

  return (
    <div className="" onClick={() => {
          setIsLLBCorrectionDrawerOpen(true)
          setLLBCorrectionWord(word)
        }}>
      <div key={word.id} className='flex flex-row items-baseline'>
        <div className='font-sans font-bold text-lg w-6 shrink-0 text-right mr-1'><sup>{verseNb}</sup></div>
        <div className={`shrink-0 font-serif font-semibold ${lang === 'H' ? 'min-w-[80px] text-2xl text-right' : 'min-w-[130px] text-xl'} `}>
          {word.lemma}
          <span className='font-serif font-normal text-center text-sm mx-3 pt-2 shrink-0 text-gray-500 dark:text-gray-400'>({word.llbword.freq})</span>
        </div>
        <div className='font-serif text-xl grow cursor-pointer hover:underline underline-offset-4 decoration-1'>{word.llbword.gloss}</div>
      </div>
      {/* <p key={word.id} className='pl-[120px] -indent-[120px]'>
        <span className='font-sans font-bold text-lg inline-block w-[12px] shrink-0 text-right mr-1'><sup>{verseNb}</sup></span>
        <span className='inline-block ml-[120px]'>
          <span className={`font-serif font-semibold  ${lang === 'H' ? 'text-2xl text-right' : 'text-xl'} `}>{word.lemma}</span>
          <span className='font-serif font-normal text-center text-sm mx-3 pt-2 shrink-0 text-gray-500 dark:text-gray-400'>({word.llbword.freq})</span>
        </span>
        <span className='font-serif text-xl inline cursor-pointer hover:underline underline-offset-4 decoration-1'>{word.llbword.gloss}</span>
      </p> */}
    </div>
  )
}
