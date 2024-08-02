import { FileSpreadsheet } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { trpcPureClient } from '@/utils/trpcClient'
import { exportXlsxWithMultipleSheets } from '@/utils/utils'

export function ExportAllAlertDialog() {
  const exportAllFile = async () => {
    const data = await trpcPureClient.btcInfo.listBTCInfoAll.mutate()
    exportXlsxWithMultipleSheets(data, 'data.xlsx')
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-8 gap-1">
          <FileSpreadsheet className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Export All
          </span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>下载全部数据</AlertDialogTitle>
          <AlertDialogDescription>
            下载按日，按周，按月的所有数据
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction onClick={exportAllFile}>确认下载</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
