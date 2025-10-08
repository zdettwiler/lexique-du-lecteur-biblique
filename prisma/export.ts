import { PrismaClient } from "@prisma/client";
import type { LLB, Bible, PegonDuff } from "@prisma/client";

import fs from "fs";
import path from "path";
import cliProgress from "cli-progress";
import { createObjectCsvStringifier } from "csv-writer";

const prisma = new PrismaClient();
const BATCH_SIZE = 5000;
const DATA_PATH = path.join(__dirname, "../data");

const multiBar = new cliProgress.MultiBar(
  {
    clearOnComplete: false,
    hideCursor: true,
    format:
      "  - {table} |{bar}| {percentage}% | ETA: {eta}s | ({value}/{total} rows)",
  },
  cliProgress.Presets.rect,
);

type ExportTask<T> = {
  table: string;
  path: string;
  getTotal: () => Promise<number>;
  getBatch: (offset: number, size: number) => Promise<T[]>;
  getHeaders: () => { id: string; title: string }[];
  parseRow: (row: T) => Record<string, string | number | null>;
};

async function exportTable<T>(exportTask: ExportTask<T>) {
  const output = fs.createWriteStream(
    path.join(DATA_PATH, exportTask.path),
    "utf-8",
  );
  const csvWriter = createObjectCsvStringifier({
    header: exportTask.getHeaders(),
  });

  const total = await exportTask.getTotal();
  const bar = multiBar.create(total, 0, { table: exportTask.table });

  output.write(csvWriter.getHeaderString());

  let offset = 0;
  while (true) {
    const rows = await exportTask.getBatch(offset, BATCH_SIZE);

    if (rows.length === 0) break;

    output.write(
      csvWriter.stringifyRecords(rows.map((row) => exportTask.parseRow(row))),
    );
    offset += rows.length;
    bar.increment(rows.length);
  }

  output.end();
  bar.update(total); // Force completion
}

async function main() {
  const exportLLB: ExportTask<LLB> = {
    table: "LLB".padEnd(10, " "),
    path: "llb.csv",
    getTotal: () => prisma.lLB.count(),
    getBatch: (skip, take) =>
      prisma.lLB.findMany({ skip, take, orderBy: { strong: "asc" } }),
    getHeaders: () => [
      { id: "strong", title: "strong" },
      { id: "lemma", title: "lemma" },
      { id: "gloss", title: "gloss" },
      { id: "freq", title: "freq" },
      { id: "updatedAt", title: "updatedAt" },
    ],
    parseRow: (row) => ({
      ...row,
      updatedAt: row.updatedAt?.toISOString() ?? "",
    }),
  };

  const exportBible: ExportTask<Bible> = {
    table: "Bible".padEnd(10, " "),
    path: "bible.csv",
    getTotal: () => prisma.bible.count(),
    getBatch: (skip, take) =>
      prisma.bible.findMany({ skip, take, orderBy: { id: "asc" } }),
    getHeaders: () => [
      { id: "id", title: "id" },
      { id: "book", title: "book" },
      { id: "chapter", title: "chapter" },
      { id: "verse", title: "verse" },
      { id: "word", title: "word" },
      { id: "lemma", title: "lemma" },
      { id: "strong", title: "strong" },
    ],
    parseRow: (row) => ({
      ...row,
    }),
  };

  const exportPegonDuff: ExportTask<PegonDuff> = {
    table: "PegonDuff".padEnd(10, " "),
    path: "pegonduff.csv",
    getTotal: () => prisma.pegonDuff.count(),
    getBatch: (skip, take) =>
      prisma.pegonDuff.findMany({ skip, take, orderBy: { strong: "asc" } }),
    getHeaders: () => [
      { id: "strong", title: "strong" },
      { id: "chapter", title: "chapter" },
    ],
    parseRow: (row) => row,
  };

  console.log("📦 Exporting");
  await Promise.all([
    exportTable<LLB>(exportLLB),
    exportTable<Bible>(exportBible),
    exportTable<PegonDuff>(exportPegonDuff),
  ]);

  multiBar.stop();
  console.log("✅ All tables exported successfully");
}

main()
  .catch((err) => {
    console.error("❌ Export failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
