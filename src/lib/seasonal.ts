import type { SeasonalFlower } from './types'

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

/**
 * Flowers in season this month. If none are tagged for this month, returns the
 * next month that has any, so the section is never empty.
 */
export function inBloom(flowers: SeasonalFlower[], date = new Date()) {
  const current = date.getMonth() + 1
  for (let offset = 0; offset < 12; offset++) {
    const month = ((current - 1 + offset) % 12) + 1
    const matches = flowers.filter((f) => f.months.includes(month))
    if (matches.length) return { month, upcoming: offset > 0, flowers: matches }
  }
  return { month: current, upcoming: false, flowers: [] }
}

export function monthRange(months: number[]) {
  if (!months.length) return ''
  const first = MONTHS[months[0] - 1].slice(0, 3)
  const last = MONTHS[months[months.length - 1] - 1].slice(0, 3)
  return months.length === 1 ? first : `${first} – ${last}`
}
