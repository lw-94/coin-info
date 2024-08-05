'use client'

import {
  Edit,
  File,
} from 'lucide-react'

import dayjs from 'dayjs'
import { useState } from 'react'
import { EditDialog } from '../edit-dialog'
import { ExportAllAlertDialog } from '../export-all-alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { CusPagination } from '@/components/cus-pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { trpcClientReact } from '@/utils/trpcClient'
import { exportXlsx } from '@/utils/utils'

export default function HLPricePage() {
  const periodType: { label: string, period: '1d' | '1w' | '1M' }[] = [
    {
      label: 'day',
      period: '1d',
    },
    {
      label: 'week',
      period: '1w',
    },
    {
      label: 'month',
      period: '1M',
    },
  ]

  const [currentTabIdx, setCurrentTabIdx] = useState(0)
  const currentTab = periodType[currentTabIdx]

  const [pageNo, setPageNo] = useState(1)
  const pageSize = 10
  const { data: listBTCInfo, refetch: refetchListBTC, isLoading } = trpcClientReact.btcInfo.listBTCInfoPaginated.useQuery({
    period: currentTab.period,
    pageNo,
    pageSize,
  })
  const { data: listBTC, total, totalPage } = listBTCInfo ?? { data: undefined, total: 0, totalPage: 0 }
  const zeroData = listBTC?.length === 0

  const onTabChange = (val: string) => {
    const idx = periodType.findIndex(item => item.period === val)
    setCurrentTabIdx(idx)
    setPageNo(1)
  }

  const exportFile = async () => {
    exportXlsx(listBTC, 'data.xlsx')
  }

  const handlePageChange = (pageNo: number) => {
    setPageNo(pageNo)
  }

  //
  const dateFormat = (date: string) => {
    if (currentTabIdx === 0) {
      return date
    }
    if (currentTabIdx === 1) {
      const endDate = dayjs(date).add(1, 'week').subtract(1, 'day').format('YYYY-MM-DD')
      return `${date} ~ ${endDate}`
    }
    if (currentTabIdx === 2) {
      const endDate = dayjs(date).add(1, 'month').subtract(1, 'day').format('YYYY-MM-DD')
      return `${date} ~ ${endDate}`
    }
  }

  const amplitudeFormat = (amplitude: number) => {
    return `${(amplitude * 100).toFixed(2)}%`
  }
  return (
    <Tabs defaultValue="1d" onValueChange={onTabChange}>
      <div className="flex items-center">
        <TabsList>
          {periodType.map(item => (
            <TabsTrigger key={item.period} value={item.period}>{item.label}</TabsTrigger>
          ))}
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          {/* <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <ListFilter className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Filter
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Filter by</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked>
            all
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu> */}
          <Button size="sm" variant="outline" className="h-8 gap-1" onClick={exportFile}>
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
          <ExportAllAlertDialog />
        </div>
      </div>
      <TabsContent value={periodType[currentTabIdx].period}>
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>BTC</CardTitle>
            <CardDescription>
              BTC amplitude of
              {' '}
              {currentTab.label}
              .
            </CardDescription>
          </CardHeader>
          <CardContent>

            <Table>
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
                          listBTC?.map(item => (
                            <TableRow key={item.id}>
                              <TableCell className="hidden md:table-cell">{dateFormat(item.date)}</TableCell>
                              <TableCell>{item.high}</TableCell>
                              <TableCell>{item.low}</TableCell>
                              <TableCell>{amplitudeFormat(item.amplitude ?? 0)}</TableCell>
                              <TableCell className="hidden md:table-cell">
                                <EditDialog data={item} periodType={currentTab.period} onEditCallback={refetchListBTC}>
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
                  {Array(pageSize).fill(0).map((_, i) => <Skeleton key={`ske-${i}`} className="h-8" />)}
                </div>
              )
            }
          </CardContent>
          <CardFooter className="flex flex-col">
            <CusPagination currentPage={pageNo} totalPage={totalPage} onPageChange={handlePageChange} />
            <div className="mt-2 text-xs text-muted-foreground">
              <strong>{total}</strong>
              {' '}
              条数据
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
