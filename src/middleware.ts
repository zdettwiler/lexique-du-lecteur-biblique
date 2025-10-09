import { NextResponse, type NextRequest } from 'next/server'
import sanitiseRef from '@/utils/sanitiseRef'
import { bookNames, bookChapters } from '@/utils/booksMetadata'

export function middleware(request: NextRequest) {
  let match = request.nextUrl.pathname.match(
    /\/(?<book>[^/]*)\/(?<chapters>[\d*,-]*)\/?(?<occurences>\d+|pegonduff)?/
  )

  if (!match) return NextResponse.redirect(new URL('/', request.url))

  // check param book
  const paramBook = decodeURI(match.groups?.book ?? '')
  const paramChapters = decodeURI(match.groups?.chapters ?? '')
  const paramOccurences = decodeURI(match.groups?.occurences ?? '')

  const { book, chapters, occurences } = sanitiseRef(
    paramBook,
    paramChapters,
    paramOccurences
  )

  console.log(book, chapters, occurences)

  if (!book) {
    return NextResponse.redirect(new URL(`/`, request.url))
  } else if (
    paramBook !== book ||
    paramChapters !== chapters ||
    paramOccurences != occurences
  ) {
    return NextResponse.redirect(
      new URL(`/${book}/${chapters}/${occurences}`, request.url)
    )
  }
}

export const config = {
  matcher: [
    '/((?!apprendre|api|changelog|_next|img|favicon.ico|apple-icon|icon).*)'
  ]
}
