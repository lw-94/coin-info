import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { btcPriceInfoDay } from '@/server/db/schema'
import { isNumber } from '@/utils/utils'
import { trpcPureClient } from '@/utils/trpcClient'

type EditItem = Omit<typeof btcPriceInfoDay.$inferSelect, 'createAt' | 'updateAt' | 'timestamp'>

export function EditDialog({
  data,
  periodType,
  onEditCallback,
  children,
}: {
  data: EditItem
  periodType: '1d' | '1w' | '1M'
  onEditCallback: () => void
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  const highInputRef = useRef<HTMLInputElement>(null)
  const lowInputRef = useRef<HTMLInputElement>(null)
  const amplitudeInputRef = useRef<HTMLInputElement>(null)

  const handleSaveChange = async () => {
    const high = highInputRef.current?.value
    const low = lowInputRef.current?.value
    const amplitude = amplitudeInputRef.current?.value

    if (!isNumber(high)) {
      toast.warning('High should be number')
      return
    }

    if (!isNumber(low)) {
      toast.warning('Low should be number')
      return
    }

    if (!isNumber(amplitude)) {
      toast.warning('Amplitude should be number')
      return
    }
    try {
      await trpcPureClient.btcInfo.edit.mutate({
        id: data.id,
        type: periodType,
        high: Number(high),
        low: Number(low),
        amplitude: Number(amplitude),
      })

      onEditCallback()
      setOpen(false)
      toast.success('Edit success')
    }
    catch (error) {

    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Edit data for
            {' '}
            {data?.date}
          </DialogTitle>
          <DialogDescription>
            Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="high" className="text-right">
              high
            </Label>
            <Input
              ref={highInputRef}
              id="high"
              defaultValue={data?.high ?? ''}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="low" className="text-right">
              low
            </Label>
            <Input
              ref={lowInputRef}
              id="low"
              defaultValue={data?.low ?? ''}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amplitude" className="text-right">
              amplitude
            </Label>
            <Input
              ref={amplitudeInputRef}
              id="amplitude"
              defaultValue={data?.amplitude ?? ''}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSaveChange}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
