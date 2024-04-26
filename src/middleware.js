import { NextResponse } from 'next/server'

import { bookNames, bookChapters } from './app/[[...params]]/booksMetadata'

export function middleware(request) {
  let params = request.nextUrl.pathname.match(/\/(?<book>[^\/]*)\/(?<chapters>[\d\*\,\-]*)\/?(?<frequency>\d*)?/)

  if (!params) {
    return NextResponse.redirect(new URL(`/`, request.url))
  }

  params = params.groups

  let needsRedirect = false

  // check param book
  params.book = decodeURI(params.book)

  if (!bookNames[params.book.toLowerCase()]) {
    return NextResponse.redirect(new URL(`/`, request.url))

  } else if (params.book !== bookNames[params.book.toLowerCase()]) {
    params.book = bookNames[params.book.toLowerCase()]
    needsRedirect = true
  }

  // check param chapters
  if (params.chapters !== '*') {
    let validatedChapters = params.chapters.split(',').reduce((acc, cur) => {
      let chapter = cur.trim();
      let maxChaptersBook = bookChapters[params.book]

      if (chapter.includes('-')) {
        let [start, end] = cur.split('-');
        start = parseInt(start.trim());
        end = parseInt(end.trim());

        if (start <= 1) {
          start = 1

        } else if (end > maxChaptersBook) {
          end = maxChaptersBook
        }

        if (start > end) {
          let oldStart = start
          start = end
          end = oldStart
        } else if (start === end) {
          acc.push(start);
          return acc
        }

        acc.push(start + '-' + end);
      } else {
        chapter = parseInt(chapter.trim());
        if (chapter
        && chapter <= maxChaptersBook
        && acc.indexOf(chapter) < 0) {
          acc.push(chapter);
        }
      }

      return acc;
    }, []).sort().join(',');

    if (validatedChapters !== params.chapters) {
      params.chapters = validatedChapters
        ? validatedChapters
        : '*'
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
    '/((?!api|_next|bible_books|favicon.ico|apple-icon|icon).*):path+',
  ],
}
