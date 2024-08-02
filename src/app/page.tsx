'use client'

import Link from 'next/link'
import {
  Edit,
  File,
  FileSpreadsheet,
  LineChart,
  List,
  ListFilter,
  PanelLeft,
  Settings,
} from 'lucide-react'

import { useState } from 'react'
import { EditDialog } from './edit-dialog'
import { ExportAllAlertDialog } from './export-all-alert-dialog'
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
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { trpcClientReact, trpcPureClient } from '@/utils/trpcClient'
import { cn } from '@/lib/utils'
import { exportXlsx, exportXlsxWithMultipleSheets } from '@/utils/utils'
import type { btcPriceInfoDay } from '@/server/db/schema'

export default function HomePage() {
  const menu = [
    {
      path: '/',
      name: 'Table',
      icon: <List className="h-5 w-5" />,
    },
    {
      path: '/kline',
      name: 'Kline',
      icon: <LineChart className="h-5 w-5" />,
    },
  ]

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

  const { data: ListBTC, refetch: refetchListBTC } = trpcClientReact.btcInfo.listBTCInfo.useQuery({
    period: currentTab.period,
  })

  const onTabChange = (val: string) => {
    const idx = periodType.findIndex(item => item.period === val)
    setCurrentTabIdx(idx)
  }

  // const addFileDataToDb = async () => {
  //   await trpcPureClient.btcInfo.addDataToDb.mutate()
  // }

  const exportFile = async () => {
    exportXlsx(ListBTC, 'data.xlsx')
  }

  const exportAllFile = async () => {
    const data = await trpcPureClient.btcInfo.listBTCInfoAll.mutate()
    exportXlsxWithMultipleSheets(data, 'data.xlsx')
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          {
            menu.map(item => (
              <TooltipProvider key={item.name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.path}
                      className={cn('flex h-9 w-9 items-center justify-center rounded-lg text-accent-foreground transition-colors hover:bg-accent md:h-8 md:w-8')}
                    >
                      {item.icon}
                      <span className="sr-only">{item.name}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.name}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))
          }
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                {
                  menu.map(item => (
                    <Link
                      key={item.path}
                      href={item.path}
                      className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  ))
                }
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Settings className="h-5 w-5" />
                  Settings
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="1d" onValueChange={onTabChange}>
            <div className="flex items-center">
              <TabsList>
                {periodType.map(item => (
                  <TabsTrigger key={item.period} value={item.period}>{item.label}</TabsTrigger>
                ))}
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <DropdownMenu>
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
                </DropdownMenu>
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
                    BTC price info of days.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>High</TableHead>
                        <TableHead>Low</TableHead>
                        <TableHead>Amplitude</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {
                        ListBTC?.map(item => (
                          <TableRow key={item.id}>
                            <TableCell>{item.date}</TableCell>
                            <TableCell>{item.high}</TableCell>
                            <TableCell>{item.low}</TableCell>
                            <TableCell>{item.amplitude}</TableCell>
                            <TableCell>
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
                  </Table>
                </CardContent>
                <CardFooter>
                  <div className="text-xs text-muted-foreground">
                    Showing
                    {' '}
                    <strong>1-10</strong>
                    {' '}
                    of
                    {' '}
                    <strong>{ListBTC?.length}</strong>
                    {' '}
                    products
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
