'use client';
import React from 'react';

export default function PDFLexicon() {
  return (
    <iframe
      src="/api/llb/pdf"
      width="100%"
      height="600"
      title="Two Column PDF Preview"
      className="border-0 rounded-lg shadow"
    />
  );
}
