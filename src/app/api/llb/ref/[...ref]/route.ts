import { NextResponse } from 'next/server'
import sanitiseRef from '@/utils/sanitiseRef'
import { db } from '@/lib/db'

import type { BibleWithLLB } from '@/types'

export async function GET(
  request,
  {
    params
  }: {
    params: { ref: [string, string, string] }
  }
) {
  const {
    ref: [bookParam, chaptersParam, occurencesParam]
  } = await params
  const sainRef = sanitiseRef(bookParam, chaptersParam, occurencesParam, true)

  try {
    const words: BibleWithLLB[] = await db.bible.findMany({
      orderBy: { id: 'asc' },
      where: {
        book: { equals: sainRef.book },
        chapter: sainRef.chap !== '*' ? { in: sainRef.chap } : undefined,
        llbword: {
          freq:
            typeof sainRef.freq === 'number' && Number.isInteger(sainRef.freq)
              ? { lte: sainRef.freq }
              : undefined,
          pegonduff: sainRef.freq === 'pegonduff' ? { is: null } : undefined
        }
      },
      include: {
        llbword: {
          select: {
            gloss: true,
            freq: true
          }
        }
      }
    })

    const lexicon = words.reduce((lexicon: BibleWithLLB[], word) => {
      const isSameWordInVerse = lexicon.find(
        (lexiconWord) =>
          lexiconWord.chapter === word.chapter &&
          lexiconWord.verse === word.verse &&
          lexiconWord.strong === word.strong
      )
      if (!isSameWordInVerse) {
        lexicon.push(word)
      }
      return lexicon
    }, [])

    return NextResponse.json(
      {
        lexicon
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack)
    }
    return NextResponse.json(
      {
        msg: 'Oups! Il y a eu un problème!',
        error
      },
      { status: 500 }
    )
  }
}
