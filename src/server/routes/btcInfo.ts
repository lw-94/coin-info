import { and, asc, count, desc, eq, gte, lte } from 'drizzle-orm'
import z from 'zod'
import { dbClient } from '../db/db'
import { btcPriceInfoDay, btcPriceInfoMonth, btcPriceInfoWeek } from '../db/schema'
import { procedure, router } from '@/utils/trpcRouter'
import { coinInfoFieldPick } from '@/utils/utils'
import { PeriodType } from '@/utils/globalVar'
import getAllPriceInfo from '@/utils/getAllPriceInfo'

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

    // 计算result的属性amplitude的平均值
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

  todayOpenPrice: procedure.query(async () => {
    const result = await dbClient.query.config.findFirst({
      where: (config, { eq }) => eq(config.label, 'open_price'),
    })
    const priceInfo = await dbClient.query.btcPriceInfoDay.findFirst()
    return {
      ...result?.value as any,
      amplitudeYesterday: priceInfo?.amplitude,
    }
  }),

  // 添加初始数据时使用
  initData: procedure.mutation(async () => {
    const [dataDay, dataWeek, dataMonth] = await getAllPriceInfo()

    function formatData(item: typeof dataDay[0]) {
      return {
        high: Number(item.high),
        low: Number(item.low),
        amplitude: item.amplitude,
        date: item.date,
        timestamp: new Date(item.timestamp),
      }
    }

    const promiseList = [
      dbClient.insert(btcPriceInfoDay).values(dataDay.map(item => formatData(item))),
      dbClient.insert(btcPriceInfoWeek).values(dataWeek.map(item => formatData(item))),
      dbClient.insert(btcPriceInfoMonth).values(dataMonth.map(item => formatData(item))),
    ]
    try {
      await Promise.all(promiseList)
    }
    catch (error) {
      console.log('🚀 ~ addDataToDb:procedure.mutation ~ error:', error)
      return false
    }
    return true
  }),
})
