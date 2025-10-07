import { bookNames, bookChapters } from '@/utils/booksMetadata'

export default function sanitiseRef(book: string, chapters: string, occurences: string, returnAllChNb = false): {
  book?: string,
  chapters?: number[] | '*' | string,
  occurences?: number | '*' | 'pegonduff'
} {

  // book
  const sainBook = bookNames[book.toLowerCase()]
  if (!sainBook) return {}


  // chapters
  let sainChapters
  let maxChaptersBook = bookChapters[sainBook]

  if (!chapters || chapters === '*') {
    sainChapters = returnAllChNb
      ? Array.from({ length: maxChaptersBook + 1 }, (_, i) => i + 1)
      : '*'

  } else {
    const chapArray = chapters.split(',').reduce<(number | string)[]>((acc, cur) => {
      let ch = cur.trim();
      // let maxChaptersBook = bookChapters[sainBook]

      if (ch.includes('-')) {
        const split = cur.split('-')
        let start = Number(split[0].trim())
        let end = Number(split[1].trim())

        if (start > end) {
          let oldStart = start
          start = end
          end = oldStart
        } else if (start === end) {
          acc.push(start);
          return acc
        }

        if (start > maxChaptersBook) return acc

        if (start < 1) start = 1

        if (end > maxChaptersBook) end = maxChaptersBook

        if (returnAllChNb) {
          acc.push(
            ...Array.from({ length: end - start + 1 }, (_, i) => start + i)
          )
        } else {
          acc.push(`${start} ${end}`)
        }

      } else {
        const numCh = Number(ch)
        if (numCh && numCh >= 1 && numCh <= maxChaptersBook && !acc.includes(numCh)) {
          acc.push(numCh)
        }
      }

      return acc;
    }, []).sort((a, b) => Number(a) - Number(b))

    sainChapters = returnAllChNb ? (chapArray as number[]) : chapArray.join(',')
  }


  // occurencesuency
  const sainOccurences = !occurences || occurences === '*' || occurences === 'pegonduff'
    ? occurences as number | '*' | 'pegonduff'
    : 70


  return {
    book: sainBook,
    chapters: sainChapters,
    occurences: sainOccurences
  }
}
