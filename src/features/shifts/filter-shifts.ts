
import type { Shift } from "@/types/models"

export const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const

export type DayFilter =
  | "all"
  | (typeof DAYS_OF_WEEK)[number]

export interface ShiftFilters {
  role: string
  day: DayFilter
}

export function getAvailableRoles(
  shifts: readonly Shift[],
): string[] {
  return [...new Set(
    shifts
      .map((shift) => shift.role)
      .filter((role) => role.trim() !== ""),
  )].sort((a, b) => a.localeCompare(b))
}

export function filterShifts<T extends Shift>(
  shifts: readonly T[],
  filters: ShiftFilters,
): T[] {
  return shifts.filter((shift) => {
    const matchesRole =
      filters.role === "all" ||
      shift.role === filters.role

    const matchesDay =
      filters.day === "all" ||
      DAYS_OF_WEEK[shift.startTime.getDay()] === filters.day

    return matchesRole && matchesDay
  })
}
