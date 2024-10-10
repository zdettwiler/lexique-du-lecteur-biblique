import { NextResponse } from 'next/server';
import createSupabaseClient from '@/utils/supabase/server';


export async function GET(request, { params: { strong }}) {
  const supabase = createSupabaseClient();

  // clean strong, ex: add trailing zeros, G509 -> G0509

  const { data, error, status } = await supabase
    .from('llb')
    .select('*')
    .eq('strong', strong)
    .limit(1)
    .single()

  return NextResponse.json(status === 200
    ? data
    : error,
  { status })
}
