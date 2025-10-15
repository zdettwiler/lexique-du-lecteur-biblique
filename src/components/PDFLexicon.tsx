'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { LoaderCircle, FileText, FileDown, FileX, Download } from 'lucide-react'
import type { BookName } from '@/types'
import ErrorAlert from '@/components/ErrorAlert'

type Props = {
  book: BookName
  chapters: string
  occurrences: string
  link?: boolean
}

export default function PDFLexicon({
  book,
  chapters,
  occurrences,
  link = false
}: Props) {
  const [isLoading, setLoading] = useState<boolean>(!link)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isError, setError] = useState<boolean>(false)
  const fileName = `${book} ${chapters?.replace('-', '–')} (<${occurrences}×) - Lexique du lecteur biblique.pdf`

  const fetchPDF = useCallback(async () => {
    let url = pdfUrl
    if (!url) {
      const start = Date.now()
      setLoading(true)
      try {
        const res = await fetch('/api/llb/pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ref: { book, chapters, occurrences } })
        })

        if (!res.ok) throw new Error('Failed to fetch PDF')

        const blob = await res.blob()
        url = URL.createObjectURL(blob)
        setPdfUrl(url)
      } catch {
        setLoading(false)
        setError(true)
      } finally {
        console.log(
          `Finished fetching PDF in ${Math.round(0.001 * (Date.now() - start))} s`
        )
        setLoading(false)
      }
    }

    // Auto-download only if link mode
    if (link && url) {
      const a = document.createElement('a')
      a.className = 'download-lexicon' // class for GA
      a.href = url
      // a.download = fileName
      a.target = '_blank' // open in a new tab
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }, [book, chapters, occurrences, link, pdfUrl])

  useEffect(() => {
    if (!pdfUrl && !link && !isError) fetchPDF()

    // Cleanup
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl)
    }
  }, [pdfUrl, link, isError, fetchPDF])

  if (isError) {
    return !link ? (
      <div className="container max-w-[600px] mx-auto px-4 mt-10">
        <ErrorAlert />
      </div>
    ) : (
      <Button
        variant="outline"
        disabled
        size="icon-sm"
        className="font-sans text-destructive border-destructive"
      >
        <FileX />
      </Button>
    )
  }

  if (!pdfUrl && !link && isLoading) {
    return (
      <div className="mx-auto text-primary text-center">
        <LoaderCircle className="animate-spin size-10 text-primary text-center mx-auto mt-10" />
        <span className="text-sm">Génération du PDF...</span>
      </div>
    )
  } else if (pdfUrl && !link && !isLoading) {
    return (
      <div className="container max-w-[600px] mx-auto text-center px-4 mt-10">
        <a href={pdfUrl} download={fileName}>
          <Button size="sm" variant="secondary" className="download-lexicon">
            <Download className="mr-2 h-4 w-4" />
            {`Télécharger le PDF`}
          </Button>
        </a>
        <iframe
          src={pdfUrl}
          title={`${book} ${chapters?.replace('-', '–')} (${occurrences}) - Lexique du lecteur biblique`}
          width="100%"
          height="700"
          className="my-10 rounded-md border shadow-sm"
        />
      </div>
    )
  } else if (link && !pdfUrl) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="font-sans"
            disabled={isLoading}
            onClick={fetchPDF}
          >
            {!isLoading ? (
              <FileDown />
            ) : (
              <LoaderCircle className="animate-spin" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Télécharger le PDF</p>
        </TooltipContent>
      </Tooltip>
    )
  } else if (pdfUrl && link && !isLoading) {
    return (
      <a href={pdfUrl} download={fileName}>
        <Button
          variant="ghost"
          size="icon-sm"
          className="download-lexicon font-sans"
        >
          <FileText />
        </Button>
      </a>
    )
  }
}
