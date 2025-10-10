'use client'
import { useContext } from 'react'
import { LLBCorrectionFormContext } from '@/components/CorrectionFormProvider'
import type { BibleWithLLB } from '@/types'

type Props = {
  verseNb: number | null
  word: BibleWithLLB
}

export default function LexiconWord({ verseNb, word }: Props) {
  const context = useContext(LLBCorrectionFormContext)
  if (!context) throw new Error('Must be inside LLBCorrectionFormProvider')

  const { setIsLLBCorrectionDrawerOpen, setLLBCorrectionWord } = context

  const lang = word.strong[0]

  return (
    <div
      className="items-baseline hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md py-[2px] px-2"
      key={word.id}
      onClick={() => {
        setIsLLBCorrectionDrawerOpen(true)
        setLLBCorrectionWord(word)
      }}
    >
      <div
        className={`float-left flex flex-row items-baseline ${lang === 'H' ? ' min-w-[120px]' : 'min-w-[140px]'}`}
      >
        <div className="font-sans font-bold text-lg inline-block w-5 shrink-0 text-right mr-1">
          <sup>{verseNb}</sup>
        </div>
        <div
          dir={lang === 'H' ? 'rtl' : 'ltr'}
          className={`font-serif font-semibold ${lang === 'H' ? 'grow text-2xl text-right ml-1 leading-none' : 'text-xl'} `}
        >
          {word.lemma}
        </div>
        <div className="font-serif font-normal text-center leading-none text-sm mx-3 shrink-0 text-gray-500 dark:text-gray-400">
          ({word.llbword.freq})
        </div>
      </div>
      <div
        className={`${lang === 'H' ? ' pl-[120px]' : 'pl-[140px]'} font-serif text-xl cursor-pointer hover:underline underline-offset-4 decoration-1`}
      >
        {word.llbword.gloss}
      </div>
    </div>
  )
}
