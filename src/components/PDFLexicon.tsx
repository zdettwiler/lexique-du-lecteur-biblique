'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { LoaderCircle, FileText, Loader2, Download } from 'lucide-react'
import type { BookName, BibleWithLLB } from '@/types'

type Props = {
  book: BookName | undefined
  chapters: string | undefined
  occurences: string | undefined
  link?: boolean
}

export default function PDFLexicon({
  book,
  chapters,
  occurences,
  link = false
}: Props) {
  const [isLoading, setLoading] = useState<boolean>(!link)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  const fetchPDF = async () => {
    const start = Date.now()
    setLoading(true)
    try {
      const res = await fetch('/api/llb/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ref: { book, chapters, occurences } })
      })

      if (!res.ok) throw new Error('Failed to fetch PDF')

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      setPdfUrl(url)
    } catch (err) {
      console.error(err)
      alert('Error generating PDF')
    } finally {
      console.log(
        `Finished fetching PDF in ${Math.round(0.001 * (Date.now() - start))} s`
      )
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!pdfUrl && !link) fetchPDF()

    // Cleanup
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl)
    }
  }, [pdfUrl])

  if (!pdfUrl && !link && isLoading) {
    return (
      <div className="mx-auto text-primary text-center">
        <LoaderCircle className="animate-spin size-10 text-primary text-center mx-auto mt-10" />
        <span className="text-sm">Génération du PDF...</span>
      </div>
    )
  } else if (!pdfUrl && link && !isLoading) {
    return (
      <Button
        variant="outline"
        size="icon-sm"
        className="font-sans"
        onClick={fetchPDF}
      >
        <FileText />
      </Button>
    )
  } else if (!pdfUrl && link && isLoading) {
    return (
      <Button variant="outline" size="icon-sm" className="font-sans">
        <LoaderCircle className="animate-spin" />
      </Button>
    )
  } else if (pdfUrl && link && !isLoading) {
    return (
      <a
        href={pdfUrl}
        download={`${book} ${chapters} (<${occurences}×) - Lexique du lecteur biblique.pdf`}
      >
        <Button variant="outline" size="icon-sm" className="font-sans">
          <Download />
        </Button>
      </a>
    )
  } else if (pdfUrl && !link && !isLoading) {
    return (
      <div className="container max-w-[600px] mx-auto text-center px-4 mt-10">
        <a
          href={pdfUrl}
          download={`${book} ${chapters?.replace('-', '–')} (<${occurences}×) - Lexique du lecteur biblique.pdf`}
        >
          <Button size="sm" variant="secondary">
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
}
