import dayjs from "dayjs";
import seasons from "./data/seasons.json";
import feasts from "./data/feasts.json";
import months from "./data/months.json";
import saints from "./data/saints.json";

type Feast = { feast: true, day: number, year: number }
type NonFeast = { feast: false, day: number, month: number, year: number }
export type RepDateData = { toString: () => string } & (Feast | NonFeast)

export class RepDate {
  rep: RepDateData
  constructor(rep: RepDateData) {
    this.rep = rep
  }
  format() {
    const { feast, day, year } = this.rep
    const month = (this.rep as NonFeast).month
    const dayPart = feast ? feasts[day - 1] : day + ' ' + months[month - 1]
    const season = feast ? null : seasons[(month - month % 4) / 4]
    const decade = feast ? null : (day - day % 10) / 10
    const dayNumber = feast ? 360 + day : (month - 1) * 30 + day
    const decadeDay = day % 10
    return {
      dayPart,
      season,
      decade,
      dayNumber, decadeDay,
      ...this.rep,
    }
  }
}

export const isGregLeap = (y: number) => {
  return y % 4 === 0 && y % 100 !== 0 || y % 400 === 0
}
export const getRepOrigin = (str: string) => {
  const date = dayjs(str + 'T00:00:00.001Z')
  let year = date.get('year')

  const toDate = (year: number) => dayjs(`${year}-09-22T00:00:00.001Z`)
  let origin = toDate(year)
  return date.isBefore(origin) ? toDate(year - 1) : toDate(year)
}

export const toRep = (str: string): RepDate => {
  const date = dayjs(str + 'T00:00:00.001Z');
  const origin = getRepOrigin(str);
  const year = origin.get('year') - 1791;
  const dayRep = date.diff(origin, 'day') + 1;

  if (dayRep > 360) return new RepDate({ feast: true, day: dayRep - 360, year })
  const day = dayRep % 30 || 30;
  let month = 1 + (dayRep - (dayRep % 30)) / 30;
  if (month === 13) month = 12
  return new RepDate({ feast: false, day, month, year })
}
