'use client'
import { useContext } from 'react'
import { LLBCorrectionFormContext } from '@/components/CorrectionFormProvider'
import type { BibleWithLLB } from '@/types'

type Props = {
  chapHeading: React.ReactNode | null
  verseNb: number | null
  word: BibleWithLLB
}

export default function LexiconWord({ chapHeading, verseNb, word }: Props) {
  const context = useContext(LLBCorrectionFormContext)
  if (!context) throw new Error('Must be inside LLBCorrectionFormProvider')

  const { setIsLLBCorrectionDrawerOpen, setLLBCorrectionWord } = context

  const lang = word.strong[0]

  return (
    <div
      className=""
      onClick={() => {
        setIsLLBCorrectionDrawerOpen(true)
        setLLBCorrectionWord(word)
      }}
    >
      {chapHeading}
      <div key={word.id} className="flex flex-row items-baseline">
        <div className="font-sans font-bold text-lg w-6 shrink-0 text-right mr-1">
          <sup>{verseNb}</sup>
        </div>
        <div
          className={`shrink-0 font-serif font-semibold ${lang === 'H' ? 'min-w-[80px] text-2xl text-right' : 'min-w-[120px] text-xl'} `}
        >
          {word.lemma}
        </div>
        <div className="font-serif text-center text-sm w-9 pt-2 shrink-0 text-gray-500 dark:text-gray-400">
          ({word.llbword.freq})
        </div>
        <div className="font-serif text-xl grow ml-3 cursor-pointer hover:underline underline-offset-4 decoration-1">
          {word.llbword.gloss}
        </div>
      </div>
    </div>
  )
}
