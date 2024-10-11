import { NextResponse } from 'next/server';

export async function GET (request) {
  return NextResponse.json({
    msg: "Le téléchargement du LLB au format CSV n'est pas encore disponible..."
  }, { status: 201 })

  // const headers = new Headers();
  // headers.set("Content-Type", "text/csv")
  // headers.set("Content-Disposition", `attachment; filename="llb.csv"`)
}
