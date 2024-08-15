import { Edit } from 'lucide-react'
import type { inferRouterOutputs } from '@trpc/server'
import { addDays, addMonths, format, subDays } from 'date-fns'
import { EditDialog } from '../edit-dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import type { TRPCRouter } from '@/server/router'
import type { PeriodTypeValue } from '@/utils/globalVar'
import { PeriodType } from '@/utils/globalVar'

type List = inferRouterOutputs<TRPCRouter>['btcInfo']['listBTCInfoPaginated']['data']

export function DataTable({
  isLoading,
  currentTab,
  list,
  skeletonCount,
  refetchList,
}: {
  isLoading: boolean
  currentTab: {
    label: string
    period: PeriodTypeValue
  }
  list?: List
  skeletonCount?: number
  refetchList: () => void
}) {
  const zeroData = list?.length === 0

  // 表格数据格式化
  const dateFormat = (date: string) => {
    if (currentTab.period === PeriodType.Day) {
      return date
    }
    if (currentTab.period === PeriodType.Week) {
      const endDate = format(addDays(date, 6), 'yyyy-MM-dd')
      return `${date} ~ ${endDate}`
    }
    if (currentTab.period === PeriodType.Month) {
      const endDate = format(subDays(addMonths(date, 1), 1), 'yyyy-MM-dd')
      return `${date} ~ ${endDate}`
    }
  }

  const amplitudeFormat = (amplitude: number) => {
    return `${(amplitude * 100).toFixed(2)}%`
  }

  return (
    <>
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead className="hidden md:table-cell">Date</TableHead>
            <TableHead>High</TableHead>
            <TableHead>Low</TableHead>
            <TableHead>Amplitude</TableHead>
            <TableHead className="hidden md:table-cell">Actions</TableHead>
          </TableRow>
        </TableHeader>
        {
          isLoading
            ? null
            : (
                <TableBody>
                  {
                    list?.map(item => (
                      <TableRow key={item.id}>
                        <TableCell className="hidden md:table-cell">{dateFormat(item.date)}</TableCell>
                        <TableCell>{item.high}</TableCell>
                        <TableCell>{item.low}</TableCell>
                        <TableCell>{amplitudeFormat(item.amplitude ?? 0)}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <EditDialog data={item} periodType={currentTab.period} onEditCallback={refetchList}>
                            <Button variant="ghost" size="icon">
                              <Edit />
                            </Button>
                          </EditDialog>
                        </TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              )
        }
        {
          zeroData
            ? (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      暂无数据
                    </TableCell>
                  </TableRow>
                </TableBody>
              )
            : null
        }
      </Table>
      {
        isLoading
        && (
          <div className="mt-2 flex flex-col gap-2">
            {Array(skeletonCount).fill(0).map((_, i) => <Skeleton key={`ske-${i}`} className="h-8" />)}
          </div>
        )
      }
    </>
  )
}
