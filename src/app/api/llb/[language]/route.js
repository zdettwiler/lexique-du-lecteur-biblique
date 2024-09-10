import { NextResponse } from 'next/server';
import createSupabaseClient from '@/utils/supabase/server';


  // const { data, error, status } = await supabase
  //   .from('ot')
  //   .select('lex, strong, llb!inner(freq, gloss)')
  //   .eq('book', 'Esdras')
  //   .eq('chapter', 1)
  //   .eq('verse', 1)
  //   .lt('llb.freq', 70)


export async function GET(request, { params }) {
  if (!['G', 'H'].includes(params.language[0]))
    return NextResponse.redirect(new URL('../', request.url))

  const supabase = createSupabaseClient();

  const { data, error, status } = await supabase
    .from('llb')
    .select('strong, lex, gloss, freq')
    .like('strong', `${params.language[0]}%`)
    .order('strong')

  return NextResponse.json(
    status === 200
      ? data
      : error,
    { status }
  );
}
