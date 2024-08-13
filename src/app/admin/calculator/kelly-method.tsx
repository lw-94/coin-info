'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { CusFieldset } from '@/components/cus-fieldset'

const formSchema = z.object({
  odds: z.coerce
    .number({ invalid_type_error: '请输入数字' })
    .min(0, '不能小于0'),
  winRate: z.coerce
    .number({ invalid_type_error: '请输入数字' })
    .min(0, '不能小于0')
    .max(1, '不能大于1'),
})

export function KellyMethod() {
  const [betsRate, setBetsRate] = useState(0)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  function onSubmit(formData: z.infer<typeof formSchema>) {
    // f = (b * p - q) / b
    const { odds, winRate } = formData
    if (!odds || !winRate) {
      setBetsRate(0)
      return
    }
    const loseRate = 1 - winRate
    const rate = (odds * winRate - loseRate) / odds
    setBetsRate(+rate.toFixed(6))
  }

  return (
    <CusFieldset title="凯利公式">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="odds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>赔率（不含本金）</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="0" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="winRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>获胜率</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="0" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-4 grid grid-cols-2 gap-4">
            <Button type="submit">计算</Button>
            <p className="self-center">
              应投比例：
              {betsRate * 100}
              %
            </p>
          </div>
        </form>
      </Form>
    </CusFieldset>
  )
}
