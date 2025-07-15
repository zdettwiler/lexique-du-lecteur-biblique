import { Prisma } from '@prisma/client'
import { type BookName } from '@/utils/booksMetadata'

export type BibleWithLLB = Prisma.BibleGetPayload<{
  include: {
    llbword: {
      select: {
        gloss: true;
        freq: true;
      };
    }
  }
}>;
export type LLBWithBible = {
  strong: string
  lemma: string
  gloss: string
  freq: number
  bibleword: {
    book: BookName
    chapter: number
    verse: number
  }[]
}
