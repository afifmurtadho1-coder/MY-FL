import {
  addDays,
  addMonths,
  addWeeks,
  format,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns"
import { id as idLocale } from "date-fns/locale"

import { getTodayInJakarta } from "@/lib/utils"

export function toDateKey(date: Date) {
  return format(date, "yyyy-MM-dd")
}

export function parseDateKey(value: string) {
  return parseISO(value)
}

export function getTodayKey() {
  return getTodayInJakarta()
}

export function startOfWeekKey(value: string) {
  return toDateKey(startOfWeek(parseDateKey(value), { weekStartsOn: 1 }))
}

export function startOfMonthKey(value: string) {
  return toDateKey(startOfMonth(parseDateKey(value)))
}

export function shiftDay(value: string, amount: number) {
  return toDateKey(addDays(parseDateKey(value), amount))
}

export function shiftWeek(value: string, amount: number) {
  return toDateKey(addWeeks(parseDateKey(value), amount))
}

export function shiftMonth(value: string, amount: number) {
  return toDateKey(addMonths(parseDateKey(value), amount))
}

export function getWeekRange(value: string) {
  const start = parseDateKey(startOfWeekKey(value))
  const end = addDays(start, 6)

  return { start: toDateKey(start), end: toDateKey(end) }
}

export function getMonthRange(value: string) {
  const start = parseDateKey(startOfMonthKey(value))
  const end = addDays(addMonths(start, 1), -1)

  return { start: toDateKey(start), end: toDateKey(end) }
}

export function formatDayLabel(value: string) {
  return format(parseDateKey(value), "EEEE, d MMMM yyyy", {
    locale: idLocale,
  })
}

export function formatWeekLabel(value: string) {
  const start = parseDateKey(startOfWeekKey(value))
  const end = addDays(start, 6)
  const sameMonth =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth()

  if (sameMonth) {
    return `${format(start, "d", { locale: idLocale })}–${format(end, "d MMMM yyyy", { locale: idLocale })}`
  }

  if (start.getFullYear() === end.getFullYear()) {
    return `${format(start, "d MMM", { locale: idLocale })} – ${format(end, "d MMM yyyy", { locale: idLocale })}`
  }

  return `${format(start, "d MMM yyyy", { locale: idLocale })} – ${format(end, "d MMM yyyy", { locale: idLocale })}`
}

export function formatMonthLabel(value: string) {
  return format(parseDateKey(startOfMonthKey(value)), "MMMM yyyy", {
    locale: idLocale,
  })
}

export function formatChartDay(value: string) {
  return format(parseDateKey(value), "EEE", { locale: idLocale })
}

export function formatChartDate(value: string) {
  return format(parseDateKey(value), "d MMM", { locale: idLocale })
}

export function formatChartDayNumber(value: string) {
  return format(parseDateKey(value), "d")
}
