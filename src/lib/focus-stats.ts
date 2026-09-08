export type FocusStats = {
  todaySessions: number
  totalFocusSeconds: number
  /** Minutes focused per weekday, Monday first. */
  weeklyMinutes: number[]
}

export const initialStats: FocusStats = {
  todaySessions: 0,
  totalFocusSeconds: 0,
  weeklyMinutes: [0, 0, 0, 0, 0, 0, 0],
}


export const weekdayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  if (hours === 0) return `${minutes}m`
  return `${hours}h ${minutes}m`
}

export function formatClock(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/** Index into weeklyMinutes for today's weekday, Monday = 0. */
export function todayIndex(date = new Date()) {
  return (date.getDay() + 6) % 7
}
