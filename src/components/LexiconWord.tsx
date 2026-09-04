'use client'
import { useContext } from 'react'
import { LLBCorrectionFormContext } from '@/components/CorrectionFormProvider'
import type { BibleWithLLB } from '@/types'
import type { ReactNode } from 'react'

type Props = {
  verseNb: number | null
  word: BibleWithLLB
}

export function renderGloss(gloss: string): ReactNode {
  const parts = gloss.split(/(\*[^*]+\*)/g)
  return parts.map((part, i) =>
    part.startsWith('*') && part.endsWith('*') && part.length > 1 ? (
      <i key={i}>{part.slice(1, -1)}</i>
    ) : (
      part
    )
  )
}

export default function LexiconWord({ verseNb, word }: Props) {
  const context = useContext(LLBCorrectionFormContext)
  if (!context) throw new Error('Must be inside LLBCorrectionFormProvider')

  const { setIsLLBCorrectionDrawerOpen, setLLBCorrectionWord } = context

  const lang = word.strong[0]
  const inflections = word.llbword.inflectionEndings
    ? word.llbword.pos === 'vb.'
      ? ` (${word.llbword.inflectionEndings})`
      : `, ${word.llbword.inflectionEndings}`
    : ''

  return (
    <div
      className="flex flex-row py-[2px]"
      key={word.id}
      onClick={() => {
        setIsLLBCorrectionDrawerOpen(true)
        setLLBCorrectionWord(word)
      }}
    >
      <div className="font-sans font-bold text-lg inline-block w-5 shrink-0 grow-0 text-right mr-1">
        <sup>{verseNb}</sup>
      </div>
      <div className="pl-6 -indent-6">
        <span
          dir={lang === 'H' ? 'rtl' : 'ltr'}
          className={`font-serif font-semibold ${lang === 'H' ? 'text-2xl min-w-[60px] text-right ml-1 leading-none' : 'text-xl'} `}
        >
          {word.lemma}
          {inflections}
        </span>

        <span
          dir="ltr"
          className="font-serif font-normal leading-none text-sm mx-3 text-gray-500 dark:text-gray-400"
        >
          ({word.llbword.freq})
        </span>

        <span
          className={`font-serif text-xl cursor-pointer hover:underline underline-offset-4 decoration-1`}
        >
          {!word.llbword.pos.includes('/') && <i>{word.llbword.pos}</i>} 
          {renderGloss(word.llbword.gloss)}
        </span>
      </div>
    </div>
  )
}
