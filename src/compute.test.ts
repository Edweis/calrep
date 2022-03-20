import dayjs from "dayjs"
import { getRepOrigin, isGregLeap, mod, RepDate, RepDateData, toRep } from "./compute"
import groupBy from 'lodash/groupBy'

describe('toRep', () => {
  const start = dayjs('1800-09-22T00:00:00.001Z')
  const dates = Array(10000).fill(null).map((_, i) => start.add(i, 'd').toISOString().split('T')[0]).map(toRep).map(r => r.rep)
  const perYear = Object.values(groupBy(dates, 'year')).slice(0, -1) as RepDateData[][] // we remove last year that is incomplete
  it('should have years of 365 or 366 days', () => {
    console.log(perYear.filter(grp => isGregLeap(grp[0].year)).map(g => g.length))
    expect(perYear.filter(grp => isGregLeap(grp[0].year)).every(grp => grp.length === 366)).toBe(true)
    expect(perYear.filter(grp => !isGregLeap(grp[0].year)).every(grp => grp.length === 365)).toBe(true)
  })
  it('should have 360 not feat days per year', () => {
    expect(perYear.map(grp => grp.filter(d => d.feast === false).length).every(grp => grp === 360)).toBe(true)
  })
})

describe('getRepOrigin', () => {
  const cases: Array<[string, string]> = Array(100)
    .fill(null)
    .map((_, i) => 1700 + i)
    .flatMap(date => [
      [`${date}-09-21`, `${date - 1}-09-22`],
      [`${date}-09-22`, `${date}-09-22`],
      [`${date}-09-23`, `${date}-09-22`]
    ])
  it.each(cases)('%s -> %s', (str, expected) => {
    expect(getRepOrigin(str).toISOString().split('T')[0]).toEqual(expected)
  })

})

describe('isLeap', () => {
  it.each([
    [1804, true],
    [1800, false],
    [1796, true],
    [1793, false],
    [1792, true],
    [1791, false],
  ])('%s is %s', (date, expected) => {
    expect(isGregLeap(date)).toEqual(expected)
  })
})


describe('mod', () => {
  it.each([
    [1, 10, 1],
    [4, 10, 4],
    [9, 10, 9],
    [10, 10, 10],
    [11, 10, 1],
  ])('%s mod %s === %s', (a, b, expected) => expect(mod(a, b,)).toEqual(expected))
})