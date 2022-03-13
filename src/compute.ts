import dayjs from "dayjs";

export type RepDate = {
  feast: false,
  day: number, //1-30
  month: number, //1-12
  year: number,
} | {
  feast: true,
  day: number,
  year: number
}

export const isLeapYear = (date: dayjs.Dayjs) => date.get('year') % 4 === 3
export const getRepOrigin = (str: string) => {
  const date = dayjs(str + 'T00:00:00.001Z')
  const year = date.get('year')
  let origin = dayjs(year + '-09-22T00:00:00.001Z')

  const isSame = date.isSame(origin)
  const isBefore = date.isBefore(origin)
  if (isSame && isLeapYear(origin)) return origin.subtract(1, 'year')
  if (isBefore) origin = dayjs((year - 1) + '-09-22T00:00:00.001Z')
  if (isLeapYear(origin)) origin = origin.add(1, 'day')
  return origin
}

const show = (day: dayjs.Dayjs) => day.toISOString().split('T')[0]
export const toRep = (str: string): RepDate => {

  const date = dayjs(str + 'T00:00:00.001Z');
  const origin = getRepOrigin(str);
  const year = origin.get('year') - 1791;
  const dayRep = date.diff(origin, 'day') + 1;
  const isLeap = isLeapYear(origin)

  console.log({ dayRep, isLeap, origin: show(origin), date: show(date) })
  if (dayRep > 360) return { feast: true, day: dayRep - 360, year }
  const day = dayRep % 30 || 30;
  let month = 1 + (dayRep - (dayRep % 30)) / 30;
  if (month === 13) month = 12
  return { feast: false, day, month, year }
}
