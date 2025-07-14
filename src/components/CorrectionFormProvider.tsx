'use client'
import { createContext, useState } from 'react'
import FeedbackFormDrawer from '@/components/CorrectionFormDrawer'

export const LLBCorrectionFormContext = createContext()

export default function FeedbackFormProvider({children}) {
  const [isOpen, setIsLLBCorrectionDrawerOpen] = useState();
  const [feedbackWord, setLLBCorrectionWord] = useState();

  return (
    <LLBCorrectionFormContext.Provider value={{ setIsLLBCorrectionDrawerOpen, feedbackWord, setLLBCorrectionWord }}>
      {children}
      <FeedbackFormDrawer
        isOpen={isOpen}
        setIsLLBCorrectionDrawerOpen={setIsLLBCorrectionDrawerOpen}
        word={feedbackWord}
      />
    </LLBCorrectionFormContext.Provider>
  );
}
