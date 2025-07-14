'use client'
import { ReactNode, createContext, useState } from 'react'
import CorrectionFormDrawer from '@/components/CorrectionFormDrawer'
import type { BibleWithLLB } from '@/types'

export const LLBCorrectionFormContext = createContext({})

export default function FeedbackFormProvider({children}: { children: ReactNode }) {
  const [isOpen, setIsLLBCorrectionDrawerOpen] = useState<boolean>(false);
  const [feedbackWord, setLLBCorrectionWord] = useState<BibleWithLLB | undefined>(undefined);

  return (
    <LLBCorrectionFormContext.Provider value={{ setIsLLBCorrectionDrawerOpen, feedbackWord, setLLBCorrectionWord }}>
      {children}
      {feedbackWord && (
        <CorrectionFormDrawer
          isOpen={isOpen}
          setIsLLBCorrectionDrawerOpen={setIsLLBCorrectionDrawerOpen}
          word={feedbackWord}
        />
      )}
    </LLBCorrectionFormContext.Provider>
  );
}
