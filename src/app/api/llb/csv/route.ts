import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import moment from 'moment'
import { books } from '@/utils/booksMetadata'
import 'moment/locale/fr'
moment.locale('fr')

function sortCanonically(refA, refB) {
  const indexA = books.indexOf(refA.book)
  const indexB = books.indexOf(refB.book)

  if (indexA === indexB) {
    return refA.chapter - refB.chapter
  }

  return indexA - indexB
}

export async function GET() {
  try {
    const llb = await db.lLB.findMany({
      // take: 10,
      select: {
        strong: true,
        lemma: true,
        gloss: true,
        freq: true,
        bibleword: {
          select: {
            book: true,
            chapter: true
          }
        }
      }
    });

    const withReferences = llb.map(word => {
      const sortedOccurrences = word.bibleword
        .sort(sortCanonically)
        .map(ref => `${ref.book}_${ref.chapter}`)

      const uniqueOccurrences = Array.from(
        new Set(sortedOccurrences)
      ).join(" ")

      return {
        ...word,
        bibleword: undefined,
        uniqueOccurrences,
      };
    });

    return NextResponse.json({
      withReferences
    }, { status: 201 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({
      msg: 'Oups! Il y a eu un problème!',
      error
    }, { status: 500 })
  }
}
