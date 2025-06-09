### Update db via prisma
```npx prisma db push```

### Update some data from csv
- Edit file `./prisma/batchUpdate.js` to fit the new data
- Provide data in `./prisma/llb_missing.csv`
- Run `node prisma/batchUpdate.js`
