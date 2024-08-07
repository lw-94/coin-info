'use client'

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import type { HTMLAttributes } from 'react'
import type {
  ChartConfig,
} from '@/components/ui/chart'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

export function CusLineChart({
  chartData,
  chartConfig,
  className,
}: {
  chartData: {
    amplitude: number
    date: string
  }[]
  chartConfig: ChartConfig
} & HTMLAttributes<HTMLDivElement>) {
  const renderChartTooltipContentFormatter: any = (val: number, name: string, item: any) => {
    const { color, payload } = item
    return (
      <div>
        <p>{payload.date}</p>
        <div className="flex items-center">
          <i className="w-2 h-2 mr-1" style={{ backgroundColor: color }}></i>
          <p>{`${name} ${(val * 100).toFixed(2)}%`}</p>
        </div>
      </div>
    )
  }

  return (
    <ChartContainer config={chartConfig} className={className}>
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis tickFormatter={val => `${(val * 100).toFixed(2)}%`} />
        <ChartTooltip
          cursor={{
            strokeDasharray: '3 3',
            stroke: '#ccc',
            strokeWidth: 1,
          }}
          content={<ChartTooltipContent hideLabel formatter={renderChartTooltipContentFormatter} />}
        />
        <Line
          dataKey="amplitude"
          stroke="var(--color-amplitude)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>

  )
}
