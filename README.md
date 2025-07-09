## Installation de la base de donnée
```bash
npm install
npx prisma db push
npm run db:import
```

## Editer le LLB
Toutes les modifications peuvent être faites via l'interface de Prisma Studio
```bash
npx prisma studio
```

## Mettre à jour le LLB
Pour mettre à jour le LLB, exporter les tables de la BDD ainsi:
```bash
npm run db:export
```
Ceci remplacera les fichiers suivants, qui pourront faire l'objet d'un _commit_:
- data/llb.csv
- data/bible.csv
- data/pegonduff.csv
