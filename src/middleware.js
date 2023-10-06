import { NextResponse } from 'next/server'

import { bookNames, bookChapters } from './app/[[...params]]/booksMetadata'

export function middleware(request) {
  console.log(request.nextUrl.pathname)
  let params = request.nextUrl.pathname.match(/\/(?<book>.*)\/(?<chapters>.*)\/(?<frequency>.*)/)
  console.log(params)
  if (!params) {
    return NextResponse.redirect(new URL(`/`, request.url))
  }

  params = params.groups

  let needsRedirect = false

  // check param book
  params.book = decodeURI(params.book)

  if (!bookNames[params.book]) {
    return NextResponse.redirect(new URL(`/`, request.url))

  } else if (params.book !== bookNames[params.book]) {
    params.book = bookNames[params.book]
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
        if (chapter && chapter <= maxChaptersBook) {
          acc.push(chapter);
        }
      }

      return acc;
    }, []).join(',');

    if (validatedChapters !== params.chapters) {
      params.chapters = validatedChapters
      needsRedirect = true
    }
  }
  console.log(params.chapters)



  // check param frequency
  if (!params.frequency) {
    params.frequency = 70
  }


  if (needsRedirect) {
    return NextResponse.redirect(new URL(`/${params.book}/${params.chapters}/${params.frequency}`, request.url))
  }
}

export const config = {
  matcher: [
    // '/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico|bible_books).*):path+',
  ],
}
