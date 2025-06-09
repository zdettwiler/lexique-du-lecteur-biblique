import Title from '@/components/Title'
import { db } from '@/lib/db'

export default async function ChangelogPage() {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const updatedWords = await db.lLBWord.findMany({
    where: {
      updatedAt: { gte: threeMonthsAgo, },
    },
    orderBy: {
      updatedAt: 'desc',
    }
  })

  console.log(updatedWords.length)

  return updatedWords && updatedWords.length && (
    <div className='container max-w-[600px] mx-auto px-4 mt-10'>
      <Title />

      {updatedWords.map((word: LLBWord, id: number) => {
        return (
          <div key={id} className='flex flex-row items-baseline'>
            <div className={`shrink-0 font-sans font-semibold mr-3`}>{word.updatedAt.toLocaleDateString('fr-FR')}</div>
            <div className='font-serif text-xl grow '><b>{word.lemma}</b>: {word.gloss} (<span className='font-sans font-semibold text-xs'>{word.strong}</span>)</div>
          </div>
        )
      })}
    </div>
  )
}
