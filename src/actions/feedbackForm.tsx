'use server'

import { z } from 'zod'

import type { FormSchemaType } from '@/components/FeedbackFormDrawer'

const formSchema = z.object({
  name: z.string().min(1, 'Un nom est requis'),
  email: z.string().email('Une adresse courriel valide est requise'),
  correctedGloss: z.string().min(1, "Vous n'avez pas fait de modification"),
})

export default async function sendFeedback(formData: FormSchemaType, word) {
  console.log('sending feedback')
  const raw = {
    name: formData.name,
    email: formData.email,
    correctedGloss: formData.correctedGloss,
    originalGloss: word.llbword.gloss
  }

  const parse = formSchema.safeParse(raw)

  console.log(parse, formSchema)
  if (!parse.success) {
    return { success: false, errors: parse.error.flatten().fieldErrors };
  }

  const res = await fetch(process.env.NEXT_PUBLIC_GOOGLESHEETS_FEEDBACK, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({
      ...parse.data,
      originalGloss: undefined,
      book: word.book,
      chapter: word.chapter,
      verse: word.verse,
      strong: word.strong,
      lemma: word.lemma
    }),
  });

  console.log(res)

  return res.ok
    ? { success: true }
    : { success: false, errors: { server: ['Could not submit feedback.'] } };
}
