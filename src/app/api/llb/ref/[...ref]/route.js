import { NextResponse } from 'next/server'
import createSupabaseClient from '@/utils/supabase/server'
import sanitiseRef from '@/utils/sanitiseRef'

export async function GET(request, { params: { ref }}) {
  const supabase = createSupabaseClient()

  const sainRef = sanitiseRef(ref[0], ref[1], ref[2], true)

  let query = supabase
    .from('bible')
    .select('book, chapter, verse, lex, strong, llb!inner(freq, gloss)')
    .eq('book', sainRef.book)

  if (sainRef.chap !== '*')
    query.in('chapter', sainRef.chap)

  if (sainRef.freq !== '*')
    query.lt('llb.freq', sainRef.freq)

  let { data, error, status } = await query

  data = data
    ? data.map(word => {
      return {
        ...word,
        ...word.llb,
        llb: undefined
      }
    })
    : []

  return NextResponse.json(status === 200
    ? data
    : error,
  { status })
}
