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
import type { LLB } from '@prisma/client'
import StrongTag from '@/components/StrongTag'

export default function FeedbackFormDrawer(
  { isOpen, setIsOpen, word }:
  { isOpen: boolean, setIsOpen: (arg0: boolean) => void, word: LLB }) {
  // await fetch(process.env.NEXT_PUBLIC_GSHEET_FEEDBACK, {
  //   method: 'POST',
  //   body: JSON.stringify({
  //     name: 'test',
  //     email: 'test',
  //     book: 'test',
  //     chapter: 'test',
  //     verse: 'test',
  //     strong: 'test',
  //     lex: 'test',
  //     corrected_gloss: 'test',
  //   }),
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // })

  return word && (
    <>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent>
        <div className='max-w-lg mx-auto'>
            <DrawerHeader>
              <DrawerTitle>Proposer une correction au LLB</DrawerTitle>
              <DrawerDescription>{word.lemma} <StrongTag strong={word.strong} /></DrawerDescription>
            </DrawerHeader>
            <DrawerFooter >
              <Button>Submit</Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
        </div>
          </DrawerContent>
      </Drawer>
    </>
  )
}
