'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Download } from 'lucide-react'

export default function PDFDownloadButton({ section }: { section: string }) {
  const [loading, setLoading] = useState(false)
  const [pdfUrl, setPDFUrl] = useState(null)

  useEffect(() => {
    return () => pdfUrl && URL.revokeObjectURL(pdfUrl);
  }, [pdfUrl]);

  const handleGeneratePDF = async () => {
    setLoading(true)
    setPDFUrl(null)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/llb/pdf`)
      if (!res.ok) throw new Error('PDF generation failed')

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      setPDFUrl(url)
    } catch (err) {
      console.error(err)
      alert('Error generating PDF')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.hsection = pdfUrl
    link.download = 'two-columns.pdf'
    link.click()
  }

  return (
    <div className="flex flex-col items-center gap-4 mt-12">
      {!pdfUrl ? (
        <Button onClick={handleGeneratePDF} disabled={loading} className="">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Génération...
            </>
          ) : (
            'Générer le PDF'
          )}
        </Button>
      ) : (
        <a href={pdfUrl} download={`${section} — Lexique du Lecteur Biblique.pdf`}>
          <Button variant="secondary" className="">
            <Download className="mr-2 h-4 w-4" />
            {section}
          </Button>
        </a>
      )}
    </div>
  )
}
