"use server";

import type { BibleWithLLB } from "@/types";
import {
  llbCorrectionFormSchema,
  LLBCorrectionFormSchemaType,
} from "@/utils/validationLLBCorrectionForm";

export default async function sendLLBCorrectionForm(
  formData: LLBCorrectionFormSchemaType,
  word: BibleWithLLB,
) {
  console.log("sending feedback for:", word.strong);
  const raw = {
    name: formData.name,
    email: formData.email,
    correctedGloss: formData.correctedGloss,
    originalGloss: word.llbword.gloss,
  };

  const parse = llbCorrectionFormSchema.safeParse(raw);
  if (!parse.success) {
    return { success: false, errors: parse.error.flatten().fieldErrors };
  }

  const res = await fetch(process.env.NEXT_PUBLIC_GOOGLESHEETS_FEEDBACK, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: JSON.stringify({
      ...parse.data,
      originalGloss: undefined,
      book: word.book,
      chapter: word.chapter,
      verse: word.verse,
      strong: word.strong,
      lemma: word.lemma,
    }),
  });

  return res.ok
    ? { success: true }
    : { success: false, errors: { server: ["Could not submit feedback."] } };
}
