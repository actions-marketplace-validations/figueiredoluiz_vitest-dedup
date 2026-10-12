export function maxEndDate(start: string): Date {
  const date = new Date(start)
  date.setFullYear(date.getFullYear() + 1)
  date.setDate(date.getDate() - 1)
  return date
}
