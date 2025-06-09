import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

function normalizeToOxia(input: string): string {
  const tonosToOxiaMap: Record<string, string> = {
    'ά': 'ά', // U+03AC → U+1F71
    'έ': 'έ',
    'ή': 'ή',
    'ί': 'ί',
    'ό': 'ό',
    'ύ': 'ύ',
    'ώ': 'ώ'
  };

  const replaced = [...input.normalize('NFC')]
    .map(char => tonosToOxiaMap[char] || char)
    .join('');

  return replaced;
}

export async function GET(request, { params }: { params: { lemma: string } }) {
  let { lemma } = await params
  lemma = normalizeToOxia(decodeURI(lemma))

  try {
    const words = await db.$queryRaw`
      SELECT *
      FROM "LLBWord"
      WHERE lemma = ${lemma}
      LIMIT 10;
    `;

    return NextResponse.json({
      words
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json({
      msg: 'Oups! Il y a eu un problème!',
      error
    }, { status: 500 })
  }
}
