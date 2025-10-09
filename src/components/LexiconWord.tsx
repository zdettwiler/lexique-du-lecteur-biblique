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
      className="hover:bg-gray-100 rounded-md"
      onClick={() => {
        setIsLLBCorrectionDrawerOpen(true)
        setLLBCorrectionWord(word)
      }}
    >
      {/* <div key={word.id} className='flex flex-row items-baseline'>
        <div className='font-sans font-bold text-lg w-6 shrink-0 text-right mr-1'><sup>{verseNb}</sup></div>
        <div className={`flex flex-row items-baseline shrink-0 font-serif font-semibold ${lang === 'H' ? 'justify-end-safe min-w-[120px]' : 'min-w-[140px]'} `}>
          <div className={lang === 'H' ? 'grow text-2xl text-right' : 'text-xl'}>{word.lemma}</div>
          <div className='font-serif font-normal text-center text-sm mx-3 pt-2 shrink-0 text-gray-500 dark:text-gray-400'>({word.llbword.freq})</div>
        </div>
        <div className='font-serif text-xl grow cursor-pointer hover:underline underline-offset-4 decoration-1'>{word.llbword.gloss}</div>
      </div> */}
      <div key={word.id} className="mb-1">
        <div
          className={`float-left flex flex-row ${lang === 'H' ? ' min-w-[120px]' : 'min-w-[140px]'}`}
        >
          <div className="font-sans font-bold text-lg inline-block w-[12px] shrink-0 text-right mr-1">
            <sup>{verseNb}</sup>
          </div>
          <div
            className={`font-serif font-semibold h-[28px] ${lang === 'H' ? 'text-2xl text-right ml-1' : 'text-xl'} `}
          >
            {word.lemma}
          </div>
          <div className="font-serif font-normal text-center text-sm mx-3 pt-2 shrink-0 text-gray-500 dark:text-gray-400">
            ({word.llbword.freq})
          </div>
        </div>
        <div
          className={`${lang === 'H' ? ' pl-[120px]' : 'pl-[140px]'} font-serif text-xl cursor-pointer hover:underline underline-offset-4 decoration-1`}
        >
          {word.llbword.gloss}
        </div>
      </div>
    </div>
  )
}
