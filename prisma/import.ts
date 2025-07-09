const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');
const cliProgress = require('cli-progress');
const readline = require('readline')


const prisma = new PrismaClient();
const DATA_PATH = path.join(__dirname, '../data');
const BATCH_SIZE = 5000;

const multiBar = new cliProgress.MultiBar({
  clearOnComplete: false,
  hideCursor: true,
  format: '📦 Seeding {table} [{bar}] {percentage}% | {value}/{total} rows',
}, cliProgress.Presets.shades_classic);

type ImportTask = {
  table: string
  path: string
  parseRow: (row: Record<string, string>) => any
  insertBatch: (data: any[]) => Promise<unknown>
};

function countCsvRowsStream(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    let count = 0;

    const stream = fs.createReadStream(filePath);
    const rl = readline.createInterface({ input: stream });

    rl.on('line', () => count++);
    rl.on('close', () => resolve(count > 0 ? count - 1 : 0)); // subtract header
    rl.on('error', reject);
  });
}

async function importTable(importTask: ImportTask) {
  const total = await countCsvRowsStream(importTask.path);
  const bar = multiBar.create(total, 0, { table: importTask.table });

  const stream = fs.createReadStream(importTask.path).pipe(
    parse({ columns: true, skip_empty_lines: true, trim: true })
  );

  let batch: any[] = [];
  for await (const row of stream) {
    batch.push(importTask.parseRow(row));
    if (batch.length >= BATCH_SIZE) {
      await importTask.insertBatch(batch);
      bar.increment(batch.length);
      batch = [];
    }
  }

  // Final flush
  if (batch.length > 0) {
    await importTask.insertBatch(batch);
    bar.increment(batch.length);
  }

  bar.update(total); // force exact value
}

async function main() {
  console.log('🧽 Wiping all tables')
  await prisma.bible.deleteMany(); // wipe
  await prisma.lLB.deleteMany(); // wipe

  const importTasks: ImportTask[] = [
    {
      table: 'LLB',
      path: path.join(DATA_PATH, 'llb-ex.csv'),
      parseRow: row => ({
        strong: row.strong,
        lemma: row.lemma,
        gloss: row.gloss,
        freq: Number(row.freq),
        updatedAt: new Date(row.updatedAt)
      }),
      insertBatch: batch => prisma.lLB.createMany({ data: batch }),
    },
    {
      table: 'Bible',
      path: path.join(DATA_PATH, 'bible.csv'),
      parseRow: row => ({
        id: Number(row.id),
        book: row.book,
        chapter: Number(row.chapter),
        verse: Number(row.verse),
        word: row.word,
        lemma: row.lemma,
        strong: row.strong
      }),
      insertBatch: batch => prisma.bible.createMany({ data: batch }),
    },
    {
      table: 'PegonDuff',
      path: path.join(DATA_PATH, 'pegonduff.csv'),
      parseRow: row => ({
        strong: row.strong
      }),
      insertBatch: batch => prisma.location.createMany({ data: batch }),
    },
  ];

  await Promise.all(importTasks.map(importTable));
  multiBar.stop();
  console.log('✅ All tables imported successfully');
}

main()
  .catch(err => {
    console.error('❌ Import failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
