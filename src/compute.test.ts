import dayjs from "dayjs"
import { getRepOrigin, isLeapYear, RepDate, toRep } from "./compute"

describe('toRep', () => {
  const cases: Array<[string, RepDate]> = [
    ['1792-09-22', { feast: false, day: 1, month: 1, year: 1 }],
    ['1792-09-23', { feast: false, day: 2, month: 1, year: 1 }],
    ['1792-10-25', { feast: false, day: 5, month: 12, year: 1 }],
    ['1793-01-01', { feast: false, day: 12, month: 4, year: 1 }],
    ['1793-02-01', { feast: false, day: 13, month: 5, year: 1 }],
    ['1793-02-28', { feast: false, day: 10, month: 6, year: 1 }],
    ['1793-06-19', { feast: false, day: 1, month: 10, year: 1 }],
    ['1793-09-15', { feast: false, day: 29, month: 12, year: 1 }],
    ['1793-09-16', { feast: false, day: 30, month: 12, year: 1 }],
    ['1793-09-17', { feast: true, day: 1, year: 1 }],
    ['1793-09-18', { feast: true, day: 2, year: 1 }],
    ['1793-09-19', { feast: true, day: 3, year: 1 }],
    ['1793-09-20', { feast: true, day: 4, year: 1 }],
    ['1793-09-21', { feast: true, day: 5, year: 1 }],
    ['1793-09-22', { feast: false, day: 1, month: 1, year: 2 }],
    ['1795-09-22', { feast: true, day: 6, year: 3 }],
    ['1795-09-23', { feast: false, day: 1, month: 1, year: 4 }],
    ['1795-09-24', { feast: false, day: 2, month: 1, year: 4 }],
  ]
  it.each(cases)('%s -> %j', (str, expected) => {
    expect(toRep(str)).toEqual(expected)
  })
})

describe('getRepOrigin', () => {
  const cases: Array<[string, string]> = [
    ['1792-09-21', '1791-09-23'],
    ['1792-09-22', '1792-09-22'],
    ['1792-09-23', '1792-09-22'],

    ['1793-09-21', '1792-09-22'],
    ['1793-09-22', '1793-09-22'],
    ['1793-09-23', '1793-09-22'],

    ['1794-09-21', '1793-09-22'],
    ['1794-09-22', '1794-09-22'],
    ['1794-09-23', '1794-09-22'],

    ['1795-09-21', '1794-09-22'],
    ['1795-09-22', '1794-09-22'],
    ['1795-09-23', '1795-09-23'], // leap year
  ]
  it.each(cases)('%s -> %s', (str, expected) => {
    expect(getRepOrigin(str).toISOString().split('T')[0]).toEqual(expected)
  })
})

describe('isLeap', () => {
  it.each([
    [dayjs('1795-09-21'), true],
    [dayjs('1794-09-21'), false],
    [dayjs('1793-09-21'), false],
    [dayjs('1792-09-21'), false],
    [dayjs('1791-09-21'), true],
  ])('%s is %s', (date, expected) => {
    expect(isLeapYear(date)).toEqual(expected)
  })
})