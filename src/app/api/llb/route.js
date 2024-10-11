import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"


export async function GET (request, { params: { strong } }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ msg: 'Pas connecté' }, { status: 401 })
  }

  try {
    console.log(request)
    const word = await db.lLBWord.findUnique({
      where: { strong }
    })

    return NextResponse.json({
      data: word
    }, { status: 201 })

  } catch (error) {
    console.log(error)
    return NextResponse.json({ msg: 'Oups! Il y a eu un problème!', error }, { status: 500 })
  }
}
