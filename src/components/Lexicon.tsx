import { Pencil } from "lucide-react";
import LexiconWord from "@/components/LexiconWord";
import ReferenceNavButtons from "@/components/ReferenceNavButtons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { BookName, BibleWithLLB } from "@/types";

type Props = {
  book: BookName | undefined;
  chapter: number | undefined;
  occurences: string | undefined;
};

export default async function Lexicon({ book, chapter, occurences }: Props) {
  if (!book || !chapter || !occurences) {
    return;
  }

  const data = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/llb/ref/${book}/${chapter}/${occurences}`,
  );
  const { lexicon }: { lexicon: BibleWithLLB[] } = await data.json();

  if (!lexicon) return [];

  const lang = lexicon[0].strong[0];
  const testament =
    lang === "H" ? "l'Ancien Testament" : "le Nouveau Testament";

  return (
    <div className="container max-w-[600px] mx-auto px-4 mt-10">
      <div className="font-serif text-center mb-7">
        <h1 className="uppercase text-center tracking-[12px] text-4xl">
          {book} {chapter}
        </h1>
        {/* <h2 className='uppercase tracking-widest text-lg'>Lexique du lecteur biblique</h2> */}

        <p className="italic mt-3">
          Mots apparaissant moins de {occurences} fois dans {testament}. <br />
          Entre parenthèses figure le nombre d&apos;occurences du mot dans{" "}
          {testament}.
        </p>
      </div>
      <Alert variant="default" className="has-[svg]:grid-cols-[auto_1fr]">
        <Pencil />
        <AlertTitle>Contribuez au LLB!</AlertTitle>
        <AlertDescription>
          Cliquez sur une définition pour proposer une correction.
        </AlertDescription>
      </Alert>

      {lexicon.map((word: BibleWithLLB, id: number, data: BibleWithLLB[]) => {
        const prevChapter = id > 0 ? data[id - 1].chapter : 0;
        const chapHeading =
          prevChapter !== word.chapter ? (
            <h3 className="font-serif text-lg text-center italic uppercase tracking-[5px] mt-5 mb-3">
              CHAPITRE {word.chapter}
            </h3>
          ) : null;

        const prevVerse = id > 0 ? data[id - 1].verse : 0;
        const verse = prevVerse !== word.verse ? word.verse : null;

        return (
          <LexiconWord
            key={id}
            chapHeading={chapHeading}
            verseNb={verse}
            word={word}
          />
        );
      })}

      <ReferenceNavButtons
        book={book}
        chapter={chapter}
        occurences={occurences}
      />
    </div>
  );
}
