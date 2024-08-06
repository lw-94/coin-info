'use client'

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
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
}: {
  chartData: {
    amplitude: number
    date: string
  }[]
  chartConfig: ChartConfig
}) {
  return (
    <ChartContainer config={chartConfig}>
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
          content={<ChartTooltipContent hideLabel labelClassName="text-red" />}
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
