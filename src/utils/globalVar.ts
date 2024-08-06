export enum PeriodType {
  Day = '1d',
  Week = '1w',
  Month = '1M',
}

export type PeriodTypeValue = typeof PeriodType[keyof typeof PeriodType]
