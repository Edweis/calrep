import dayjs from "dayjs";
type RepDate = {
  feast: false,
  day: number, //1-30
  month: number, //1-12
  year: number,
} | { feast: true, day: number }

const repOrigin = dayjs("1792-09-22");

export const toRep = (str: string): RepDate => {

  const date = dayjs(str)
  const thisYearOrigin = repOrigin.set("year", date.get("year"));
  const isBeforeOrigin = date.isBefore(thisYearOrigin);

  return { feast: false, day: 1, month: 1, year: 1, }
}
