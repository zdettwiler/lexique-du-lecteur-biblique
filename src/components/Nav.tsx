'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import DarkModeSwitch from '@/components/DarkModeSwitch'
import LexiconForm from '@/components/LexiconForm'

export default function Nav({
  book, chapters, occurences
}: {
  book: string,
  chapters: string,
  occurences: string
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 350;
      setShow(window.scrollY > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    // <nav className='left-0 w-full bg-neutral-100/30 dark:bg-neutral-950/30 backdrop-blur-md text-white p-4 z-50 transform transition-all duration-300'>
    <nav className="fixed top-0 left-0 w-full bg-background/80 dark:bg-background/30 backdrop-blur-md py-2 px-4 z-50">
      <div className="flex flex-row items-center justify-between">
        {/* <div className={`${show ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'} transform transition-all duration-300`}>
          <h3 className="font-bold text-xl text-primary">{book} {chapters} {occurences}</h3>
        </div> */}
        <div className="max-w-[550px]">
          <LexiconForm
            book={book}
            chapters={chapters}
            occurences={occurences}
            compact
          />
        </div>
        <div className="space-x-4">
          <Link href="" className="text-md font-medium text-accent-foreground">Télécharcher le LLB</Link>
          <DarkModeSwitch />
        </div>
      </div>
    </nav>
  )
};
