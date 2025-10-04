'use client';

import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import { Button } from '@/components/ui/button';

export default function PDFLexicon() {
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    const doc = new jsPDF();
    doc.text("Hello world!", 10, 10);
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);

    // Cleanup when component unmounts
    return () => URL.revokeObjectURL(url);
  }, []);

  if (!pdfUrl) return <p>Loading PDF...</p>;

  return (
    <iframe
      title="PDF Preview"
      width="100%"
      height="500"
      src={pdfUrl}
      style={{ border: 'none' }}
    />
  );
}
