'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import DarkModeSwitch from '@/components/DarkModeSwitch'

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
    <nav className={`${show ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'} fixed top-0 left-0 w-full bg-neutral-100/30 dark:bg-neutral-950/30 backdrop-blur-md text-white p-4 z-50 transform transition-all duration-300 `}>
      <div className="flex flex-row items-center justify-end space-x-4">
        <div>
          <h3 className="font-bold text-lg">{book} {chapters} {occurences}</h3>
        </div>
        <Link href="" className="text-md font-medium text-gray-600 dark:text-gray-400">Télécharcher le LLB</Link>
        <DarkModeSwitch />
      </div>
    </nav>
  )
};
