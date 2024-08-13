'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { CusFieldset } from '@/components/cus-fieldset'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

const formSchema = z.object({
  betsRate: z.coerce
    .number({ invalid_type_error: '请输入数字' })
    .min(0, '不能小于0')
    .max(1, '不能大于1'),
  betsNumber: z.string({ required_error: '请选择次数' }).transform(val => Number(val)),
  winRate: z.coerce
    .number({ invalid_type_error: '请输入数字' })
    .min(0, '不能小于0')
    .max(1, '不能大于1'),
})

export function ReturnExpect() {
  const [expect, setExpect] = useState(0)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = (formData: z.infer<typeof formSchema>) => {
    const { betsRate, betsNumber, winRate } = formData
    const winCount = betsNumber * winRate
    const loseCount = betsNumber - winCount
    const re = (1 + betsRate) ** winCount * (1 - betsRate) ** loseCount
    setExpect(+re.toFixed(6))
  }

  return (
    <CusFieldset title="回报期望">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="betsRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>投资占比</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0"
                      {...field}
                    />
                  </FormControl>
                  {/* <FormDescription>This is your public display name.</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="betsNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>下注次数</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择下注次数" />
                      </SelectTrigger>
                      <SelectContent>
                        {[50, 100, 200, 300, 400, 500].map(item =>
                          <SelectItem key={item} value={`${item}`}>{item}</SelectItem>,
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  {/* <FormDescription>This is your public display name.</FormDescription> */}
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
                    <Input
                      placeholder="0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Button type="submit">生成</Button>
            <p className="col-span-2 self-center">
              结果：
              {expect * 100}
              %
            </p>
          </div>
        </form>
      </Form>
    </CusFieldset>
  )
}
