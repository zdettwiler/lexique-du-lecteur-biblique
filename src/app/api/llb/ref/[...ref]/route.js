import { NextResponse } from 'next/server'
import sanitiseRef from '@/utils/sanitiseRef'
import { db } from '@/lib/db'

export async function GET (request, { params: { ref } }) {
  const sainRef = sanitiseRef(ref[0], ref[1], ref[2], true)
  try {
    const words = await db.bibleWord.findMany({
      where: {
        book: { equals: sainRef.book },
        chapter: sainRef.chap !== '*'
          ? { in: sainRef.chap }
          : undefined,
        llbword: {
          freq: sainRef.freq !== '*'
            ? { lte: sainRef.freq }
            : undefined
        }
      },
      include: {
        llbword: {
          select: {
            gloss: true,
            freq: true
          }
        },
      },
    })

    return NextResponse.json({
      data: words
    }, { status: 201 })

  } catch (error) {
    console.log(error)
    return NextResponse.json({
      msg: 'Oups! Il y a eu un problème!',
      error
    }, { status: 500 })
  }
}
