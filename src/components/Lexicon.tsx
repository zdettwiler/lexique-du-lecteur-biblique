interface LLBWord {
  id: number
  verse: number
  chapter: number
  lemma: string
  llbword: {
    gloss: string,
    freq: number
  }
}

export default async function Lexicon({ book, chapters, occurences }:
  { book: string, chapters: string, occurences: string }
) {
  if (!book || !chapters || !occurences) {
    return
  }

  const data = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/llb/ref/${book}/${chapters}/${occurences}`)
  const { lexicon } = await data.json()

  if (!lexicon) return []

  const lang = lexicon[0].strong[0]
  const testament = lang === 'H' ? "l'Ancien Testament" : 'le Nouveau Testament'

  return (
    <div className='container max-w-[600px] mx-auto px-4 mt-10'>
      <div className='font-serif text-center mb-7'>
        <h1 className='uppercase text-center tracking-[12px] text-4xl'>{book} {chapters !== '*' ? chapters.replace('-', '–') : ''}</h1>
        {/* <h2 className='uppercase tracking-widest text-lg'>Lexique du lecteur biblique</h2> */}

        <p className='italic mt-3'>
          Mots apparaissant moins de {occurences} fois dans {testament}. <br />
          Entre parenthèses figure le nombre d&apos;occurences du mot dans {testament}.
        </p>
      </div>

      {lexicon.map((word: LLBWord, id: number, data: LLBWord[]) => {
          const prevChapter = id > 0 ? data[id - 1].chapter : 0
          const chapHeading = prevChapter !== word.chapter
            ? <h3 className='font-serif text-lg text-center italic uppercase tracking-[5px] mt-5 mb-3'>CHAPITRE {word.chapter}</h3>
            : null

          const prevVerse = id > 0 ? data[id - 1].verse : 0
          const verse = prevVerse !== word.verse
            ? word.verse
            : null

          return (
            <div key={id}>
              {chapHeading}
              <div key={word.id} className='flex flex-row items-baseline'>
                <div className='font-sans font-bold text-lg w-6 shrink-0 text-right mr-1'><sup>{verse}</sup></div>
                <div className={`shrink-0 font-serif font-semibold ${lang === 'H' ? 'min-w-[80px] text-2xl text-right' : 'min-w-[120px] text-xl'} `}>{word.lemma}</div>
                <div className='font-serif text-center text-sm w-9 pt-2 shrink-0 text-gray-500 dark:text-gray-400'>({word.llbword.freq})</div>
                <div className='font-serif text-xl grow '>{word.llbword.gloss}</div>
              </div>
            </div>
          )
        })}

    </div>
  )
}
