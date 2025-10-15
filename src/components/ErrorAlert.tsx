import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { PaintbrushVertical } from 'lucide-react'

export default function ErrorAlert() {
  return (
    <Alert
      variant="destructive"
      className="font-sans text-left has-[svg]:grid-cols-[auto_1fr] my-5"
    >
      <PaintbrushVertical />
      <AlertTitle>Oups!</AlertTitle>
      <AlertDescription className="text-destructive">
        Le LLB s&apos;est emmêlé les pinceaux. Veuillez réessayer.
      </AlertDescription>
    </Alert>
  )
}
