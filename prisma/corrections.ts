import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface LexiqueUpdate {
  strong: string
  gloss: string
  lemma?: string // optionnel si tu souhaites aussi ajuster le lemme
}

const corrections: LexiqueUpdate[] = [
  { strong: 'G0212', gloss: 'négliger, délaisser' },
  { strong: 'G0287', gloss: 'récompense, don en retour' },
  { strong: 'G0320', gloss: 'lecture' },
  { strong: 'G0423', gloss: 'irréprochable, irrépréhensible' },
  { strong: 'G0482', gloss: '(moy.) aider; se dévouer à' },
  { strong: 'G0487', gloss: 'rançon' },
  { strong: 'G0686', gloss: 'ainsi, alors; peut-être, par hasard' },
  { strong: 'G0728', gloss: 'arrhes' },
  { strong: 'G0831', gloss: 'avoir autorité sur' },
  { strong: 'G0952', gloss: 'profane' },
  { strong: 'G1033', gloss: 'nourriture, aliment' },
  { strong: 'G1103', gloss: 'vrai ; véritable, sincère' },
  { strong: 'G1228', gloss: 'calomniateur, médisant • (subst.) le diable' },
  { strong: 'G1261', gloss: 'pensée; raisonnement; contestation' },
  { strong: 'G1351', gloss: 'à deux langages, fourbe' },
  {
    strong: 'G1624',
    gloss: '(moy.) se détourner, éviter; (pass.) se démettre'
  },
  { strong: 'G1677', gloss: 'mettre au compte de, imputer, attribuer' },
  { strong: 'G1789', gloss: '(pass.) être élevé, être instruit' },
  {
    strong: 'G1907',
    gloss: "s'attacher à, présenter; remarquer, prêter attention; rester"
  },
  { strong: 'G1933', gloss: 'doux, indulgent, gentil' },
  { strong: 'G1936', gloss: 'imposition (des mains)' },
  { strong: 'G2130', gloss: 'généreux, libéral, prêt à donner' },
  { strong: 'G2310', gloss: 'fondement' },
  { strong: 'G2689', gloss: 'vêtement' },
  { strong: 'G2843', gloss: 'généreux, prompt à partager' },
  { strong: 'G3123', gloss: 'plus ; surtout' },
  { strong: 'G3191', gloss: 'pratiquer, cultiver ; méditer, penser à' },
  { strong: 'G3336', gloss: 'participation, partage' },
  { strong: 'G3346', gloss: 'prendre, déplacer ; changer ; (moy.) déserter' },
  {
    strong: 'G3687',
    gloss: 'appeler, nommer ; prononcer, invoquer ; (pass.) être connu'
  },
  { strong: 'G3877', gloss: '(+D) suivre de près, suivre fidèlement' },
  {
    strong: 'G3954',
    gloss:
      'franchise, liberté de parole ; ouverture au public ; assurance, confiance, audace'
  },
  { strong: 'G4241', gloss: 'convenir, être convenable' },
  { strong: 'G4286', gloss: 'plan, but, dessein; présentation' },
  {
    strong: 'G4291',
    gloss:
      '(act. ou moy. +G) diriger, conduire; (moy. +G) prêter attention à, avoir soin de, venir en aide'
  },
  {
    strong: 'G4295',
    gloss: 'être placé devant, être proposé, être présent/exposé'
  },
  {
    strong: 'G4306',
    gloss:
      '(moy. +G) pourvoir à, prendre soin de ; (moy. +A) rechercher, veiller à'
  },
  { strong: 'G4586', gloss: 'digne, respectable' },
  { strong: 'G4587', gloss: 'sérieux, dignité, honnêteté' },
  { strong: 'G4684', gloss: "vivre dans le luxe, s'adonner au plaisir" },
  { strong: 'G5197', gloss: 'personne insolente, personne arrogante' },
  { strong: 'G5294', gloss: 'exposer, risquer ; (moy.) proposer, enseigner' },
  { strong: 'G5487', gloss: 'combler de grâce, gratifier' },
  { strong: 'G6027', gloss: 'ἐκζήτησις recherches inutiles, spéculations' }
]

async function main() {
  console.log(
    `Lancement de la mise à jour pour ${corrections.length} entrées...`
  )

  const updates = corrections.map((item) =>
    prisma.lLB.update({
      where: { strong: item.strong },
      data: {
        gloss: item.gloss,
        ...(item.lemma ? { lemma: item.lemma } : {})
      }
    })
  )

  try {
    const results = await prisma.$transaction(updates)
    console.log(
      `✅ Succès : ${results.length} mots mis à jour dans le lexique.`
    )
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour :', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
