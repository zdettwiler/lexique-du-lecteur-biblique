import { books, type BookName, bookMeta } from '@/utils/booksMetadata'


export default function getNextRef(dir: "prev" | "next", book: BookName, chapter: string):
{ book: BookName, chapter: number } {
  const bookNbChap = bookMeta[book].nbChap

  if (dir === "prev" && Number(chapter) === 1) {
    // go to last chapter of previous book
    const bookIndex = books.indexOf(book)
    const prevBook = books[bookIndex === 0 ? books.length - 1 : bookIndex - 1] // if book = Gn, go to Ap
    const prevBookNbChap = bookMeta[prevBook].nbChap

    return {
      book: prevBook,
      chapter: prevBookNbChap
    }

  } else if (dir === "next" && Number(chapter) === bookNbChap) {
    // go to fist chapter of next book
    const bookIndex = books.indexOf(book)
    const nextBook = books[bookIndex === books.length - 1 ? 0 : bookIndex + 1]  // if book = Ap, go to Gn

    return {
      book: nextBook,
      chapter: 1
    }
    // what to do if ref is Ap 22
  } else if (dir === "prev") {
    return {
      book,
      chapter: Number(chapter) - 1
    }
  } else if (dir === "next") {
    return {
      book,
      chapter: Number(chapter) + 1
    }
  }

  return {
    book,
    chapter: Number(chapter)
  }
}
