// import { NextResponse } from 'next/server';
// import createSupabaseClient from '@/utils/supabase/server';


// export async function GET(request) {
//   const supabase = createSupabaseClient();

//   const { data, error, status } = await supabase
//     .from('learnt')
//     .select('*')
//     .gte('learnt_at', '2025-01-19 00:00:00+00')

//   return NextResponse.json(status === 200
//     ? data
//     : error,
//   { status })
// }
