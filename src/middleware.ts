import { NextResponse, type NextRequest } from 'next/server'
import sanitiseRef from '@/utils/sanitiseRef'
import { bookNames, bookChapters } from '@/utils/booksMetadata'

export function middleware(request: NextRequest) {
  let match = request.nextUrl.pathname.match(
    /\/(?<book>[^/]*)\/(?<chapters>[\d*,-]*)\/?(?<occurrences>\d+|pegonduff)?/
  )

  if (!match) return NextResponse.redirect(new URL(`/`, request.url))

  // check param book
  const paramBook = decodeURI(match.groups?.book ?? '')
  const paramChapters = decodeURI(match.groups?.chapters ?? '')
  const paramOccurrences = decodeURI(match.groups?.occurrences ?? '')

  const sainRef = sanitiseRef(paramBook, paramChapters, paramOccurrences)

  if (!sainRef) {
    return NextResponse.redirect(new URL(`/`, request.url))
  } else if (
    paramBook !== sainRef.book ||
    paramChapters !== sainRef.chapters ||
    paramOccurrences !== String(sainRef.occurrences)
  ) {
    return NextResponse.redirect(
      new URL(
        `/${sainRef.book}/${sainRef.chapters}/${sainRef.occurrences}`,
        request.url
      )
    )
  }
}

export const config = {
  matcher: [
    '/((?!apprendre|api|changelog|_next|img|favicon.ico|apple-icon|icon|$).*)'
  ]
}
