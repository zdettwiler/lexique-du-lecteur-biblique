import { NextResponse } from 'next/server';
import { db } from '@/lib/db'


export async function GET (request, { params: { strong } }) {
  try {
    // clean strong, ex: add trailing zeros, G509 -> G0509
    const word = await db.lLBWord.findUnique({
      where: { strong }
    })

    return NextResponse.json({
      data: word
    }, { status: 201 })

  } catch (error) {
    return NextResponse.json({
      msg: 'Oups! Il y a eu un problème!',
      error
    }, { status: 500 })
  }
}
