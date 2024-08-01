import path from 'node:path'
import * as fs from 'node:fs'
import * as XLSX from 'xlsx'
import { desc } from 'drizzle-orm'
import z from 'zod'
import { dbClient } from '../db/db'
import { btcPriceInfoDay, btcPriceInfoMonth, btcPriceInfoWeek } from '../db/schema'
import { procedure, router } from '@/utils/trpcRouter'

export const btcInfoRoutes = router({
  listBTCInfo: procedure.input(z.object({
    period: z.enum(['1d', '1w', '1m']).default('1d'),
    limit: z.number().default(10),
  })).query(async ({ input }) => {
    const { period, limit } = input
    const params = {
      orderBy: [desc(btcPriceInfoDay.timestamp)],
      limit,
    }
    let result = []
    switch (period) {
      case '1d':
        result = await dbClient.query.btcPriceInfoDay.findMany(params)
        break
      case '1w':
        result = await dbClient.query.btcPriceInfoWeek.findMany(params)
        break
      case '1m':
        result = await dbClient.query.btcPriceInfoMonth.findMany(params)
        break
    }
    return result
  }),

  //
  addDataToDb: procedure.mutation(async () => {
    XLSX.set_fs(fs)
    const excelFilePath = path.join(process.cwd(), 'public', 'hl_price.xlsx')
    const workbook = XLSX.readFile(excelFilePath)
    // 获取第一个工作表
    const worksheetDay = workbook.Sheets[workbook.SheetNames[0]]
    const worksheetWeek = workbook.Sheets[workbook.SheetNames[1]]
    const worksheetMonth = workbook.Sheets[workbook.SheetNames[2]]
    // 将工作表转换为 JSON 对象
    interface ItemInfo {
      timestamp: number
      date: string
      high: string
      low: string
      amplitude: number
    }
    const dataDay: ItemInfo[] = XLSX.utils.sheet_to_json(worksheetDay)
    const dataWeek: ItemInfo[] = XLSX.utils.sheet_to_json(worksheetWeek)
    const dataMonth: ItemInfo[] = XLSX.utils.sheet_to_json(worksheetMonth)

    await dbClient.insert(btcPriceInfoDay).values(dataDay.map(item => ({
      high: Number(item.high),
      low: Number(item.low),
      amplitude: item.amplitude,
      date: item.date,
      timestamp: new Date(item.timestamp),
    })))
    await dbClient.insert(btcPriceInfoWeek).values(dataWeek.map(item => ({
      high: Number(item.high),
      low: Number(item.low),
      amplitude: item.amplitude,
      date: item.date,
      timestamp: new Date(item.timestamp),
    })))
    await dbClient.insert(btcPriceInfoMonth).values(dataMonth.map(item => ({
      high: Number(item.high),
      low: Number(item.low),
      amplitude: item.amplitude,
      date: item.date,
      timestamp: new Date(item.timestamp),
    })))
  }),
})
