import dayjs from 'dayjs'
import type { NextRequest } from 'next/server'
import { dbClient } from '@/server/db/db'
import { btcPriceInfoDay, btcPriceInfoMonth, btcPriceInfoWeek } from '@/server/db/schema'
import { PeriodType, type PeriodTypeValue } from '@/utils/globalVar'

async function getData(symbol: string, interval: PeriodTypeValue) {
  const paramsDay = new URLSearchParams({
    symbol,
    interval,
    limit: '2',
  })
  const url = `https://data-api.binance.vision/api/v3/klines?${paramsDay.toString()}`
  const data = await fetch(url, {
    cache: 'no-store', // 避免请求结果缓存
  }).then((res) => {
    console.log('🚀 ~ data ~ res.headers:', res.headers)
    return res.json()
  })
  console.log('🚀 ~ getData ~ url, data:', url, data)
  return [formatData(data[0]), formatData(data[1])]
}

function formatData(data: any) {
  return {
    timestamp: new Date(data[0]),
    date: dayjs(data[0]).format('YYYY-MM-DD'),
    high: Number(data[2]),
    low: Number(data[3]),
    amplitude: (data[2] - data[3]) / data[3],
  }
}

export async function GET(req: NextRequest, { params: { symbol } }: { params: { symbol: string } }) {
  const promises = [getData(symbol, PeriodType.Day), getData(symbol, PeriodType.Week), getData(symbol, PeriodType.Month)]
  const [infoOfDay, infoOfWeek, infoOfMonth] = await Promise.all(promises)

  try {
    // 每天更新昨日数据
    await dbClient.insert(btcPriceInfoDay).values(infoOfDay[0]).onConflictDoUpdate({
      target: btcPriceInfoDay.timestamp,
      set: {
        high: infoOfDay[0].high,
        low: infoOfDay[0].low,
        amplitude: infoOfDay[0].amplitude,
        updateAt: new Date(),
      },
    })
    // week 更新最近两条数据
    await dbClient.insert(btcPriceInfoWeek).values(infoOfWeek[0]).onConflictDoUpdate({
      target: btcPriceInfoWeek.timestamp,
      set: {
        high: infoOfWeek[0].high,
        low: infoOfWeek[0].low,
        amplitude: infoOfWeek[0].amplitude,
        updateAt: new Date(),
      },
    })
    await dbClient.insert(btcPriceInfoWeek).values(infoOfWeek[1]).onConflictDoUpdate({
      target: btcPriceInfoWeek.timestamp,
      set: {
        high: infoOfWeek[1].high,
        low: infoOfWeek[1].low,
        amplitude: infoOfWeek[1].amplitude,
        updateAt: new Date(),
      },
    })
    // month 更新最近两条数据
    await dbClient.insert(btcPriceInfoMonth).values(infoOfMonth[0]).onConflictDoUpdate({
      target: btcPriceInfoMonth.timestamp,
      set: {
        high: infoOfMonth[0].high,
        low: infoOfMonth[0].low,
        amplitude: infoOfMonth[0].amplitude,
        updateAt: new Date(),
      },
    })
    await dbClient.insert(btcPriceInfoMonth).values(infoOfMonth[1]).onConflictDoUpdate({
      target: btcPriceInfoMonth.timestamp,
      set: {
        high: infoOfMonth[1].high,
        low: infoOfMonth[1].low,
        amplitude: infoOfMonth[1].amplitude,
        updateAt: new Date(),
      },
    })
  }
  catch (error: any) {
    console.error('🚀 ~ GET ~ error:', error.message)
  }

  return Response.json([infoOfDay, infoOfWeek, infoOfMonth])
}
