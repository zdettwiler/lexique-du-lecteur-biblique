'use client'

import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { bookOptions, bookSectionsOptions } from '@/utils/booksMetadata'
import { useRouter } from 'next/navigation'

import { ArrowRight } from 'lucide-react'
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
  { label: 'Pégon/Duff', value: 'pegonduff' },
  { label: 'Débutant (<70×)', value: '70' },
  { label: 'Intermédiaire (<50×)', value: '50' },
  { label: 'Connaisseur (<30×)', value: '30' },
  { label: 'Expert (<10×)', value: '10' }
]

const formSchema = z.object({
  book: z.string().default('Genèse'), // z.enum(books).default('Genèse'),
  chapters: z.string().max(50).default('1'),
  occurences: z.string().default('70') // z.enum(occurenceOptions.map(o => o.value)).default('70')
})

type Props = {
  book: string,
  chapters: string,
  occurences: string,
  compact?: boolean
}

export default function LexiconForm({book, chapters, occurences, compact=false}: Props) {
  const router = useRouter()
  // const ref = useRef<HTMLDivElement>(null);
  // const [stuck, setStuck] = useState(false);

  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     ([entry]) => setStuck(!entry.isIntersecting),
  //     { threshold: 0 }
  //   );
  //   if (ref.current) observer.observe(ref.current);
  //   return () => observer.disconnect();
  // }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: !!book && !!occurences
    ? {
        book: book,
        chapters: chapters === '*' ? '' : chapters,
        occurences: occurences
      }
    : undefined,
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // localStorage.setItem('book', values.book)
    // localStorage.setItem('chapters', values.chapters === '' ? '*' : values.chapters)
    // localStorage.setItem('occurences', values.occurences)

    router.push(
      `/${values.book}/${!values.chapters || values.chapters === '' ? '*' : values.chapters}/${values.occurences}`,
      undefined,
      { shallow: true }
    )
  }

  return (
    <>
      {/* <div ref={ref}></div> */}
      <div className={`${compact ? '' : 'mt-10 p-5 lg:w-[850px] sm:w-5/6 md:mx-auto'} font-sans w-full`}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={`${compact ? 'space-x-1 flex flex-nowrap p-1' : 'lg:space-x-5 flex flex-wrap lg:flex-nowrap lg:items-end flex-col md:flex-row'}  `}>
            <div className={`${compact ? 'space-x-1 grow-2' : 'space-x-5 md:w-3/5 lg:w-3/5 md:pr-5 lg:pr-0 mb-4 w-full'} flex flew-row`}>
              <FormField
                control={form.control}
                name="book"
                render={({ field }) => (
                  <FormItem className={compact ? 'grow mb-0' : 'w-3/5'}>
                    {!compact && (<FormLabel className={''}>Livre</FormLabel>)}
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
                name="chapters"
                render={({ field }) => (
                  <FormItem className={compact ? 'w-10 mb-0' : 'w-2/5'}>
                    {!compact && (<FormLabel className=''>Chapitres</FormLabel>)}
                    <FormControl>
                      <Input placeholder='tous' {...field} />
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
                <FormItem className={compact ? ' mb-0' : ' mb-4 w-full md:w-2/5 lg:w-1/3'}>
                  {!compact && (<FormLabel className=''>Nb. d&apos;occurences</FormLabel>)}
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue>
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
            {compact
              ? <Button type="submit" size='icon' variant='secondary' className='size-9 grow-0'><ArrowRight /></Button>
              : <Button type="submit" size='sm' className='font-sans font-medium grow-0 mx-auto mt-4 mb-4'>Générer le lexique</Button>
            }
          </form>
        </Form>
      </div>
    </>
  );
}
