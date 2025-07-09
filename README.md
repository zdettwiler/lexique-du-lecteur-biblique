# 📓 Lexique du lecteur biblique

[Disponible ici](https://zdettwiler.github.io/lexique-du-lecteur-biblique/)

Un lexique pour le lecteur de la Bible dans ses langues originales. Au lieu d'être présentés dans un ordre alphabétique, les mots sont regroupés verset par verset pour faciliter la lecture cursive du texte. Pour prendre en compte son niveau, le lecteur peut choisir la rareté des mots figurant dans le lexique.

## Constitution des données
Le lexique **hébreu-français** est un recoupement:
- du texte biblique de [THHOT](https://github.com/STEPBible/STEPBible-Data/tree/master/Translators%20Amalgamated%20OT%2BNT);
- et du lexique Strong en français collecté chez [emcitv](https://emcitv.com/bible/strong-biblique-hebreu.html).

Le lexique **grec-français** est un recoupement:
- du texte biblique de [THGNT](https://github.com/STEPBible/STEPBible-Data/tree/master/Translators%20Amalgamated%20OT%2BNT);
- et du lexique de R. Pigeon publié chez [Bibles et Publications Chrétiennes](https://editeurbpc.com).

Les lexiques sont ensuite modifiés au fur et à mesure de leur utilisation et des corrections des utilisateurs.


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
