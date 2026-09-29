import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface LexiqueUpdate {
  strong: string
  gloss: string
  lemma?: string // optionnel si tu souhaites aussi ajuster le lemme
}

const corrections: LexiqueUpdate[] = [
  { strong: 'H3618', gloss: 'mariée, fiancée; belle-fille' },
  {
    strong: 'H5702',
    gloss: "(nif.) se renfermer (d'une femme qui demeure célibataire)"
  },
  {
    strong: 'H5848',
    gloss:
      "▲ I. (qal) se détourner ￭ II. (qal) s'envelopper ￭ III. (qal) être faible • (nif.) défaillir • (hif.) montrer de la faiblesse • (hit.) défaillir, s'évanouir"
  },
  { strong: 'H6089', gloss: 'douleur, peine, labeur' },
  {
    strong: 'H6245',
    gloss: '(qal) être poli, être resplendissant; (hitp.) penser, se souvenir'
  },
  { strong: 'H6569', gloss: 'matière fécale' },
  {
    strong: 'H6635',
    gloss:
      "*vb.* faire la guerre, combattre, s'enfler; *n. m.* armée, guerre, combat, service"
  },
  { strong: 'H6921', gloss: "est, orient; vent d'est" },
  {
    strong: 'H7114',
    gloss:
      '▲ I. (qal) être court; être impatient • (piel) raccourcir • (hif.) raccourcir ￭ II. (qal) moissonner'
  },
  { strong: 'H7641', gloss: 'épi; torrent' },
  { strong: 'H7768', gloss: '(piel) crier au secours' },
  { strong: 'H8032', gloss: 'avant-hier, il y a trois jours' },
  { strong: 'H8071', gloss: 'manteau, couverture, vêtement' },
  { strong: 'H8198', gloss: 'servante, domestique' }
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
