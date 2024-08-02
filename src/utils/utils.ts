import * as XLSX from 'xlsx'
import type { btcPriceInfoDay } from './../server/db/schema'

export function exportXlsx(arr?: Record<string, any>[], fileName: string = 'data.xlsx', SheetName: string = 'Sheet1') {
  if (!arr) {
    return
  }
  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.json_to_sheet(arr)
  XLSX.utils.book_append_sheet(workbook, worksheet, SheetName)
  XLSX.writeFileXLSX(workbook, fileName, { compression: true })
}

export function exportXlsxWithMultipleSheets(obj: Record<string, Record<string, any>[]>, fileName: string = 'data.xlsx') {
  if (!obj) {
    return
  }
  const workbook = XLSX.utils.book_new()
  Object.entries(obj).forEach(([key, value]) => {
    const worksheet = XLSX.utils.json_to_sheet(value ?? [])
    XLSX.utils.book_append_sheet(workbook, worksheet, key)
  })
  XLSX.writeFileXLSX(workbook, fileName, { compression: true })
}

export function coinInfoFieldPick(obj: typeof btcPriceInfoDay.$inferSelect) {
  const { createAt, updateAt, timestamp, ...others } = obj
  return others
}

export function isNumber(value?: string) {
  if (value === undefined) {
    return false
  }
  return /^-?\d+(\.\d+)?$/.test(value)
}
