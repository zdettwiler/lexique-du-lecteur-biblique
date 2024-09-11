import { NextResponse } from 'next/server';
import createSupabaseClient from '@/utils/supabase/server';


export async function GET(request, { params: { ref }}) {
  console.log(ref)

  const supabase = createSupabaseClient();

  const { data, error, status } = await supabase
    .from('ot')
    .select('lex, strong, llb!inner(freq, gloss)')
    .eq('book', ref[0])
    .eq('chapter', ref[1])
    .lt('llb.freq', ref[2])

  return NextResponse.json(status === 200
    ? data
    : error,
  { status });
}


  // if (!ref.length) {
  //   return NextResponse.json(["Tout LLB"]);

  // } else if (ref.length === 1 && ['G', 'H'].includes(ref[0])) {
  //   return NextResponse.json(["Tout LLB langue"]);

  // } else {
  //   const sainRef = sanitiseRef(ref[0], ref[1], ref[2]);

  //   const { data, error, status } = await supabase
  //     .from('ot')
  //     .select('lex, strong, llb!inner(freq, gloss)')
  //     .eq('book', sainRef.book)
  //     .eq('chapter', 1)
  //     .eq('verse', 1)
  //     .lt('llb.freq', 70)

  //   return NextResponse.json(status === 200
  //     ? data
  //     : error,
  //   { status });
  // }

  // return NextResponse.json(status === 200
  //   ? data
  //   : error,
  // { status });


  // if (!)
  //   return NextResponse.redirect(new URL('../', request.url))

  // const supabase = createSupabaseClient();

  // const { data, error, status } = await supabase
  //   .from('llb')
  //   .select('strong, lex, gloss, freq')
  //   .like('strong', `${params.language[0]}%`)
  //   .order('strong')

  // return NextResponse.json(
  //   status === 200
  //     ? data
  //     : error,
  //   { status }
  // );
