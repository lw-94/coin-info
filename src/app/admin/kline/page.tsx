'use client'

import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { subDays } from 'date-fns'
import { CusLineChart } from './cus-line-chart'
import { DatePickerWithRange } from './date-picker-with-range'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { trpcClientReact } from '@/utils/trpcClient'
import type { ChartConfig } from '@/components/ui/chart'

export default function KlinePage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 11),
    to: new Date(),
  })

  const { data: chartData } = trpcClientReact.btcInfo.listBTCInfoAmplitudeByDay.useQuery({
    start: date?.from?.toString(),
    end: date?.to?.toString(),
  })

  const chartConfig = {
    amplitude: {
      color: 'hsl(var(--chart-1))',
    },
  } satisfies ChartConfig

  return (
    <div>
      <div className="flex gap-4">
        <DatePickerWithRange date={date} setDate={setDate} />
      </div>
      <div className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>BTC日振幅</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <CusLineChart chartData={chartData ?? []} chartConfig={chartConfig} />
          </CardContent>
          {/* <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Trending up by 5.2% this month
              {' '}
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </CardFooter> */}
        </Card>

      </div>
    </div>
  )
}
