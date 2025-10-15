import sanitiseRef from '@/utils/sanitiseRef'
import type { BibleWithLLB, BookName } from '@/types'
import { NextResponse, type NextRequest } from 'next/server'
import { generatePDF } from '@/utils/pdf'
import { bookMeta } from '@/utils/booksMetadata'

export async function POST(req: NextRequest) {
  return NextResponse.json(
    { error: 'Erreur: Problème de paramètres.' },
    { status: 400 }
  )
  try {
    const { ref } = await req.json()

    if (!ref) {
      return NextResponse.json(
        { error: 'Erreur: Problème de paramètres.' },
        { status: 400 }
      )
    }

    const sainRef = sanitiseRef(ref.book, ref.chapters, ref.occurrences)
    if (!sainRef) {
      return NextResponse.json(
        { error: 'Erreur: Problème de paramètres.' },
        { status: 400 }
      )
    }

    const data = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/llb/ref/${sainRef.book}/${sainRef.chapters}/${sainRef.occurrences}`
    )
    const { lexicon }: { lexicon: BibleWithLLB[] } = await data.json()
    if (!lexicon) {
      return NextResponse.json(
        { error: 'Aucun lexique trouvé.' },
        { status: 404 }
      )
    }

    const title =
      sainRef.chapters && sainRef.chapters !== '*'
        ? `${bookMeta[sainRef.book as BookName].fullName} ${String(sainRef.chapters).replace('-', '–')}`
        : bookMeta[sainRef.book as BookName].fullName

    const nbUniqueWords: number = new Set(lexicon.map((w) => w.strong)).size
    const lang = lexicon[0].strong[0]
    const testament =
      lang === 'H' ? "l'Ancien Testament" : 'le Nouveau Testament'

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
              ${
                sainRef.occurrences === 'pegonduff'
                  ? `${nbUniqueWords} mots n'ont pas été appris dans les manuels de Pégon et Duff.`
                  : `${nbUniqueWords} mots apparaissent moins de ${sainRef.occurrences} fois dans ${testament}`
              }
              <br />
              Entre parenthèses figure le nombre d&apos;occurrences du mot dans ${testament}. <br/>
              Généré par <a class='underline' href='https://lexique.ibbxl.be'>lexique.ibbxl.be</a>.
            </p>
          </div>

          <div class='columns-2'>
            ${lexicon
              .map((word: BibleWithLLB, id: number, data: BibleWithLLB[]) => {
                const prevChapter = id > 0 ? data[id - 1].chapter : 0
                const chapHeading =
                  prevChapter !== word.chapter
                    ? `<h3 class='col-span-all font-times text-sm text-center italic uppercase tracking-[5px] mt-5 mb-3'>CHAPITRE ${word.chapter}</h3>`
                    : ''

                const prevVerse = id > 0 ? data[id - 1].verse : 0
                const verseNb = prevVerse !== word.verse ? word.verse : ''

                return `
                <div>
                  ${chapHeading}


                  <div class=''>
                    <div class='float-left flex flex-row ${lang === 'H' ? 'justify-items-end-safe min-w-[80px]' : 'min-w-[100px]'}'>
                      <div class='font-sans font-bold text-xs inline-block w-[12px] shrink-0 text-right mr-1'><sup>${verseNb}</sup></div>
                      <div class='font-times font-semibold ${lang === 'H' ? 'text-sm text-right grow ml-1' : 'text-sm'}'>${word.lemma}</div>
                      <div class='font-times font-normal text-center text-[8px] mx-1 pt-1 shrink-0 text-gray-500 dark:text-gray-400'>(${word.llbword.freq})</div>
                    </div>
                    <div class='${lang === 'H' ? ' pl-[80px]' : 'pl-[100px]'} font-times text-sm'>${word.llbword.gloss}</div>
                  </div>
                </div>
              `
              })
              .join('')}
          </div>
        </body>
      </html>
    `

    const pdfBuffer = await generatePDF(html)

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="lexicon.pdf"'
      }
    })
  } catch (err) {
    console.error('Error generating PDF:', err)
    return NextResponse.json(
      { error: 'Error: Echec de génération du PDF.' },
      { status: 500 }
    )
  }
}
