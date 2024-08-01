import * as XLSX from 'xlsx'

export function exportXlsx(arr?: any[], fileName: string = 'data.xlsx', SheetName: string = 'Sheet1') {
  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.json_to_sheet(arr ?? [])
  XLSX.utils.book_append_sheet(workbook, worksheet, SheetName)
  XLSX.writeFileXLSX(workbook, fileName, { compression: true })
}
