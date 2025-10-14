import { NextResponse, type NextRequest } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ strong: string }> }
) {
  const { strong } = await params
  try {
    const match = strong.match(/^(?<lang>[GH])(?<nb>\d{1,4})$/)
    if (!match)
      return NextResponse.json(
        { error: 'Erreur: Code strong invalide.' },
        { status: 404 }
      )

    const word = await db.lLB.findUnique({
      where: {
        strong: `${match.groups?.lang}${match.groups?.nb.padStart(4, '0')}`
      }
    })

    return NextResponse.json({ ...word }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { msg: 'Oups! Il y a eu un problème!', error },
      { status: 500 }
    )
  }
}
