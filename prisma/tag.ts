import { db } from '../src/lib/db'
import { books, bookMeta, type BookName } from '../src/utils/booksMetadata'
import { LLBWithBible } from '../src/types'

import fs from 'fs'
import path from 'path'
import cliProgress from 'cli-progress'
import { createObjectCsvStringifier } from 'csv-writer'

const DATA_PATH = path.join(__dirname, '../data')
const BATCH_SIZE = 1000

const bar = new cliProgress.SingleBar({
    clearOnComplete: false,
    hideCursor: true,
    format: '{bar} {percentage}% | ETA: {eta}s | ({value}/{total} rows)',
  }, cliProgress.Presets.rect)

type BibleRef = {
  book: BookName
  chapter: number
}
function sortCanonically(refA: BibleRef, refB: BibleRef) {
  const indexA = books.indexOf(refA.book)
  const indexB = books.indexOf(refB.book)

  if (indexA === indexB) {
    return refA.chapter - refB.chapter
  }

  return indexA - indexB
}

async function main() {
  console.log('📦 Tagging')
  const TOTAL_WORDS = await db.lLB.count()
  // const LAST_UPDATED_WORD = await db.lLB.findFirst({
  //     where: { updatedAt: { not: null } },
  //     orderBy: { updatedAt: 'desc' }
  //   })
  bar.start(TOTAL_WORDS, 0);

  const output = fs.createWriteStream(path.join(DATA_PATH, 'llb-tagged.csv'), 'utf-8')
  const csvWriter = createObjectCsvStringifier({ header: [
    { id: 'strong', title: 'strong' },
    { id: 'lemma', title: 'lemma' },
    { id: 'gloss', title: 'gloss' },
    { id: 'freq', title: 'freq' },
    { id: 'occurrences', title: 'occurrences' },
  ] })

  // output.write(`# LLB updated ${LAST_UPDATED_WORD?.updatedAt}\n`)
  // output.write(`### lexique.ibbxl.be ###\n`)
  // output.write(`\n# Pour Anki:\n`)
  output.write("#separator:Comma\n")
  output.write("#html:false\n")
  output.write(`#columns:${csvWriter.getHeaderString()}`)
  output.write("#notetype:Vocabulaire LLB\n")
  // output.write("#deck:📖 LLB Hébreux\n")
  output.write("#tagscolumn:5\n")

  let offset = 0
  while (true) {
    const llbRows = await db.lLB.findMany({
      skip: offset,
      take: BATCH_SIZE,
      select: {
        strong: true,
        lemma: true,
        gloss: true,
        freq: true,
        bibleword: {
          select: {
            book: true,
            chapter: true
          }
        }
      }
    }) as LLBWithBible[];

    if (llbRows.length === 0) break

    const taggedLLB = llbRows.map((word) => {
      const sortedOccurrences = word.bibleword
        .sort(sortCanonically)
        .map((ref ) => `${bookMeta[ref.book].label}_${ref.chapter}`)

      const uniqueOccurrences = Array.from(
        new Set(sortedOccurrences)
      ).join(" ")

      return {
        ...word,
        bibleword: undefined,
        occurrences: uniqueOccurrences,
      };
    });

    output.write(csvWriter.stringifyRecords(taggedLLB))
    offset += llbRows.length
    bar.increment(llbRows.length)
  }
  output.end()
  bar.update(TOTAL_WORDS)

  bar.stop()
  console.log('✅ LLB tagged successfully')
}

main()
  .catch((err) => {
    console.error('❌ Export failed:', err)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
