"use client";
import { ReactNode, createContext, useState } from "react";
import CorrectionFormDrawer from "@/components/CorrectionFormDrawer";
import type { BibleWithLLB } from "@/types";

type LLBCorrectionFormContextType = {
  setIsLLBCorrectionDrawerOpen: (open: boolean) => void;
  correctionWord: BibleWithLLB | undefined;
  setLLBCorrectionWord: (word: BibleWithLLB) => void;
};
export const LLBCorrectionFormContext = createContext<
  LLBCorrectionFormContextType | undefined
>(undefined);

export default function FeedbackFormProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isOpen, setIsLLBCorrectionDrawerOpen] = useState<boolean>(false);
  const [correctionWord, setLLBCorrectionWord] = useState<
    BibleWithLLB | undefined
  >(undefined);

  return (
    <LLBCorrectionFormContext.Provider
      value={{
        setIsLLBCorrectionDrawerOpen,
        correctionWord,
        setLLBCorrectionWord,
      }}
    >
      {children}
      {correctionWord && (
        <CorrectionFormDrawer
          isOpen={isOpen}
          setIsLLBCorrectionDrawerOpen={setIsLLBCorrectionDrawerOpen}
          word={correctionWord}
        />
      )}
    </LLBCorrectionFormContext.Provider>
  );
}
