import { KellyMethod } from './kelly-method'
import { ReturnExpect } from './return-expect'
import { Card, CardContent } from '@/components/ui/card'

export default function CalculatorPage() {
  return (
    <Card>
      <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <ReturnExpect></ReturnExpect>
        <KellyMethod></KellyMethod>
      </CardContent>
    </Card>
  )
}
