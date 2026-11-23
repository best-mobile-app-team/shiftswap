import { describe, expect, it, vi } from "vitest"
import type { User } from "@/types/models"
import { buildShift, postShift } from "./post-shift"

const now = new Date(2026, 10, 20, 9, 0)
const poster: User = {
  id: "u1",
  email: "a@b.com",
  displayName: "",
  workplaceId: "w1",
  role: "Server",
  isManager: false,
}
const input = { date: "2026-11-21", startTime: "10:00", endTime: "14:00", role: "Server", note: "" }

describe("buildShift", () => {
  it("builds an open shift for the poster's workplace", () => {
    const result = buildShift(input, poster, now)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.shift).toMatchObject({
      workplaceId: "w1",
      postedBy: "u1",
      role: "Server",
      status: "open",
      claimedBy: null,
    })
    expect(result.shift.startTime).toEqual(new Date(2026, 10, 21, 10, 0))
    expect(result.shift.endTime).toEqual(new Date(2026, 10, 21, 14, 0))
  })

  it("rolls an overnight end time to the next day", () => {
    const result = buildShift({ ...input, startTime: "22:00", endTime: "06:00" }, poster, now)
    expect(result.ok && result.shift.endTime).toEqual(new Date(2026, 10, 22, 6, 0))
  })

  it("requires a workplace", () => {
    const result = buildShift(input, { ...poster, workplaceId: "" }, now)
    expect(result).toEqual({ ok: false, errors: { form: "Join a workplace before posting a shift." } })
  })

  it("rejects missing fields", () => {
    const result = buildShift({ date: "", startTime: "", endTime: "", role: " ", note: "" }, poster, now)
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(Object.keys(result.errors).sort()).toEqual(["date", "endTime", "role", "startTime"])
  })

  it("rejects impossible dates", () => {
    expect(buildShift({ ...input, date: "2026-02-31" }, poster, now).ok).toBe(false)
  })

  it("rejects shifts in the past", () => {
    expect(buildShift({ ...input, date: "2026-11-19" }, poster, now).ok).toBe(false)
  })

  it("rejects equal start and end", () => {
    expect(buildShift({ ...input, endTime: "10:00" }, poster, now).ok).toBe(false)
  })
})

describe("postShift", () => {
  it("saves a valid shift", async () => {
    const shifts = { create: vi.fn().mockResolvedValue("s1") }
    await expect(postShift(shifts, input, poster, now)).resolves.toEqual({ ok: true, id: "s1" })
    expect(shifts.create).toHaveBeenCalledOnce()
  })

  it("does not save an invalid shift", async () => {
    const shifts = { create: vi.fn() }
    await postShift(shifts, { ...input, role: "" }, poster, now)
    expect(shifts.create).not.toHaveBeenCalled()
  })
})
