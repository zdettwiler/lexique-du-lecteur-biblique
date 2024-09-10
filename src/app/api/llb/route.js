import { NextResponse } from 'next/server';
import createSupabaseClient from '@/utils/supabase/server';


  // const { data, error, status } = await supabase
  //   .from('ot')
  //   .select('lex, strong, llb!inner(freq, gloss)')
  //   .eq('book', 'Esdras')
  //   .eq('chapter', 1)
  //   .eq('verse', 1)
  //   .lt('llb.freq', 70)


export async function GET(request) {
  const supabase = createSupabaseClient();

  // const { data, error, status } = await supabase
  //   .from('llb')
  //   .select()
  //   .eq('strong', 'G0007')

  const { data, error, status } = await supabase
    .from('llb')
    .select('strong, lex, gloss, freq')
    .order('strong')

  return NextResponse.json(
    status === 200
      ? data
      : error,
    { status }
  );


  // try {


  // } catch (error) {
  //   return NextResponse.json({ msg: "Error!" }, { status: 500 });

  // }

  // return NextResponse.json({ msg: "Success!" }, { status: 201 });
}
