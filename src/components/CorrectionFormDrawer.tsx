'use client'
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer"
import type { BibleWithLLB } from '@/types'
import LLBCorrectionForm from '@/components/LLBCorrectionForm'
import StrongTag from '@/components/StrongTag'

export default function CorrectionFormDrawer({ isOpen, setIsLLBCorrectionDrawerOpen, word }: {
  isOpen: boolean,
  setIsLLBCorrectionDrawerOpen: (arg0: boolean) => void,
  word: BibleWithLLB
}) {

  return word && (
    <>
      <Drawer open={isOpen} onOpenChange={setIsLLBCorrectionDrawerOpen}>
        <DrawerContent>
          <div className='w-full max-w-lg mx-auto'>
            <DrawerHeader>
              <DrawerTitle>Proposer une correction du LLB</DrawerTitle>
              <DrawerDescription>{word.lemma} <StrongTag strong={word.strong} /></DrawerDescription>
            </DrawerHeader>

            <LLBCorrectionForm
              word={word}
              setIsLLBCorrectionDrawerOpen={setIsLLBCorrectionDrawerOpen}
            />

            <DrawerFooter >
              <DrawerClose asChild>
                <Button variant="outline">Annuler</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}


