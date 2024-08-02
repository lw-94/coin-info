import dayjs from 'dayjs'
import type { NextRequest } from 'next/server'
import { dbClient } from '@/server/db/db'
import { btcPriceInfoDay, btcPriceInfoMonth, btcPriceInfoWeek } from '@/server/db/schema'

async function getData(symbol: string, interval: '1d' | '1w' | '1M', second = false) {
  const paramsDay = new URLSearchParams({
    symbol,
    interval,
    limit: second ? '2' : '1',
  })
  const url = `https://data-api.binance.vision/api/v3/klines?${paramsDay.toString()}`
  const res = await fetch(url).then(res => res.json())
  return formatData(res[0])
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
  const promises = [getData(symbol, '1d', true), getData(symbol, '1w'), getData(symbol, '1M')]
  const [infoOfDay, infoOfWeek, infoOfMonth] = await Promise.all(promises)

  try {
    await dbClient.insert(btcPriceInfoDay).values(infoOfDay).onConflictDoUpdate({
      target: btcPriceInfoDay.timestamp,
      set: {
        high: infoOfDay.high,
        low: infoOfDay.low,
        amplitude: infoOfDay.amplitude,
        updateAt: new Date(),
      },
    })
    await dbClient.insert(btcPriceInfoWeek).values(infoOfWeek).onConflictDoUpdate({
      target: btcPriceInfoWeek.timestamp,
      set: {
        high: infoOfWeek.high,
        low: infoOfWeek.low,
        amplitude: infoOfWeek.amplitude,
        updateAt: new Date(),
      },
    })
    await dbClient.insert(btcPriceInfoMonth).values(infoOfMonth).onConflictDoUpdate({
      target: btcPriceInfoMonth.timestamp,
      set: {
        high: infoOfMonth.high,
        low: infoOfMonth.low,
        amplitude: infoOfMonth.amplitude,
        updateAt: new Date(),
      },
    })
    console.warn('🚀 ~ GET ~ success:')
  }
  catch (error: any) {
    console.error('🚀 ~ GET ~ error:', error.message)
  }

  return Response.json([infoOfDay, infoOfWeek, infoOfMonth])
}
