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
    const tagged = await db.$queryRaw`
      SELECT
        strong,
        "LLB".lemma,
        "LLB".gloss,
        "LLB".freq,
        -- ARRAY_AGG (DISTINCT book || '_' || chapter) occurences_arr,
        STRING_AGG (
          DISTINCT (book || '_' || chapter),
          ' '
        ) occurences
      FROM
        "LLB"
      INNER JOIN "Bible" USING (strong)
      -- WHERE "LLB".strong LIKE 'G%' -- change here G% for greek, H% for hebrew
      GROUP BY
        strong
      ORDER BY
        strong;
    `

    return NextResponse.json({
      tagged
    }, { status: 201 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({
      msg: 'Oups! Il y a eu un problème!',
      error
    }, { status: 500 })
  }
}
