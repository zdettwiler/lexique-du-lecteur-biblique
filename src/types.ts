import { Prisma } from '@prisma/client'
import { books } from '@/utils/booksMetadata'

export type BibleWithLLB = Prisma.BibleGetPayload<{
  include: {
    llbword: {
      select: {
        gloss: true
        freq: true
      }
    }
  }
}>

export type BookName = (typeof books)[number]
