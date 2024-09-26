import { NextResponse } from 'next/server'

import { bookNames, bookChapters } from './app/[[...params]]/booksMetadata'

export function middleware(request) {
  let params = request.nextUrl.pathname.match(/\/(?<book>[^/]*)\/(?<chapters>[\d*,-]*)\/?(?<frequency>\d*)?/)

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
  if (params.chapters !== '*') {
    const validatedChapters = params.chapters.split(',').reduce((acc, cur) => {
      let chapter = cur.trim()
      const maxChaptersBook = bookChapters[params.book]

      if (chapter.includes('-')) {
        let [start, end] = cur.split('-')
        start = parseInt(start.trim())
        end = parseInt(end.trim())

        if (start <= 1) {
          start = 1
        }

        if (end > maxChaptersBook) {
          end = maxChaptersBook
        }

        if (start > end) {
          const oldStart = start
          start = end
          end = oldStart
        }

        if (start === end) {
          acc.push(start)
          return acc
        } else {
          acc.push(start + '-' + end)
        }
      } else {
        chapter = parseInt(chapter.trim())

        if (chapter && chapter > maxChaptersBook) {
          chapter = maxChaptersBook
        }

        if (chapter && acc.indexOf(chapter) < 0) {
          acc.push(chapter)
        }
      }

      return acc
    }, []).sort((a, b) => parseInt(a) - parseInt(b)).join(',')

    if (validatedChapters !== params.chapters) {
      params.chapters = validatedChapters || '*'
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
    return NextResponse.redirect(new URL(`/${params.book}/${params.chapters}/${params.frequency}`, request.url))
  }
}

export const config = {
  matcher: [
    '/((?!api|_next|bible_books|img|favicon.ico|apple-icon|icon|sign-in|sign-up).*):path+'
  ]
}
