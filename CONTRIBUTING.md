# Installation

Pour installer l'application localement :

```bash
# 1. Cloner le dépôt, par exemple :
git clone git@github.com:zdettwiler/lexique-du-lecteur-biblique.git
# 2. Installer les dépendences
npm install
# 3. Installer puppeteer
npx playwright install
# 4. Ajouter un fichier .env sur la base de l'exemple
cp .env.example .env
```

**⚠️ vérifier que le contenu du `.env` est correct avant les prochaines étapes**

```bash
# 5. Préparer la base de donnée
npx prisma db push
# 6. Importer le LLB dans la BDD
npm run db:import
# 7. Lancer l'application pour le développement
npm run dev
```

# Editer le LLB

Toutes les modifications peuvent être faites via l'interface de Prisma Studio

```bash
npx prisma studio
```

Une fois que les modifications sont faites (ne pas oublier d'enregistrer), exporter les tables dee la BDD ainsi:

```bash
npm run db:export
```

Ceci remplacera les fichiers suivants, qui pourront faire l'objet d'un _commit_:

- data/llb.csv
- data/bible.csv
- data/pegonduff.csv

# Exporter le LLB avec tag

On peut exporter le LLB avec les tags pour chaque occurence des mots (livre et chapitre):

```bash
npm run db:tag
```

Pour exporter les notes Strong grecques ou hébraïques avec les commentaires d'import Anki:

```bash
npm run db:tag gk
npm run db:tag hb
```

Ces commandes créent respectivement `data/llb-tagged-gk.csv` et `data/llb-tagged-hb.csv`, avec les paquets Anki `📖 Langues bibliques::LLB::Grec` et `📖 Langues bibliques::LLB::Hébreu`. Elles incluent les commentaires d'import pour le type de note `Vocabulaire LLB`; le champ CSV `inflectionEndings` est associé au champ Anki `inflections`. Sans argument, `npm run db:tag` conserve l'export combiné existant.
