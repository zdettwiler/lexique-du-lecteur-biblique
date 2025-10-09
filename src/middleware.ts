import { NextResponse } from 'next/server'

import { bookNames, bookChapters } from '@/utils/booksMetadata'

export function middleware(request) {
  let params = request.nextUrl.pathname.match(
    /\/(?<book>[^/]*)\/(?<chapters>\d+)\/?(?<frequency>\d+|pegonduff)?/
  )
  // let params = request.nextUrl.pathname.match(/\/(?<book>[^/]*)\/(?<chapters>[\d*,-]*)\/?(?<frequency>\d+|pegonduff)?/)

  if (!params) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  params = params.groups

  let needsRedirect = false

  // check param book
  params.book = decodeURI(params.book)

  if (!bookNames[params.book.toLowerCase()]) {
    return NextResponse.redirect(new URL('/', request.url))
  } else if (params.book !== bookNames[params.book.toLowerCase()]) {
    params.book = bookNames[params.book.toLowerCase()]
    needsRedirect = true
  }

  // check param chapters
  if (params.chapters) {
    const maxChaptersBook = bookChapters[params.book]

    if (params.chapters > maxChaptersBook) {
      params.chapters = maxChaptersBook
      needsRedirect = true
    }
  }

  // check param frequency
  if (!params.frequency) {
    params.frequency = 70
    needsRedirect = true
  }

  // redirect with corrected url if necessary
  if (needsRedirect) {
    return NextResponse.redirect(
      new URL(
        `/${params.book}/${params.chapters}/${params.frequency}`,
        request.url
      )
    )
  }
}

export const config = {
  matcher: [
    '/((?!apprendre|api|changelog|_next|bible_books|img|favicon.ico|apple-icon|icon|sign-in|sign-up).*):path+'
  ]
}
