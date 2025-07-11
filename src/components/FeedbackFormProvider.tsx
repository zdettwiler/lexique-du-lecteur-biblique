'use client'
import { createContext, useState } from 'react'
import FeedbackFormDrawer from '@/components/FeedbackFormDrawer'

export const FeedbackFormContext = createContext()

export default function FeedbackFormProvider({children}) {
  const [isOpen, setIsOpen] = useState();
  const [feedbackWord, setFeedbackWord] = useState();

  return (
    <FeedbackFormContext.Provider value={{ setIsOpen, feedbackWord, setFeedbackWord }}>
      {children}
      <FeedbackFormDrawer
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        word={feedbackWord}
      />
    </FeedbackFormContext.Provider>
  );
}
