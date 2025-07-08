const { PrismaClient } = require('@prisma/client')
const { csv } = require('csvtojson')
const prisma = new PrismaClient()

async function main() {
  let llb = await csv().fromFile('/Users/zach/code/lexique-du-lecteur-biblique/data/llb.csv')
  let bible = await csv().fromFile('/Users/zach/code/lexique-du-lecteur-biblique/data/bible.csv')

  console.log('format llb')
  llb = llb.map(word => {
    const timestamp = Date.parse(word.updatedAt)
    const updatedAt = isNaN(timestamp) ? null : new Date(timestamp)
    return {
      strong: word.strong,
      lemma: word.lemma,
      gloss: word.gloss,
      freq: Number(word.freq),
      updatedAt
    }
  })

  console.log('format bible')
  bible = bible.map(word => ({
    id: Number(word.id),
    book: word.book,
    chapter: Number(word.chapter),
    verse: Number(word.verse),
    word: word.word,
    lemma: word.lemma,
    strong: word.strong
  }))

  // for (const word of llb) {
  //   const timestamp = Date.parse(word.updatedAt)
  //   const updatedAt = isNaN(timestamp) ? null : new Date(timestamp)
  //   await prisma.LLB.upsert({
  //     where: { strong: word.strong },
  //     update: {
  //       lemma: word.lemma,
  //       gloss: word.gloss,
  //       freq: Number(word.freq),
  //       updatedAt
  //     },
  //     create: {
  //       strong: word.strong,
  //       lemma: word.lemma,
  //       gloss: word.gloss,
  //       freq: Number(word.freq),
  //       updatedAt
  //     },
  //   });
  //   console.log(word.strong)
  // }

  // for (const word of bible) {
  //   await prisma.Bible.upsert({
  //     where: { id: Number(word.id) },
  //     update: {
  //       book: word.book,
  //       chapter: Number(word.chapter),
  //       verse: Number(word.verse),
  //       word: word.word,
  //       lemma: word.lemma,
  //       strong: word.strong,
  //     },
  //     create: {
  //       id: Number(word.id),
  //       book: word.book,
  //       chapter: Number(word.chapter),
  //       verse: Number(word.verse),
  //       word: word.word,
  //       lemma: word.lemma,
  //       strong: word.strong,
  //     },
  //   });
  //   console.log(word.book, word.chapter, word.verse)
  // }

  console.log('wipe')
  await prisma.Bible.deleteMany(); // wipe
  await prisma.LLB.deleteMany(); // wipe

  console.log('populate LLB')
  await prisma.LLB.createMany({ data: llb });
  console.log('populate Bible')
  await prisma.Bible.createMany({ data: bible });
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
