import path from 'node:path'
import * as fs from 'node:fs'
import * as XLSX from 'xlsx'
import { and, asc, count, desc, eq, gte, lte } from 'drizzle-orm'
import z from 'zod'
import { dbClient } from '../db/db'
import { btcPriceInfoDay, btcPriceInfoMonth, btcPriceInfoWeek } from '../db/schema'
import { procedure, router } from '@/utils/trpcRouter'
import { coinInfoFieldPick } from '@/utils/utils'
import { PeriodType } from '@/utils/globalVar'

export const btcInfoRoutes = router({
  listBTCInfoAll: procedure.mutation(async () => {
    const dayPromise = dbClient.select().from(btcPriceInfoDay).orderBy(desc(btcPriceInfoDay.timestamp))
    const weekPromise = dbClient.select().from(btcPriceInfoWeek).orderBy(desc(btcPriceInfoWeek.timestamp))
    const monthPromise = dbClient.select().from(btcPriceInfoMonth).orderBy(desc(btcPriceInfoMonth.timestamp))

    const [day, week, month] = await Promise.all([dayPromise, weekPromise, monthPromise])
    return {
      day: day.map(coinInfoFieldPick),
      week: week.map(coinInfoFieldPick),
      month: month.map(coinInfoFieldPick),
    }
  }),

  listBTCInfoPaginated: procedure.input(z.object({
    period: z.enum([PeriodType.Day, PeriodType.Week, PeriodType.Month]).default(PeriodType.Day),
    pageNo: z.number().min(1).default(1),
    pageSize: z.number().min(1).max(50).default(10),
  })).query(async ({ input }) => {
    const { period, pageNo, pageSize } = input

    const paramsCommon = {
      offset: (pageNo - 1) * pageSize,
      limit: pageSize,
    }
    let result: any[] = []
    let countInfo: {
      count: number
    }[]
    switch (period) {
      case PeriodType.Day:
        result = await dbClient.query.btcPriceInfoDay.findMany({
          ...paramsCommon,
          orderBy: [desc(btcPriceInfoDay.timestamp)],
        })
        countInfo = await dbClient.select({
          count: count(),
        }).from(btcPriceInfoDay).execute()
        break
      case PeriodType.Week:
        result = await dbClient.query.btcPriceInfoWeek.findMany({
          ...paramsCommon,
          orderBy: [desc(btcPriceInfoWeek.timestamp)],
        })
        countInfo = await dbClient.select({
          count: count(),
        }).from(btcPriceInfoWeek).execute()
        break
      case PeriodType.Month:
        result = await dbClient.query.btcPriceInfoMonth.findMany({
          ...paramsCommon,
          orderBy: [desc(btcPriceInfoMonth.timestamp)],
        })
        countInfo = await dbClient.select({
          count: count(),
        }).from(btcPriceInfoMonth).execute()
        break
    }

    return {
      data: result.map(coinInfoFieldPick),
      total: countInfo[0].count,
      totalPage: Math.ceil(countInfo[0].count / pageSize),
    }
  }),

  listBTCInfoAmplitudeInfo: procedure.input(z.object({
    period: z.enum([PeriodType.Day, PeriodType.Week, PeriodType.Month]).default(PeriodType.Day),
    limit: z.number().optional(),
  })).query(async ({ input }) => {
    const { period, limit } = input
    let result: any[] = []
    switch (period) {
      case PeriodType.Day:
        result = await dbClient.query.btcPriceInfoDay.findMany({
          orderBy: [desc(btcPriceInfoDay.timestamp)],
          limit,
        })
        break
      case PeriodType.Week:
        result = await dbClient.query.btcPriceInfoWeek.findMany({
          orderBy: [desc(btcPriceInfoWeek.timestamp)],
          limit,
        })
        break
      case PeriodType.Month:
        result = await dbClient.query.btcPriceInfoMonth.findMany({
          orderBy: [desc(btcPriceInfoMonth.timestamp)],
          limit,
        })
        break
    }

    const averageAmplitude = result.reduce((sum, item, index, array) => {
      if (index === array.length - 1) {
        return (sum + item.amplitude!) / array.length
      }
      return sum + item.amplitude!
    }, 0)

    // 计算result的属性amplitude的中位数
    const medianAmplitude = result.sort((a, b) => a.amplitude! - b.amplitude!)[Math.floor(result.length / 2)].amplitude

    return {
      averageAmplitude,
      medianAmplitude,
    }
  }),

  listBTCInfoAmplitudeByDay: procedure.input(z.object({
    start: z.string().transform(val => new Date(val)).optional(),
    end: z.string().transform(val => new Date(val)).optional(),
  })).query(async ({ input }) => {
    const { start, end } = input
    const result = await dbClient.query.btcPriceInfoDay.findMany({
      where: and(start && gte(btcPriceInfoDay.timestamp, start), end && lte(btcPriceInfoDay.timestamp, end)),
      orderBy: [asc(btcPriceInfoDay.timestamp)],
    })

    return result.map(item => ({
      amplitude: item.amplitude!,
      date: item.date,
    }))
  }),

  edit: procedure.input(z.object({
    type: z.enum([PeriodType.Day, PeriodType.Week, PeriodType.Month]),
    id: z.number(),
    high: z.number(),
    low: z.number(),
    amplitude: z.number(),
  })).mutation(async ({ input }) => {
    const { type, id, high, low, amplitude } = input
    const map = {
      [PeriodType.Day]: btcPriceInfoDay,
      [PeriodType.Week]: btcPriceInfoWeek,
      [PeriodType.Month]: btcPriceInfoMonth,
    }
    try {
      await dbClient
        .update(map[type])
        .set({ high, low, amplitude })
        .where(eq(map[type].id, id))
    }
    catch (error: any) {
      console.error('🚀 ~ edit ~ error:', error.message)
      return false
    }

    return true
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
