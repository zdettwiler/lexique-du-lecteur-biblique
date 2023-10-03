import { NextResponse } from 'next/server'

export function middleware(request) {
  const { groups: params } = request.nextUrl.pathname.match(/\/(?<book>.*)\/(?<chapters>.*)\/(?<frequency>.*)/)
  console.log(params)
  if (params.book === "Jo") {
    return NextResponse.redirect(new URL(`/${"Jonas"}/${params.chapters}/${params.frequency}`, request.url))
  }
  // return NextResponse.redirect(new URL('/Marc/1/10', request.url))
}

export const config = {
  matcher: [
    // '/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico|bible_books).*):path+',
  ],
}
