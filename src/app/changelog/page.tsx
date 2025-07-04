import Title from '@/components/Title'
import { db } from '@/lib/db'
import { LLBWord } from '@prisma/client'
import moment from 'moment'
import 'moment/locale/fr'
moment.locale('fr')

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
  // console.log(JSON.stringify(updatedWords))
  // const updatedWords = [{"strong":"G4642","lemma":"σκληρός","gloss":"dur, rude, sévère","freq":5,"updatedAt":"2025-06-06T10:19:19.000Z"},{"strong":"G3911","lemma":"παραφέρω","gloss":"éloigner, entraîner, emporter","freq":4,"updatedAt":"2025-06-06T10:10:40.000Z"},{"strong":"H7845","lemma":"שַׁ֫חַת","gloss":"fosse, tombe","freq":23,"updatedAt":"2025-06-06T09:38:10.000Z"},{"strong":"H7095","lemma":"קֶ֫צֶב","gloss":"forme; extrémité","freq":3,"updatedAt":"2025-06-06T09:34:18.000Z"},{"strong":"H8628","lemma":"תָּקַע","gloss":"frapper; enfoncer; sonner (d'un instrument)","freq":69,"updatedAt":"2025-06-06T09:18:34.000Z"},{"strong":"H8219","lemma":"שְׁפֵלָה","gloss":"plaine, vallée","freq":20,"updatedAt":"2025-06-06T09:13:54.000Z"},{"strong":"H4867","lemma":"מִשְׁבָּר","gloss":"flot, vague","freq":5,"updatedAt":"2025-06-05T10:44:44.000Z"},{"strong":"G4107","lemma":"πλανήτης","gloss":"errant, vagabond","freq":1,"updatedAt":"2025-06-04T10:56:48.000Z"},{"strong":"H4688","lemma":"מְצוֹלָה","gloss":"fond, profondeur","freq":11,"updatedAt":"2025-06-04T10:29:38.000Z"},{"strong":"H4578","lemma":"מֵעֶה","gloss":"entrailles, ventre, sein, cœur","freq":32,"updatedAt":"2025-06-04T10:28:28.000Z"},{"strong":"H1157","lemma":"בְּעַד et בַּעַד","gloss":"autour; pour, en faveur de; derrière, à travers, parmi","freq":105,"updatedAt":"2025-05-30T09:48:53.000Z"},{"strong":"H7911","lemma":"שָׁכַח","gloss":"oublier","freq":102,"updatedAt":"2025-05-29T09:58:55.000Z"},{"strong":"H3498","lemma":"יָתַר","gloss":"(Qal) rester; (Nif) rester, demeurer; (Hif) faire rester, conserver, épargner, donner l'abondance","freq":106,"updatedAt":"2025-05-29T09:56:33.000Z"},{"strong":"H8672","lemma":"תֵּ֫שַׁע","gloss":"neuf, neuvaine","freq":58,"updatedAt":"2025-05-29T09:47:15.000Z"},{"strong":"H3162","lemma":"יָחְדָּו","gloss":"ensemble","freq":141,"updatedAt":"2025-05-29T09:37:54.000Z"},{"strong":"H4035","lemma":"מְגוּרָה","gloss":"grenier à grain","freq":1,"updatedAt":"2025-05-28T11:06:01.000Z"},{"strong":"G2018","lemma":"ἐπιφέρω","gloss":"porter, prononcer (un jugement); infliger, donner cours","freq":2,"updatedAt":"2025-05-28T10:02:11.000Z"},{"strong":"G1890","lemma":"ἐπαφρίζω","gloss":"rejeter l'écume, écumer","freq":1,"updatedAt":"2025-05-28T09:52:53.000Z"},{"strong":"H3651","lemma":"כֵּן","gloss":"(adj) droit, loyal, sincère; (adv) bien, ainsi, donc, de cette manière, autant, comme, de même que...","freq":765,"updatedAt":"2025-05-23T11:16:09.000Z"},{"strong":"H6245","lemma":"עָשַׁת","gloss":"(Qal) être poli, être resplendissant; (Hitp) penser, se souvenir","freq":2,"updatedAt":"2025-05-21T08:59:17.000Z"},{"strong":"G0679","lemma":"ἄπταιστος","gloss":"qui est sans chute","freq":1,"updatedAt":"2025-05-15T09:07:37.000Z"},{"strong":"H2904","lemma":"טוּל","gloss":"(Hif) jeter; (Hof) être renversé, être jeté, être rejeté; (Pilp) rejeter, transporter","freq":14,"updatedAt":"2025-05-07T10:57:09.000Z"},{"strong":"H5337","lemma":"נָצַל","gloss":"(Pi) arracher, dépouiller, piller, (Nif) être délivré, se délivrer, (Hif) délivrer, sauver","freq":213,"updatedAt":"2025-03-28T09:22:39.000Z"},{"strong":"H6635","lemma":"צָבָא","gloss":"(vb) faire la guerre, combattre, s'enfler; (nm) armée, guerre, combat, service ","freq":484,"updatedAt":"2025-03-28T09:06:22.000Z"},{"strong":"H3411","lemma":"יַרְכָה","gloss":"flanc, côté, parties extrêmes, extrémité, fond","freq":28,"updatedAt":"2025-03-20T09:58:46.000Z"},{"strong":"H3420","lemma":"יֵרָקוֹן","gloss":"nielle, rouille; pâleur, lividité","freq":6,"updatedAt":"2025-03-12T08:58:48.000Z"}]

  const groupedByDay: Record<string, LLBWord[]> = updatedWords.reduce((acc: Record<string, LLBWord[]>, word) => {
    const day = moment(word.updatedAt).format('YYYY-MM-DD');
    if (!acc[day]) acc[day] = [];
    acc[day].push(word);
    return acc;
  }, {});

  return updatedWords && updatedWords.length && (
    <div className=''>
      <Title />
      <div className='container max-w-[600px] mx-auto px-4 mt-10'>
        <h2 className='font-sans font-semibold text-2xl'>Dernières modifications du LLB</h2>
        {Object.entries(groupedByDay).map(([date, words]) => (
          <div key={date}>
            <h3 className='font-serif text-lg text-center italic mt-5 mb-3'>{moment(date).format('ddd D MMMM YYYY')}</h3>
            <ul>
              {words.map((word) => (
                <li key={word.strong} className='flex flex-row'>
                  <div className={`shrink-0 font-serif font-semibold min-w-[120px] ${word.strong[0] === 'H' ? 'text-2xl' : 'text-xl'} `}>{word.lemma}</div>
                  <div className='font-serif text-xl grow '>{word.gloss} <span className='inline-flex items-center rounded-md bg-gray-50 text-gray-500 px-1 text-xs font-sans font-semibold  ring-1 ring-gray-500/20 ring-inset'>{word.strong}</span></div>
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
