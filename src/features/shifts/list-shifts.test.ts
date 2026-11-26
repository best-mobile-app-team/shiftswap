import { describe, expect, it, vi } from "vitest"
import type { ShiftRepository } from "@/services/shifts/shift-repository"
import type { Shift, User } from "@/types/models"
import { formatShiftWhen, loadFeed, loadMyShifts } from "./list-shifts"

const now = new Date(2026, 10, 20, 9, 0)
const viewer: User = { id: "me", email: "me@x.com", displayName: "Me", workplaceId: "w1", role: "", isManager: false }

function shift(id: string, day: number, postedBy = "maria"): Shift {
  return {
    id,
    workplaceId: "w1",
    postedBy,
    date: new Date(2026, 10, day),
    startTime: new Date(2026, 10, day, 16),
    endTime: new Date(2026, 10, day, 22),
    role: "Server",
    note: "",
    status: "open",
    claimedBy: null,
  }
}

function fakeShifts(list: Shift[]): ShiftRepository {
  return {
    create: vi.fn(),
    listOpen: vi.fn().mockResolvedValue(list),
    listPostedBy: vi.fn().mockResolvedValue(list),
    listClaimedBy: vi.fn().mockResolvedValue([]),
  }
}

const users = {
  get: vi.fn(async (id: string) => (id === "maria" ? { ...viewer, id, displayName: "Maria" } : null)),
  create: vi.fn(),
}

describe("loadFeed", () => {
  it("lists upcoming open shifts soonest first with poster names", async () => {
    const shifts = fakeShifts([shift("b", 25, "me"), shift("past", 19), shift("a", 21), shift("c", 26, "ghost")])
    const feed = await loadFeed({ shifts, users }, viewer, now)
    expect(feed.map((s) => [s.id, s.posterName])).toEqual([
      ["a", "Maria"],
      ["b", "you"],
      ["c", "a coworker"],
    ])
    expect(shifts.listOpen).toHaveBeenCalledWith("w1")
  })

  it("is empty without a workplace", async () => {
    const shifts = fakeShifts([shift("a", 21)])
    await expect(loadFeed({ shifts, users }, { ...viewer, workplaceId: "" }, now)).resolves.toEqual([])
    expect(shifts.listOpen).not.toHaveBeenCalled()
  })
})

describe("loadMyShifts", () => {
  it("returns posted and claimed shifts soonest first", async () => {
    const shifts = fakeShifts([shift("later", 26), shift("sooner", 21)])
    const mine = await loadMyShifts(shifts, viewer)
    expect(mine.posted.map((s) => s.id)).toEqual(["sooner", "later"])
    expect(mine.claimed).toEqual([])
    expect(shifts.listPostedBy).toHaveBeenCalledWith("w1", "me")
  })
})

describe("formatShiftWhen", () => {
  it("formats like the wireframe", () => {
    expect(formatShiftWhen(new Date(2026, 10, 4, 16), new Date(2026, 10, 4, 22))).toBe("Wed Nov 4 · 4–10 PM")
    expect(formatShiftWhen(new Date(2026, 10, 5, 7), new Date(2026, 10, 5, 13))).toBe("Thu Nov 5 · 7 AM–1 PM")
    expect(formatShiftWhen(new Date(2026, 10, 25, 10, 30), new Date(2026, 10, 25, 11, 30))).toBe(
      "Wed Nov 25 · 10:30–11:30 AM",
    )
  })
})
