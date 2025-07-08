import Title from '@/components/Title'
import { Progress } from "@/components/ui/progress"
import { db } from '@/lib/db'
import { LLBWord } from '@prisma/client'
import moment from 'moment'
import 'moment/locale/fr'
moment.locale('fr')

export default async function ChangelogPage() {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const updatedWords = await db.lLB.findMany({
    where: {
      updatedAt: { gte: threeMonthsAgo, },
    },
    orderBy: {
      updatedAt: 'desc',
    }
  })

  const updatedWordsCount = await db.lLB.count({
    select: {
      _all: true, // Count all records
      updatedAt: true, // Count all non-null field values
    },
  })

  const groupedByDay: Record<string, LLB[]> = updatedWords.reduce((acc: Record<string, LLB[]>, word) => {
    const day = moment(word.updatedAt).format('YYYY-MM-DD');
    if (!acc[day]) acc[day] = [];
    acc[day].push(word);
    return acc;
  }, {});

  return updatedWords && updatedWords.length && (
    <div className=''>
      <Title />
      <div className='container max-w-[600px] mx-auto px-4 mt-10'>
        <h2 className='font-sans font-semibold text-2xl text-center'>Dernières modifications du lexique</h2>
        <div className='mt-5 mb-10 w-[60%] m-auto'>
          <Progress value={100 * updatedWordsCount.updatedAt / updatedWordsCount._all} className="w-full" />
          <p className='font-medium text-gray-500 text-sm mt-1'>{(100 * updatedWordsCount.updatedAt / updatedWordsCount._all).toFixed(1)}% des mots vérifiés</p>
        </div>

        {Object.entries(groupedByDay).map(([date, words]) => (
          <div key={date}>
            <h3 className='font-serif text-lg text-center italic mt-5 mb-3'>{moment(date).format('ddd D MMMM YYYY')}</h3>
            <ul>
              {words.map((word) => (
                <li key={word.strong} className='flex flex-row'>
                  <div className={`shrink-0 font-serif font-semibold min-w-[120px] ${word.strong[0] === 'H' ? 'text-2xl' : 'text-xl'} `}>{word.lemma}</div>
                  <div className='font-serif text-xl grow '>{word.gloss} <span className='inline-flex items-center rounded-md bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 px-1 text-xs font-sans font-semibold border border-gray-500'>{word.strong}</span></div>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <h3 className='font-serif text-lg text-center mt-10 mb-3'>et bien plus encore dans le passé...</h3>
      </div>
    </div>
  )
}
