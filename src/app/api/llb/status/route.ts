import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import moment from 'moment'
import 'moment/locale/fr'
moment.locale('fr')

export async function GET() {
  try {
    const lastUpdatedWord = await db.LLB.findFirst({
      where: { updatedAt: { not: null } },
      orderBy: { updatedAt: 'desc' }
    })

    const updatedAt = moment(lastUpdatedWord?.updatedAt).format('D MMM YYYY')

    return NextResponse.json(
      {
        updatedAt
      },
      { status: 201 }
    )
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      {
        msg: 'Oups! Il y a eu un problème!',
        error
      },
      { status: 500 }
    )
  }
}
