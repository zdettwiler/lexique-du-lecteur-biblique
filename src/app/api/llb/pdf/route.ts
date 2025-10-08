import sanitiseRef from '@/utils/sanitiseRef'
import type { BibleWithLLB } from '@/types'
import { NextResponse } from 'next/server'
import puppeteer, { Browser } from 'puppeteer'
import pLimit from 'p-limit'

// 🧠 Concurrency limiter: only 2 concurrent generations
const limit = pLimit(2)

// ♻️ Optional: reuse a single browser instance between requests
let sharedBrowser: Browser | null = null

// 🧰 Helper: ensure browser launched once
async function getBrowser() {
  if (!sharedBrowser) {
    sharedBrowser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    // Ensure clean shutdown
    const cleanup = async () => {
      if (sharedBrowser) {
        try {
          await sharedBrowser.close()
        } catch (err) {
          console.warn('Error closing Puppeteer browser on shutdown', err)
        }
        sharedBrowser = null
      }
    }

    process.on('exit', cleanup)
    process.on('SIGINT', cleanup)
    process.on('SIGTERM', cleanup)
  }

  return sharedBrowser
}

// 🧱 Timeout helper
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
    promise.then(
      (res) => {
        clearTimeout(timer)
        resolve(res)
      },
      (err) => {
        clearTimeout(timer)
        reject(err)
      }
    )
  })
}

// 🧾 PDF generation logic
async function generatePDF(html: string): Promise<Buffer> {
  return limit(async () => {
    let browser: Browser | null = null
    let page = null

    try {
      browser = await getBrowser()
      page = await browser.newPage()

      console.log("SETTING CONTENT")
      await withTimeout(page.setContent(html, { waitUntil: 'domcontentloaded' }), 60000)

      console.log("MAKING PDF")
      const pdfBuffer = await withTimeout(
        page.pdf({
          format: 'A4',
          margin: { top: 40, bottom: 40, left: 40, right: 40 },
          printBackground: true,
        }),
        60000
      )

      return pdfBuffer
    } catch (err) {
      console.error('❌ Error generating PDF:', err)
      throw err
    } finally {
      if (page) {
        try {
          await page.close()
        } catch (closeErr) {
          console.warn('⚠️ Failed to close page:', closeErr)
        }
      }
    }
  })
}

// 🧩 API route
export async function POST(req: Request) {
  try {
    const { ref } = await req.json()

    if (!ref) { // TODO Check types
      return NextResponse.json({ error: 'Missing ref' }, { status: 400 })
    }


    const sainRef = sanitiseRef(ref.book, ref.chapters, ref.occurences)

    const data = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/llb/ref/${sainRef.book}/${sainRef.chapters}/${sainRef.occurences}`)
    const { lexicon }: { lexicon: BibleWithLLB[] } = await data.json()
    if (!lexicon) return []

    const title = sainRef.chapters !== '*'
      ? `${sainRef.book} ${sainRef.chapters.replace('-', '–')}`
      : sainRef.book

    const nbUniqueWords: number = new Set(lexicon.map(w => w.strong)).size
    const lang = lexicon[0].strong[0]
    const testament = lang === 'H' ? "l'Ancien Testament" : 'le Nouveau Testament'

    const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <!-- Tailwind CDN -->
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @page { margin: 40px }
          .font-times {
            font-family: 'Times New Roman'
          }
          .col-span-all {
            column-span: all
          }
        </style>
      </head>
      <body class="antialiased">
        <div class='font-times text-center mb-7'>
          <h1 class='uppercase text-center tracking-[12px] text-4xl'>${title}</h1>
          <h2 class='uppercase tracking-[5px] text-sm'>Lexique du lecteur biblique</h2>

          <p class='italic mt-3 text-xs leading-none'>
            ${nbUniqueWords} mots apparaissent moins de ${sainRef.occurences} fois dans ${testament}. <br/>
            Entre parenthèses figure le nombre d&apos;occurences du mot dans ${testament}. <br/>
            Généré par <a class='underline' href='https://lexique.ibbxl.be'>lexique.ibbxl.be</a>.
          </p>
        </div>

        <div class='columns-2'>
          ${lexicon.map((word: BibleWithLLB, id: number, data: BibleWithLLB[]) => {
            const prevChapter = id > 0 ? data[id - 1].chapter : 0
            const chapHeading = prevChapter !== word.chapter
              ? `<h3 class='col-span-all font-times text-sm text-center italic uppercase tracking-[5px] mt-5 mb-3'>CHAPITRE ${word.chapter}</h3>`
              : ""

            const prevVerse = id > 0 ? data[id - 1].verse : 0
            // const verseNb = prevVerse !== word.verse
            //   ? `<div class='font-sans font-bold text-[5px] w-6 shrink-0 text-right mr-1'><sup>${word.verse}</sup></div>`
            //   : `<div class='font-sans font-bold text-[5px] w-6 shrink-0 text-right mr-1'><sup></sup></div>`
            const verseNb = prevVerse !== word.verse ? word.verse : ''

            return (`
              <div>
                ${chapHeading}


                <div class=''>
                  <div class='float-left flex flex-row ${lang === 'H' ? 'justify-items-end-safe min-w-[80px]' : 'min-w-[100px]'}'>
                    <div class='font-sans font-bold text-xs inline-block w-[12px] shrink-0 text-right mr-1'><sup>${verseNb}</sup></div>
                    <div class='font-times font-semibold ${lang === 'H' ? 'text-sm text-right ml-1' : 'text-sm'}'>${word.lemma}</div>
                    <div class='font-times font-normal text-center text-[8px] mx-1 pt-1 shrink-0 text-gray-500 dark:text-gray-400'>(${word.llbword.freq})</div>
                  </div>
                  <div class='${lang === 'H' ? ' pl-[80px]' : 'pl-[100px]'} font-times text-sm'>${word.llbword.gloss}</div>
                </div>
              </div>
            `)
          }).join('')}
        </div>
      </body>
    </html>
    `

    // Load HTML into Puppeteer
    const pdfBuffer = await generatePDF(html)

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="lexicon.pdf"',
      },
    })
  } catch (err: any) {
    console.error('Error in PDF route:', err)
    return NextResponse.json({ error: err.message || 'PDF generation failed' }, { status: 500 })
  }
}
