import { bookNames, bookChapters } from '@/utils/booksMetadata'

export default function sanitiseRef(book: string, chapters: string, occurences: string, returnAllChNb = false): {
  book?: string,
  chapters?: number[] | '*',
  occurences?: number | '*' | 'pegonduff'
} {

  // book
  const sainBook = bookNames[book.toLowerCase()]
  if (!sainBook)
    return {}


  // chapters
  let sainChapters = !chapters || chapters === '*'
    ? ['*']
    : chapters.split(',').reduce((acc, cur) => {
      let ch = cur.trim();
      let maxChaptersBook = bookChapters[sainBook]

      if (ch.includes('-')) {
        let [start, end] = cur.split('-');
        start = Number(start.trim());
        end = Number(end.trim());

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

        if (returnAllChNb) {
          acc.push(
            ...Array.from({ length: end - start + 1 }, (_, i) => i + 1)
          )
        } else {
          acc.push(start + '-' + end)
        }

      } else {
        ch = Number(ch.trim());
        if (ch
          && ch <= maxChaptersBook
          && acc.indexOf(ch) < 0) {
          acc.push(ch);
        }
      }

      return acc;
    }, []).sort((a, b) => parseInt(a) - parseInt(b))

  if (!returnAllChNb) {
    sainChapters = sainChapters.join(',')
  }

  // occurencesuency
  const sainOccurences = !occurences || occurences === '*' || occurences === 'pegonduff'
    ? occurences
    : Number(occurences)


  return {
    book: sainBook,
    chapters: sainChapters,
    occurences: sainOccurences
  }
}
