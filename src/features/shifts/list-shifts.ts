import type { ShiftRepository } from "@/services/shifts/shift-repository"
import type { UserRepository } from "@/services/users/user-repository"
import type { Shift, User } from "@/types/models"

export type FeedShift = Shift & { posterName: string }

export interface MyShifts {
  posted: Shift[]
  claimed: Shift[]
}

const bySoonest = (a: Shift, b: Shift) => a.startTime.getTime() - b.startTime.getTime()

async function posterNames(users: UserRepository, ids: string[], viewer: User) {
  const names = new Map<string, string>()
  await Promise.all(
    [...new Set(ids)].map(async (id) => {
      if (id === viewer.id) return names.set(id, "you")
      const poster = await users.get(id).catch(() => null)
      names.set(id, poster?.displayName || "a coworker")
    }),
  )
  return names
}

export async function loadFeed(
  { shifts, users }: { shifts: ShiftRepository; users: UserRepository },
  viewer: User,
  now = new Date(),
): Promise<FeedShift[]> {
  if (!viewer.workplaceId) return []
  const upcoming = (await shifts.listOpen(viewer.workplaceId))
    .filter((shift) => shift.startTime.getTime() > now.getTime())
    .sort(bySoonest)
  const names = await posterNames(users, upcoming.map((shift) => shift.postedBy), viewer)
  return upcoming.map((shift) => ({ ...shift, posterName: names.get(shift.postedBy) ?? "a coworker" }))
}

export async function loadMyShifts(shifts: ShiftRepository, viewer: User): Promise<MyShifts> {
  if (!viewer.workplaceId) return { posted: [], claimed: [] }
  const [posted, claimed] = await Promise.all([
    shifts.listPostedBy(viewer.workplaceId, viewer.id),
    shifts.listClaimedBy(viewer.workplaceId, viewer.id),
  ])
  return { posted: posted.sort(bySoonest), claimed: claimed.sort(bySoonest) }
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function clock(date: Date) {
  const hours = date.getHours() % 12 || 12
  const minutes = date.getMinutes()
  return minutes ? `${hours}:${String(minutes).padStart(2, "0")}` : String(hours)
}

const meridiem = (date: Date) => (date.getHours() < 12 ? "AM" : "PM")

export function formatShiftWhen(start: Date, end: Date) {
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "Time unavailable"
  const day = `${DAYS[start.getDay()]} ${MONTHS[start.getMonth()]} ${start.getDate()}`
  const range =
    meridiem(start) === meridiem(end)
      ? `${clock(start)}–${clock(end)} ${meridiem(end)}`
      : `${clock(start)} ${meridiem(start)}–${clock(end)} ${meridiem(end)}`
  return `${day} · ${range}`
}
