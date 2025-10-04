import puppeteer from 'puppeteer';
import { NextResponse } from 'next/server';

export async function GET() {
  const book = 'Jean'
  const chapter = '1-5'
  const occurences = '100'
  const data = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/llb/ref/${book}/${chapter}/${occurences}`)
  const { lexicon }: { lexicon: BibleWithLLB[] } = await data.json()

  if (!lexicon) return []

  const lang = lexicon[0].strong[0]
  const testament = lang === 'H' ? "l'Ancien Testament" : 'le Nouveau Testament'

  // Launch Chromium
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // HTML that uses Tailwind (via CDN)
  const html = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <!-- Tailwind CDN -->
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        @page { margin: 40px; }
        .font-times {
          font-family: 'Times New Roman';
        }
        .col-span-all {
          column-span: all;
        }
      </style>
    </head>
    <body class="mb-5">
      <div class='font-times text-center mb-7'>
        <h1 class='uppercase text-center tracking-[12px] text-4xl'>Jean</h1>
        <h2 class='uppercase tracking-[5px] text-sm'>Lexique du lecteur biblique</h2>

        <p class='italic mt-3 text-xs leading-none'>
          Mots apparaissant moins de ${occurences} fois dans ${testament}. <br />
          Entre parenthèses figure le nombre d&apos;occurences du mot dans ${testament}.
        </p>
      </div>

      <div class='columns-2'>
        ${lexicon.map((word: BibleWithLLB, id: number, data: BibleWithLLB[]) => {
          const prevChapter = id > 0 ? data[id - 1].chapter : 0
          const chapHeading = prevChapter !== word.chapter
            ? `<h3 class='col-span-all font-times text-sm text-center italic uppercase tracking-[5px] mt-5 mb-3'>CHAPITRE ${word.chapter}</h3>`
            : ""

          const prevVerse = id > 0 ? data[id - 1].verse : 0
          const verseNb = prevVerse !== word.verse
            ? `<div class='font-sans font-bold text-xs w-6 shrink-0 text-right mr-1'><sup>${word.verse}</sup></div>`
            : `<div class='font-sans font-bold text-xs w-6 shrink-0 text-right mr-1'><sup></sup></div>`

          return (`
            <div>
              ${chapHeading}
              <div class='flex flex-row items-baseline leading-none'>
                ${verseNb}
                <div class='shrink-0 font-times leading-none font-semibold ${lang === 'H' ? 'min-w-[80px] text-lg text-right' : 'min-w-[120px] text-md'}'>${word.lemma}</div>
                <div class='font-times text-center leading-none text-xs w-9 shrink-0 text-gray-500 dark:text-gray-400'>(${word.llbword.freq})</div>
                <div class='font-times text-sm leading-none grow ml-3 cursor-pointer hover:underline underline-offset-4 decoration-1'>${word.llbword.gloss}</div>
              </div>
            </div>
          `)
        }).join('')}
      </div>
    </body>
  </html>
  `;

  // Load HTML into Puppeteer
  await page.setContent(html, { waitUntil: 'networkidle0' });

  // Generate the PDF
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
  });

  await browser.close();

  // Send as response
  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="two-columns-tailwind.pdf"',
    },
  });
}
