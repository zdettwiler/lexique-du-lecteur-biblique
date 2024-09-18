import { NextResponse } from 'next/server';
import createSupabaseClient from '@/utils/supabase/server';


export async function GET(request) {
  const supabase = createSupabaseClient();

  const { data, error, status } = await supabase
    .from('llb')
    .select('*')
    .order('strong')
    .limit(15000)

  return NextResponse.json(status === 200
    ? data
    : error,
  { status })
}

export async function PUT(request) {
  const data = await request.json()
  console.log(data)

  const supabase = createSupabaseClient();

  const { error, status } = await supabase
    .from('llb_test')
    .upsert(data)

  return NextResponse.json(status === 200
    ? {}
    : error,
  { status })
}
