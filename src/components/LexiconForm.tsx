'use client'
import { useEffect } from 'react'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { books, bookChapters, bookOptions, bookSectionsOptions } from '@/utils/booksMetadata'
import type { BookName } from '@/types'
import createZodEnum from '@/utils/createZodEnum'
import { useRouter } from 'next/navigation'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel
} from "@/components/ui/select"

const occurenceOptions = [
  { label: 'Étudiant raté (<1000×)', value: '1000' },
  // { label: 'Pégon/Duff', value: 'pegonduff' },
  { label: 'Débutant (<70×)', value: '70' },
  { label: 'Intermédiaire (<50×)', value: '50' },
  { label: 'Connaisseur (<30×)', value: '30' },
  { label: 'Expert (<10×)', value: '10' }
]
const occurenceValues = occurenceOptions.map(o => o.value) as [string, ...string[]]

const formSchema = z.object({
  book: createZodEnum(books).default('Genèse'),
  chapter: z.coerce.number().int().min(1).default(1),
  occurences: z.enum(occurenceValues).default('70')
}).transform(form => {
  const maxChapters = bookChapters[form.book]

  return {
    ...form,
    chapter: Math.min(form.chapter, maxChapters),
  }
})

export default function LexiconForm({
  book, chapter, occurences
}: {
  book: BookName | undefined,
  chapter: number | undefined,
  occurences: string | undefined
}) {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      book: book || 'Genèse',
      chapter: chapter || 1,
      occurences: occurences || '70'
    }
  })
  const {reset} = form

  useEffect(() => {
    const storedForm = localStorage.getItem('lexicon-form')
    if (!storedForm || (book && chapter && occurences)) {
      localStorage.setItem('lexicon-form', JSON.stringify({ book, chapter, occurences }))
      return
    }
    try {
      const parsedStoredForm = JSON.parse(storedForm)
      reset({
        book: parsedStoredForm.book,
        chapter: Number(parsedStoredForm.chapter),
        occurences: parsedStoredForm.occurences
      })
    } catch (e) {
      console.error('Failed to parse form data from localStorage', e)
    }
  }, [reset])

  function onSubmit(values: z.infer<typeof formSchema>) {
    // TODO validate form here?
    localStorage.setItem('lexicon-form', JSON.stringify(values))
    router.push(`/${values.book}/${values.chapter}/${values.occurences}`)
  }

  const maxChapters = bookChapters[form.watch('book') as BookName]

  return (
    <div className="font-sans w-full lg:w-[850px] sm:w-5/6 md: mx-auto mt-10 p-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='box-border lg:space-x-5 flex flex-wrap lg:flex-nowrap lg:items-end flex-col md:flex-row'>
          <div className='space-x-5 md:pr-5 lg:pr-0 mb-4 w-full md:w-3/5 lg:w-3/5 flex flew-row'>
            <FormField
              control={form.control}
              name="book"
              render={({ field }) => (
                <FormItem className='w-3/5'>
                  <FormLabel className=''>Livre</FormLabel>
                  <Select key={field.value} onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Livre">
                          {bookOptions.find(book => book.value === field.value)?.label ?? ''}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {bookSectionsOptions.map((section, id) => (
                        <SelectGroup key={id}>
                          <SelectLabel>{section.section}</SelectLabel>
                          {section.options.map((option, id) => (
                            <SelectItem value={option.value} key={id}>{option.label}</SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="chapter"
              render={({ field }) => (
                <FormItem className='w-2/5'>
                  <FormLabel className=''>Chapitre</FormLabel>
                  <FormControl>
                    <Input placeholder='tous' type='number' {...field} onBlur={() => {
                      const value = Number(field.value);
                      if (value > maxChapters) {
                        form.setValue('chapter', maxChapters)
                      } else if (value < 1) {
                        form.setValue('chapter', 1)
                      }
                    }}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name='occurences'
            render={({ field }) => (
              <FormItem className='box-border mb-4 w-full md:w-2/5 lg:w-1/3'>
                <FormLabel className=''>Nb. d&apos;occurences</FormLabel>
                <Select key={field.value} onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Nb d&apos;occurences">
                        {occurenceOptions.find(occ => occ.value === field.value)?.label ?? ''}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {occurenceOptions.map((occ, id) => (
                      <SelectItem value={occ.value} key={id}>{occ.label} {occ.value==='pegonduff' && (<span className='ml-1 inline-flex items-center rounded-md bg-yellow-100 text-yellow-800 dark:bg-yellow-50/20 dark:text-yellow-300 px-1 text-xs font-medium border border-yellow-300'>Nouveau</span>)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" size='sm' className='font-sans font-medium grow-0 mx-auto mt-4 mb-4'>Générer le lexique</Button>
        </form>
      </Form>
    </div>
  );
}
