import { PrismaClient } from '@prisma/client'
import type { LLB, Bible, PegonDuff } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse'
import cliProgress from 'cli-progress'
import readline from 'readline'


const prisma = new PrismaClient()
const DATA_PATH = path.join(__dirname, '../data')
const BATCH_SIZE = 5000

const multiBar = new cliProgress.MultiBar({
  clearOnComplete: false,
  hideCursor: true,
  format: '📦 Seeding {table} |{bar}| {percentage}% | ETA: {eta}s | ({value}/{total} rows)',
}, cliProgress.Presets.rect)

type ImportTask<T> = {
  table: string
  path: string
  parseRow: (row: Record<string, string>) => T
  insertBatch: (data: T[]) => Promise<unknown>
}

function countCsvRowsStream(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    let count = 0

    const stream = fs.createReadStream(filePath)
    const rl = readline.createInterface({ input: stream })

    rl.on('line', () => count++)
    rl.on('close', () => resolve(count > 0 ? count - 1 : 0)) // subtract header
    rl.on('error', reject)
  })
}

async function importTable<T>(importTask: ImportTask<T>) {
  const total = await countCsvRowsStream(importTask.path)
  const bar = multiBar.create(total, 0, { table: importTask.table })

  const stream = fs.createReadStream(importTask.path).pipe(
    parse({ columns: true, skip_empty_lines: true, trim: true })
  )

  let batch: T[] = []
  for await (const row of stream) {
    batch.push(importTask.parseRow(row))
    if (batch.length >= BATCH_SIZE) {
      await importTask.insertBatch(batch)
      bar.increment(batch.length)
      batch = []
    }
  }

  // Final flush
  if (batch.length > 0) {
    await importTask.insertBatch(batch)
    bar.increment(batch.length)
  }

  bar.update(total) // force exact value
}

function normalizeToOxia(input: string): string {
  const tonosToOxiaMap: Record<string, string> = {
    'ά': 'ά', // U+03AC → U+1F71
    'έ': 'έ',
    'ή': 'ή',
    'ί': 'ί',
    'ό': 'ό',
    'ύ': 'ύ',
    'ώ': 'ώ'
  };

  const replaced = [...input.normalize('NFC')]
    .map(char => tonosToOxiaMap[char] || char)
    .join('');

  return replaced;
}

async function main() {
  console.log('🧽 Wiping all tables')
  await prisma.bible.deleteMany() // wipe
  await prisma.lLB.deleteMany() // wipe
  await prisma.pegonDuff.deleteMany() // wipe

  const importLLB: ImportTask<LLB> = {
    table: 'LLB',
    path: path.join(DATA_PATH, 'llb.csv'),
    parseRow: row => ({
      strong: row.strong,
      lemma: normalizeToOxia(row.lemma),
      gloss: row.gloss,
      freq: Number(row.freq),
      updatedAt: row.updatedAt ? new Date(row.updatedAt) : null
    }),
    insertBatch: batch => prisma.lLB.createMany({ data: batch }),
  }

  const importBible: ImportTask<Bible> = {
    table: 'Bible',
    path: path.join(DATA_PATH, 'bible.csv'),
    parseRow: row => ({
      id: Number(row.id),
      book: row.book,
      chapter: Number(row.chapter),
      verse: Number(row.verse),
      word: normalizeToOxia(row.word),
      lemma: normalizeToOxia(row.lemma),
      strong: row.strong
    }),
    insertBatch: batch => prisma.bible.createMany({ data: batch }),
  }

  const importPegonDuff: ImportTask<PegonDuff> = {
    table: 'PegonDuff',
    path: path.join(DATA_PATH, 'pegonduff.csv'),
    parseRow: row => ({
      strong: row.strong
    }),
    insertBatch: batch => prisma.pegonDuff.createMany({ data: batch }),
  }

  await importTable(importLLB);
  await Promise.all([
    importTable(importBible),
    importTable(importPegonDuff),
  ]);
  multiBar.stop()
  console.log('✅ All tables imported successfully')
}

main()
  .catch(err => {
    console.error('❌ Import failed:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
