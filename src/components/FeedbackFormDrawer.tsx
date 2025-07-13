'use client'
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer"
import type { LLB, Bible } from '@prisma/client'
import StrongTag from '@/components/StrongTag'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import sendFeedback from "@/actions/feedbackForm"
import { useTransition } from 'react'

export const formSchema = z.object({
  name: z.string().min(1, 'Un nom est requis'),
  email: z.string().email('Une adresse courriel valide est requise'),
  correctedGloss: z.string().min(1, "Vous n'avez pas fait de modification"),
  originalGloss: z.string().min(1)
}).refine(
  (data) => data.correctedGloss !== data.originalGloss,
  {
    message: "Le texte n'a pas été modifié",
    path: ['correctedGloss'], // show error under correctedGloss
  }
);

export type FormSchemaType = z.infer<typeof formSchema>;

export default function FeedbackFormDrawer(
{ isOpen, setIsOpen, word }:
{ isOpen: boolean, setIsOpen: (arg0: boolean) => void, word: LLB }) {


  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "test",
      email: "test@test.com",
      correctedGloss: word?.llbword.gloss
    },
  })

  form.setValue('correctedGloss', word?.llbword.gloss)
  form.setValue('originalGloss', word?.llbword.gloss)

  const onSubmit: SubmitHandler<FormSchema> = async (values) => {
    console.log(values)
    const result = await sendFeedback(values, word);
    console.log(result)
    // startTransition(() => {
    //   sendFeedback(formData, originalGloss).then((res) => {
    //     // handle success or display errors
    //   });
    // });
  }


  return word && (
    <>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent>
          <div className='w-full max-w-lg mx-auto'>
            <DrawerHeader>
              <DrawerTitle>Proposer une correction au LLB</DrawerTitle>
              <DrawerDescription>{word.lemma} <StrongTag strong={word.strong} /></DrawerDescription>
            </DrawerHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 px-4'>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse courriel</FormLabel>
                      <FormControl>
                        <Input placeholder="Adresse courriel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="correctedGloss"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Définition</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us a little bit about yourself"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className='w-full'>Envoyer</Button>
              </form>
            </Form>

            <DrawerFooter >
              <DrawerClose asChild>
                <Button variant="outline">Annuler</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}


