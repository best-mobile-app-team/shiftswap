
import { describe, expect, it } from "vitest"
import type { Shift } from "@/types/models"
import {
  filterShifts,
  getAvailableRoles,
} from "./filter-shifts"

function createShift(
  id: string,
  role: string,
  day: number,
): Shift {
  return {
    id,
    workplaceId: "test-workplace",
    postedBy: "test-user",
    date: new Date(2026, 10, day),
    startTime: new Date(2026, 10, day, 16),
    endTime: new Date(2026, 10, day, 22),
    role,
    note: "",
    status: "open",
    claimedBy: null,
  }
}

const shifts = [
  createShift("1", "Server", 27),
  createShift("2", "Barista", 28),
  createShift("3", "Host", 29),
  createShift("4", "Server", 29),
]

describe("getAvailableRoles", () => {
  it("returns unique roles in alphabetical order", () => {
    expect(getAvailableRoles(shifts)).toEqual([
      "Barista",
      "Host",
      "Server",
    ])
  })

  it("returns an empty array when there are no shifts", () => {
    expect(getAvailableRoles([])).toEqual([])
  })
})

describe("filterShifts", () => {
  it("returns all shifts when filters are cleared", () => {
    expect(
      filterShifts(shifts, {
        role: "all",
        day: "all",
      }),
    ).toEqual(shifts)
  })

  it("filters shifts by role", () => {
    const result = filterShifts(shifts, {
      role: "Server",
      day: "all",
    })

    expect(result.map((shift) => shift.id)).toEqual([
      "1",
      "4",
    ])
  })

  it("filters shifts by day", () => {
    const result = filterShifts(shifts, {
      role: "all",
      day: "Sunday",
    })

    expect(result.map((shift) => shift.id)).toEqual([
      "3",
      "4",
    ])
  })

  it("combines role and day filters", () => {
    const result = filterShifts(shifts, {
      role: "Server",
      day: "Sunday",
    })

    expect(result.map((shift) => shift.id)).toEqual([
      "4",
    ])
  })

  it("returns no shifts when nothing matches", () => {
    expect(
      filterShifts(shifts, {
        role: "Barista",
        day: "Friday",
      }),
    ).toEqual([])
  })

  it("handles an empty shift list", () => {
    expect(
      filterShifts([], {
        role: "all",
        day: "all",
      }),
    ).toEqual([])
  })

  it("preserves the original shift order", () => {
    const result = filterShifts(shifts, {
      role: "Server",
      day: "all",
    })

    expect(result[0].id).toBe("1")
    expect(result[1].id).toBe("4")
  })
})
