// 'use client'

import Title from "@/components/Title";
import LexiconForm from "@/components/LexiconForm";
import Lexicon from "@/components/Lexicon";
import { Suspense } from "react";
import { LoaderCircle } from "lucide-react";
import type { BookName } from "@/types";

export default async function Home({
  params,
}: {
  params: { ref?: [BookName, string, string] };
}) {
  const ref = await params;

  const [book, chapter, occurences] =
    Array.isArray(ref.ref) && ref.ref.length === 3
      ? [
          decodeURIComponent(ref.ref[0]) as BookName,
          Number(decodeURIComponent(ref.ref[1])),
          decodeURIComponent(ref.ref[2]),
        ]
      : [undefined, undefined, undefined];

  return (
    <main className="container mx-auto dark:bg-red">
      <Title />
      <LexiconForm
        book={book}
        chapter={Number(chapter)}
        occurences={occurences}
      />
      <Suspense
        fallback={
          <LoaderCircle className="animate-spin size-10 text-primary text-center mx-auto mt-20" />
        }
      >
        <Lexicon
          book={book}
          chapter={Number(chapter)}
          occurences={occurences}
        />
      </Suspense>
    </main>
  );
}
