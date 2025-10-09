import { PrismaClient } from '@prisma/client'
import { bookMeta } from '../src/utils/booksMetadata'
import type { BookName } from '../src/types'

import fs from 'fs'
import path from 'path'
import cliProgress from 'cli-progress'
import { createObjectCsvStringifier } from 'csv-writer'

const prisma = new PrismaClient()
const BATCH_SIZE = 1000
const DATA_PATH = path.join(__dirname, '../data')

const multiBar = new cliProgress.MultiBar(
  {
    clearOnComplete: false,
    hideCursor: true,
    format:
      '  - {table} |{bar}| {percentage}% | ETA: {eta}s | ({value}/{total} rows)'
  },
  cliProgress.Presets.rect
)

type CsvValue = string | number | null

type ExportTask<T> = {
  table: string
  path: string
  getTotal: () => Promise<number>
  getBatch: (offset: number, size: number) => Promise<T[]>
  getHeaders: () => { id: keyof T & string; title: string }[]
  parseRow: (row: T) => Record<string, CsvValue>
}

async function exportTable<T>(exportTask: ExportTask<T>) {
  const output = fs.createWriteStream(
    path.join(DATA_PATH, exportTask.path),
    'utf-8'
  )
  const csvWriter = createObjectCsvStringifier({
    header: exportTask.getHeaders()
  })

  const total = await exportTask.getTotal()
  const bar = multiBar.create(total, 0, { table: exportTask.table })

  output.write(csvWriter.getHeaderString())

  let offset = 0
  while (true) {
    const rows = await exportTask.getBatch(offset, BATCH_SIZE)
    if (rows.length === 0) break

    const parsed = rows.map((row) => exportTask.parseRow(row))
    output.write(csvWriter.stringifyRecords(parsed))
    offset += rows.length
    bar.increment(rows.length)
  }

  output.end()
  bar.update(total) // Force completion
}

async function main() {
  // Define the shape of what we actually export (custom fields)
  type LLBExportRow = {
    strong: string
    lemma: string
    gloss: string
    occ: number
    tag: string
  }

  const exportLLB: ExportTask<LLBExportRow> = {
    table: 'LLB'.padEnd(10, ' '),
    path: 'llb-tagged.csv',

    getTotal: () => prisma.lLB.count(),

    getBatch: async (skip, take) => {
      const lexicon = await prisma.lLB.findMany({
        skip,
        take,
        include: {
          bibleword: {
            select: {
              book: true,
              chapter: true
            }
          }
        },
        orderBy: { strong: 'asc' }
      })

      return lexicon.map((l) => ({
        strong: l.strong,
        lemma: l.lemma,
        gloss: l.gloss,
        occ: l.freq,
        tag: [
          ...new Set(
            l.bibleword.map((w) => {
              const book = w.book as BookName
              const meta = bookMeta[book]
              return meta
                ? `${meta.label}_${w.chapter}`
                : `${w.book}_${w.chapter}`
            })
          )
        ].join(' ')
      }))
    },

    getHeaders: () => [
      { id: 'strong', title: 'strong' },
      { id: 'lemma', title: 'lemma' },
      { id: 'gloss', title: 'gloss' },
      { id: 'occ', title: 'freq' },
      { id: 'tag', title: 'tag' }
    ],

    parseRow: (row) => ({
      strong: row.strong,
      lemma: row.lemma,
      gloss: row.gloss,
      occ: row.occ,
      tag: row.tag
    })
  }

  console.log('📦 Exporting')
  await exportTable(exportLLB)
  multiBar.stop()
  console.log('✅ All tables exported successfully')
}

main()
  .catch((err) => {
    console.error('❌ Export failed:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
