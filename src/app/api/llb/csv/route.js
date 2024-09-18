import { NextResponse } from 'next/server';
import createSupabaseClient from '@/utils/supabase/server';


export async function GET(request) {
  const supabase = createSupabaseClient();

  const { data, error, status } = await supabase
    .from('llb')
    .select('*')
    .csv()

  const headers = new Headers();
  headers.set("Content-Type", "text/csv")
  headers.set("Content-Disposition", `attachment; filename="llb.csv"`)

  return new NextResponse(status === 200
    ? data
    : error,
  { status, headers })
}
