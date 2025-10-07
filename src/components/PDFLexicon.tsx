'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { LoaderCircle, FileText, Loader2, Download } from 'lucide-react'
import type { BookName, BibleWithLLB } from '@/types'

type Props = {
  book: BookName | undefined,
  chapters: string | undefined,
  occurences: string | undefined
}

export default function PDFLexicon({ book, chapters, occurences }: Props) {
  // const [loaded, setLoaded] = useState(false);

  // return (
  //   <>
  //     {!loaded && (
  //       <div className="">
  //         Loading PDF…
  //       </div>
  //     )}
  //     <iframe
  //       src={`${process.env.NEXT_PUBLIC_URL}/api/llb/pdf/${book}/${chapters}/${occurences}`}
  //       title="PDF Preview"
  //       width="100%"
  //       height="700"
  //       className={`rounded-md border shadow-sm ${loaded ? '' : 'hidden'}`}
  //       onLoad={() => setLoaded(true)}
  //     />
  //   </>
  // );



  // if (!book || !chapters || !occurences) {
  //   return
  // }

  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  const fetchPDF = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/llb/pdf/${book}/${chapters}/${occurences}`)
    if (!res.ok) throw new Error('Failed to fetch PDF')

    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    setPdfUrl(url)
  }

  useEffect(() => {
    if (!pdfUrl) fetchPDF()

    // Cleanup
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl)
    }
  }, [pdfUrl])

  if (!pdfUrl) {
    return (
      <div className="mx-auto text-primary text-center">
        <LoaderCircle className="animate-spin size-10 text-primary text-center mx-auto mt-10" />
        <span className="text-sm">Génération du PDF...</span>
      </div>
    )
  }

  return (
    <div className='container max-w-[600px] mx-auto text-center px-4 mt-10'>
      <a href={pdfUrl} download={`${book} ${chapters?.replace('-', '–')} (<${occurences}×) - Lexique du lecteur biblique.pdf`}>
        <Button size='sm' variant='secondary'>
          <Download className="mr-2 h-4 w-4" />
          {`Télécharger le PDF`}
        </Button>
      </a>
      <iframe
        src={pdfUrl}
        title={`${book} ${chapters?.replace('-', '–')} (${occurences}) - Lexique du lecteur biblique`}
        width="100%"
        height="700"
        className="my-10 rounded-md border shadow-sm"
      />
    </div>
  )


  // useEffect(() => {
  //   return () => {
  //     if (pdfUrl) { URL.revokeObjectURL(pdfUrl) }
  //   }
  // }, [pdfUrl])

  // const handleGeneratePDF = async () => {
  //   setLoading(true)
  //   setPdfUrl(null)

  //   try {
  //     const res = await fetch('/api/llb/pdf')
  //     if (!res.ok) throw new Error('PDF generation failed')

  //     const blob = await res.blob()
  //     const url = URL.createObjectURL(blob)
  //     setPdfUrl(url)

  //   } catch (err) {
  //     console.error(err)
  //     alert('Error generating PDF')

  //   } finally {
  //     setLoading(false)
  //   }
  // }

  // const handleDownload = () => {
  //   const link = document.createElement('a')
  //   link.href = pdfUrl!
  //   link.download = `${section} – Lexique du Lecteur Biblique.pdf`
  //   link.click()
  // }

  // return (
  //   <div className="flex flex-col items-center gap-4 mt-12">
  //     {!pdfUrl ? (
  //       <Button onClick={handleGeneratePDF} disabled={loading} size='sm' variant='secondary'>
  //         {loading
  //           ? (<Loader2 className="mr-2 h-4 w-4 animate-spin" />)
  //           : (<FileText className="mr-2 h-4 w-4" />)
  //         } {section}
  //       </Button>
  //     ) : (
  //       <Button onClick={handleDownload} size='sm' variant='secondary'>
  //         <Download className="mr-2 h-4 w-4" />
  //         {section}
  //       </Button>
  //     )}
  //   </div>
  // )
}
