import { Prisma } from '@prisma/client';

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
