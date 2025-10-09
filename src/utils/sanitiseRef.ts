import { bookNames, bookChapters } from '@/utils/booksMetadata'

export default function sanitiseRef(
  book: string,
  chapters: string,
  occurrences: string,
  returnAllChNb = false
):
  | {
      book: string
      chapters: '*' | string | number[]
      occurrences: number | 'pegonduff'
      returnAllChNb?: boolean
    }
  | undefined {
  // book
  const sainBook = bookNames[book.toLowerCase()]
  if (!sainBook) return

  // chapters
  let sainChapters
  let maxChaptersBook = bookChapters[sainBook]

  if (!chapters) {
    sainChapters = [1]
  } else if (chapters === '*') {
    sainChapters = returnAllChNb
      ? Array.from({ length: maxChaptersBook }, (_, i) => i + 1)
      : '*'
  } else {
    const chapArray = String(chapters)
      .split(',')
      .reduce<(number | string)[]>((acc, cur) => {
        let ch = cur.trim()
        // let maxChaptersBook = bookChapters[sainBook]

        if (ch.includes('-')) {
          const split = cur.split('-')

          let [start, end] = [
            Number(split[0].trim()),
            Number(split[1].trim())
          ].sort()

          if (start === end) {
            acc.push(start)
            return acc
          }

          if (start < 1) start = 1

          if (end > maxChaptersBook) end = maxChaptersBook

          if (returnAllChNb) {
            acc.push(
              ...Array.from({ length: end - start + 1 }, (_, i) => start + i)
            )
          } else {
            acc.push(`${start}-${end}`)
          }
        } else {
          const numCh = Number(ch)
          if (
            numCh &&
            numCh >= 1 &&
            numCh <= maxChaptersBook &&
            !acc.includes(numCh)
          ) {
            acc.push(numCh)
          }
        }

        return acc
      }, [])
      .sort((a, b) => Number(a) - Number(b))

    sainChapters = returnAllChNb ? (chapArray as number[]) : chapArray.join(',')
  }

  // occurrences
  let sainOccurrences

  if (occurrences === 'pegonduff') sainOccurrences = occurrences as 'pegonduff'
  else if (Number.isInteger(Number(occurrences)))
    sainOccurrences = Number(occurrences)
  else sainOccurrences = 70

  return {
    book: sainBook,
    chapters: sainChapters,
    occurrences: sainOccurrences
  }
}
