import { bookNames, bookChapters } from '@/utils/booksMetadata'

export default function sanitiseRef(book, chap, freq, detailCh=false) {
  if (!bookNames[book.toLowerCase()])
    return {}

  // book
  const sainBook = bookNames[book.toLowerCase()]

  // chapter
  let sainChap = !chap || chap === '*'
    ? '*'
    : chap.split(',').reduce((acc, cur) => {
      let chapter = cur.trim();
      let maxChaptersBook = bookChapters[sainBook]

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

        if (detailCh) {
          acc.push(
            ...Array.from({ length: end - start + 1 }, (_, i) => i + 1)
          )
        } else {
          acc.push(start + '-' + end)
        }

      } else {
        chapter = parseInt(chapter.trim());
        if (chapter
        && chapter <= maxChaptersBook
        && acc.indexOf(chapter) < 0) {
          acc.push(chapter);
        }
      }

      return acc;
    }, []).sort()

    if (!detailCh) {
      sainChap = sainChap.join(',')
    }

  // frequency
  const sainFreq = !freq || freq === '*'
    ? '*'
    : parseInt(freq)

  return {
    book: sainBook,
    chap: sainChap,
    freq: sainFreq
  }
}
