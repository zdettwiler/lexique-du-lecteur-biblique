import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// import { getServerSession } from "next-auth/next"
// import { authOptions } from "@/lib/auth"


export async function GET (request) {
  // const session = await getServerSession(authOptions)
  // if (!session) {
  //   return NextResponse.json({ msg: 'Pas connecté' }, { status: 401 })
  // }

  try {
    const data = await db.lLBWord.findMany({
      orderBy: { strong: 'asc' }
    })

    return NextResponse.json({
      data
    }, { status: 201 })

  } catch (error) {
    console.log(error)
    return NextResponse.json({ msg: 'Oups! Il y a eu un problème!', error }, { status: 500 })
  }
}
