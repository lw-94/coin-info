import { add, format, isBefore, subYears } from 'date-fns'

const url = 'https://data-api.binance.vision/api/v3/klines'

let data_1d: any[] = []
let data_1w: any[] = []
let data_1m: any[] = []

// 获取当前时间
const currentDate = new Date()
// 减去 5 年的毫秒数
const fiveYearsAgo = subYears(currentDate, 5).getTime()

async function getData(startTime = fiveYearsAgo, interval: '1d' | '1w' | '1M') {
  const params = new URLSearchParams({
    startTime: startTime.toString(),
    symbol: 'BTCUSDT',
    interval,
    limit: '1000',
  })
  const data = await fetch(`${url}?${params.toString()}`).then(res => res.json())
  return data
}

async function loop(startTime: number, interval: '1d' | '1w' | '1M') {
  if (isBefore(new Date(), new Date(startTime))) {
    return
  }
  const data = await getData(startTime, interval)
  switch (interval) {
    case '1d': {
      data_1d = data_1d.concat(data)
      break
    }
    case '1w': {
      data_1w = data_1w.concat(data)
      break
    }
    case '1M': {
      data_1m = data_1m.concat(data)
      break
    }
  }
  const intervalMap = {
    '1d': 'days',
    '1w': 'weeks',
    '1M': 'months',
  }
  const lastTime = data[data?.length - 1][0]
  const isNotEnd = isBefore(new Date(lastTime), new Date())
  if (isNotEnd) {
    const next = add(new Date(lastTime), { [intervalMap[interval]]: 1 }).getTime()
    await loop(next, interval)
  }
}

function formatData(data: any[]) {
  return data.map((item: any[]) => {
    return {
      timestamp: item[0],
      date: format(item[0], 'yyyy-MM-dd'),
      high: item[2],
      low: item[3],
      amplitude: (item[2] - item[3]) / item[3],
    }
  })
}

export default async function () {
  const promiseList = [loop(fiveYearsAgo, '1d'), loop(fiveYearsAgo, '1w'), loop(fiveYearsAgo, '1M')]
  await Promise.all(promiseList)
  return [formatData(data_1d), formatData(data_1w), formatData(data_1m)]
}
