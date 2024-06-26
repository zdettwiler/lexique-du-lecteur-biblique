import { NextResponse } from 'next/server';
import gsheetdb from 'gsheetdb';


export async function POST(request) {
  const body = await request.json();
  const CREDS = JSON.parse(process.env.CREDS);

  try {
    let db = new gsheetdb({
      spreadsheetId: process.env.NEXT_PUBLIC_SPREADSHEETID,
      sheetName: process.env.NEXT_PUBLIC_SHEETNAME,
      credentialsJSON: CREDS
    });

    // Header: timestamp, name, email, word_id, book, chapter, verse, strong, gloss
    await db.insertRows([ [
      new Date().toLocaleString("en-GB"),
      body.name,
      body.email,
      body.book,
      body.chapter,
      body.verse,
      body.strong,
      body.lex,
      body.corrected_gloss
    ] ]);

  } catch (error) {
    return NextResponse.json({ msg: "Error!" }, { status: 500 });

  }

  return NextResponse.json({ msg: "Success!" }, { status: 201 });
}
