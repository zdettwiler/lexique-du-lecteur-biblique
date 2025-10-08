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
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  const fetchPDF = async () => {
    try {
      console.time("Generating and fetching PDF")
      const res = await fetch('/api/llb/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ref: { book, chapters, occurences } }),
      })

      if (!res.ok) throw new Error('Failed to fetch PDF')

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      setPdfUrl(url)
    } catch (err) {
      console.error(err)
      alert('Error generating PDF')
    } finally {
      console.log('Finished fetching PDF')
      console.timeEnd("Generating and fetching PDF")
    }
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
}
