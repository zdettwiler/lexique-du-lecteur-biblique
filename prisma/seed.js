const { PrismaClient } = require('@prisma/client')
const csvtojson = require("csvtojson");
const LLB = require('../src/app/[[...params]]/LLB.json')
const prisma = new PrismaClient()

async function getTHHOT () {
  return await csvtojson().fromFile('./prisma/thhot.csv')
}
async function getTHGNT () {
  return await csvtojson().fromFile('./prisma/thgnt.csv')
}

async function main () {
  console.time('Seeding')
  const thhot = await getTHHOT()
  const thgnt = await getTHGNT()
  const bible = [...thhot, ...thgnt]
  let currentBook = bible[0].book

  for (const thWord of bible) {
    if (currentBook != thWord.book) {
      currentBook = thWord.book
      console.log(currentBook)
    }

    const lang = thWord.strong[0]
    const llbWord = LLB.lexique[lang].find(llbWord =>
      `${lang}${llbWord.strongNb.toString().padStart(4, '0')}` === thWord.strong
    ) || {
      strongNb: null,
      hebreu: '',
      gloss: '',
      freq: null,
      vu: false
    }

    await prisma.bibleWord.create({
      data: {
        book: thWord.book,
        chapter: Number(thWord.chapter),
        verse: Number(thWord.verse),
        word: thWord.orig,
        lemma: thWord.lex,
        llbword: {
          connectOrCreate: {
            where: {
              strong: thWord.strong,
            },
            create: {
              strong: thWord.strong,
              lemma: thWord.lex,
              gloss: llbWord.gloss,
              freq: Number(llbWord.freq),
              vu: Boolean(llbWord.vu)
            }
          }
        }
      }
    })
  }

  console.timeEnd('Seeding')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
