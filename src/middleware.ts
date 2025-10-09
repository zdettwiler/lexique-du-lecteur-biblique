import { NextResponse } from 'next/server'
import sanitiseRef from '@/utils/sanitiseRef'
import { bookNames, bookChapters } from '@/utils/booksMetadata'

export function middleware(request) {
  // let params = request.nextUrl.pathname.match(/\/(?<book>[^/]*)\/(?<chapters>\d+)\/?(?<frequency>\d+|pegonduff)?/)
  let params = request.nextUrl.pathname.match(
    /\/(?<book>[^/]*)\/(?<chapters>[\d*,-]*)\/?(?<frequency>\d+|pegonduff)?/
  )

  if (!params) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  params = params.groups

  // check param book
  const paramBook = decodeURI(params.book)
  const paramChapters = decodeURI(params.chapters)
  const paramOccurences = decodeURI(params.frequency)

  const { book, chapters, occurences } = sanitiseRef(
    paramBook,
    paramChapters,
    paramOccurences
  )

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
    '/((?!apprendre|api|changelog|_next|bible_books|img|favicon.ico|apple-icon|icon|sign-in|sign-up).*):path+'
  ]
}
