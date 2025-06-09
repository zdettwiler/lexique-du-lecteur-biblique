const { PrismaClient } = require('@prisma/client')
const { csv } = require('csvtojson')
const prisma = new PrismaClient()

async function main() {
  const jsonArrayObj = await csv().fromFile('/Users/zach/code/llb/prisma/llb_missing.csv')
  console.log(jsonArrayObj)

  jsonArrayObj.forEach(async w => {
    const updatedWord = await prisma.lLBWord.update({
      where: { strong: w.strong },
      data: { gloss: w.gloss }
    })
    console.log(updatedWord)
  })

  // const alice = await prisma.lLBWord.update({
  //   where: { email: 'alice@prisma.io' },
  //   update: {},
  //   create: {
  //     email: 'alice@prisma.io',
  //     name: 'Alice',
  //     posts: {
  //       create: {
  //         title: 'Check out Prisma with Next.js',
  //         content: 'https://www.prisma.io/nextjs',
  //         published: true,
  //       },
  //     },
  //   },
  // })


  // console.log({ alice, bob })
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
