'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { CusFieldset } from '@/components/cus-fieldset'
import { Button } from '@/components/ui/button'
import { trpcClientReact } from '@/utils/trpcClient'
import { PeriodType } from '@/utils/globalVar'

const formSchema = z.object({
  medianNumber: z.coerce
    .number({ invalid_type_error: '请输入数字' })
    .min(0, '不能小于0')
    .max(100, '不能大于100'),
  averageNumber: z.coerce
    .number({ invalid_type_error: '请输入数字' })
    .min(0, '不能小于0')
    .max(100, '不能大于100'),
})

export function GridStrategyAmplitude() {
  const [result, setResult] = useState([
    {
      label: '触发点位',
      value: 0,
    },
    {
      label: '网格下限',
      value: 0,
    },
    {
      label: '网格上限',
      value: 0,
    },
  ])

  const { data: openPriceInfo } = trpcClientReact.btcInfo.todayOpenPrice.useQuery()
  const { date: todayDate, price: todayPrice, amplitudeYesterday } = openPriceInfo as {
    date: string
    price: string
    amplitudeYesterday: string
  } ?? {}
  const amplitudeYesterdayStr = amplitudeYesterday ? `${(+amplitudeYesterday * 100).toFixed(2)}%` : '0.00%'

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const { data: amplitudeInfo } = trpcClientReact.btcInfo.listBTCInfoAmplitudeInfo.useQuery({
    period: PeriodType.Day,
  })
  const handleSetHistoryData = () => {
    if (!amplitudeInfo) {
      return
    }

    form.setValue('medianNumber', +(amplitudeInfo.medianAmplitude * 100).toFixed(2))
    form.setValue('averageNumber', +(amplitudeInfo.averageAmplitude * 100).toFixed(2))
  }

  const onSubmit = (formData: z.infer<typeof formSchema>) => {
    const { medianNumber, averageNumber } = formData
    if (!medianNumber || !averageNumber) {
      return
    }
    const oldResult = result
    const openPoint = +todayPrice * (1 + (+amplitudeYesterday - averageNumber / 100))
    const gridDown = openPoint * (1 - medianNumber / 100)
    const gridUp = openPoint * (1 + averageNumber / 100)
    oldResult[0].value = +openPoint.toFixed(2)
    oldResult[1].value = +gridDown.toFixed(2)
    oldResult[2].value = +gridUp.toFixed(2)
    setResult(oldResult)
  }

  return (
    <CusFieldset title="振幅网格策略">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p>
            今日开盘价(
            {todayDate}
            )：
            {todayPrice}
          </p>
          <p>
            昨日振幅：
            {amplitudeYesterdayStr}
          </p>
        </div>
        <Button variant="outline" onClick={handleSetHistoryData}>使用历史平均振幅数据</Button>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="medianNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>振幅中位数</FormLabel>
                <div className="flex gap-2 items-center">
                  <FormControl>
                    <Input {...field} placeholder="0"></Input>
                  </FormControl>
                  %
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="averageNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>振幅平均数</FormLabel>
                <div className="flex gap-2 items-center">
                  <FormControl>
                    <Input {...field} placeholder="0"></Input>
                  </FormControl>
                  %
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button type="submit">计算</Button>
            <ul>
              {
                result.map(item => (
                  <li key={item.label}>
                    {item.label}
                    ：
                    {item.value}
                  </li>
                ))
              }
            </ul>
          </div>
        </form>
      </Form>
    </CusFieldset>
  )
}
