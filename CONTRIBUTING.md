# Installation

Pour installer l'application localement :

```bash
# 1. Cloner le dépôt, par exemple :
git clone git@github.com:zdettwiler/lexique-du-lecteur-biblique.git
# 2. Installer les dépendences
npm install
# 3. Ajouter un fichier .env sur la base de l'exemple
cp .env.example .env
```

**⚠️ vérifier que le contenu du `.env` est correct avant les prochaines étapes**

```bash
# 4. Préparer la base de donnée
npx prisma db push
# 5. Importer le LLB dans la BDD
npm run db:import
# 6. Lancer l'application pour le développement
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
