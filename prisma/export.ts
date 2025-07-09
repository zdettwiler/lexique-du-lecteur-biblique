import { PrismaClient } from '@prisma/client'
import type { LLBWord, BibleWord, PegonDuff } from '@prisma/client'

import fs from 'fs'
import path from 'path'
import cliProgress from 'cli-progress'
import { createObjectCsvStringifier } from 'csv-writer'


const prisma = new PrismaClient()
const BATCH_SIZE = 5000
const DATA_PATH = path.join(__dirname, '../data')

const multiBar = new cliProgress.MultiBar({
  clearOnComplete: false,
  hideCursor: true,
  format: '📦 Exporting {table} [{bar}] {percentage}% | {value}/{total} rows',
}, cliProgress.Presets.shades_classic)

type ExportTask<T> = {
  table: string
  path: string
  getTotal: () => Promise<number>
  getBatch: (offset: number, size: number) => Promise<any[]>
  getHeaders: () => { id: string, title: string }[]
  parseRow: (row: T) => Record<string, string | number | null>
}

async function exportTable<T>(exportTask: ExportTask<T>) {
  const output = fs.createWriteStream(path.join(DATA_PATH, exportTask.path), 'utf-8')
  const csvWriter = createObjectCsvStringifier({ header: exportTask.getHeaders() })

  const total = await exportTask.getTotal()
  const bar = multiBar.create(total, 0, { table: exportTask.table })

  output.write(csvWriter.getHeaderString())

  let offset = 0
  while (true) {
    const rows = await exportTask.getBatch(offset, BATCH_SIZE)

    if (rows.length === 0) break

    output.write(csvWriter.stringifyRecords(rows.map(row => exportTask.parseRow(row))))
    offset += rows.length
    bar.increment(rows.length)
  }

  output.end()
  bar.update(total) // Force completion
}

async function main() {
  const exportLLB: ExportTask<LLBWord> = {
    table: 'LLB',
    path: 'llb-supabase-export.csv',
    getTotal: () => prisma.lLBWord.count(),
    getBatch: (skip, take) => prisma.lLBWord.findMany({ skip, take, orderBy: { strong: 'asc' } }),
    getHeaders: () => [
      { id: 'strong', title: 'strong' },
      { id: 'lemma', title: 'lemma' },
      { id: 'gloss', title: 'gloss' },
      { id: 'freq', title: 'freq' },
      { id: 'updatedAt', title: 'updatedAt' },
    ],
    parseRow: row => ({
      ...row,
      updatedAt: row.updatedAt?.toISOString() ?? ""
    })
  }

  const exportBible: ExportTask<BibleWord> = {
    table: 'BibleWord',
    path: 'bible-supabase-export.csv',
    getTotal: () => prisma.bibleWord.count(),
    getBatch: (skip, take) => prisma.bibleWord.findMany({ skip, take, orderBy: { id: 'asc' } }),
    getHeaders: () => [
      { id: 'id', title: 'id' },
      { id: 'book', title: 'book' },
      { id: 'chapter', title: 'chapter' },
      { id: 'verse', title: 'verse' },
      { id: 'word', title: 'word' },
      { id: 'lemma', title: 'lemma' },
      { id: 'strong', title: 'strong' },
    ],
    parseRow: row => ({
      ...row
    })
  }

  // const exportLLB: ExportTask<LLB> = {
  //   table: 'LLB',
  //   path: 'llb-supabase-export.csv',
  //   getTotal: () => prisma.lLB.count(),
  //   getBatch: (skip, take) => prisma.lLB.findMany({ skip, take, orderBy: { strong: 'asc' } }),
  //   getHeaders: () => [
  //     { id: 'strong', title: 'strong' },
  //     { id: 'lemma', title: 'lemma' },
  //     { id: 'gloss', title: 'gloss' },
  //     { id: 'freq', title: 'freq' },
  //     { id: 'updatedAt', title: 'updatedAt' },
  //   ],
  //   parseRow: row => ({
  //     ...row,
  //     updatedAt: row.updatedAt?.toISOString() ?? ""
  //   })
  // }

  await Promise.all([
    exportTable<LLBWord>(exportLLB),
    exportTable<BibleWord>(exportBible)
  ])

  multiBar.stop()
  console.log('✅ All tables exported!')
}

main()
  .catch((err) => {
    console.error('❌ Export failed:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
