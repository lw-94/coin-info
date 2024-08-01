import * as XLSX from 'xlsx'

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
