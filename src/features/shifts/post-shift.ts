import type { ShiftRepository } from "@/services/shifts/shift-repository"
import type { NewShift, User } from "@/types/models"
import { postShiftSchema, type PostShiftField, type PostShiftInput } from "./schema"

export type PostShiftErrors = Partial<Record<PostShiftField | "form", string>>

type BuildResult = { ok: true; shift: NewShift } | { ok: false; errors: PostShiftErrors }
type PostResult = { ok: true; id: string } | { ok: false; errors: PostShiftErrors }

function localDateTime(date: string, time: string): Date | null {
  const [year, month, day] = date.split("-").map(Number)
  const [hours, minutes] = time.split(":").map(Number)
  if (hours > 23 || minutes > 59) return null
  const result = new Date(year, month - 1, day, hours, minutes)
  const sameDay =
    result.getFullYear() === year && result.getMonth() === month - 1 && result.getDate() === day
  return sameDay ? result : null
}

export function buildShift(input: PostShiftInput, poster: User, now = new Date()): BuildResult {
  if (!poster.workplaceId) {
    return { ok: false, errors: { form: "Join a workplace before posting a shift." } }
  }

  const parsed = postShiftSchema.safeParse(input)
  if (!parsed.success) {
    const errors: PostShiftErrors = {}
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as PostShiftField
      errors[field] ??= issue.message
    }
    return { ok: false, errors }
  }

  const { date, startTime, endTime, role, note } = parsed.data
  const day = localDateTime(date, "00:00")
  const start = localDateTime(date, startTime)
  const end = localDateTime(date, endTime)

  if (!day) return { ok: false, errors: { date: "Pick a valid date." } }
  if (!start) return { ok: false, errors: { startTime: "Pick a valid start time." } }
  if (!end) return { ok: false, errors: { endTime: "Pick a valid end time." } }
  if (end.getTime() === start.getTime()) {
    return { ok: false, errors: { endTime: "End time must differ from start time." } }
  }
  if (start.getTime() <= now.getTime()) {
    return { ok: false, errors: { startTime: "Shift must start in the future." } }
  }
  if (end < start) end.setDate(end.getDate() + 1)

  return {
    ok: true,
    shift: {
      workplaceId: poster.workplaceId,
      postedBy: poster.id,
      date: day,
      startTime: start,
      endTime: end,
      role,
      note,
      status: "open",
      claimedBy: null,
    },
  }
}

export async function postShift(
  shifts: ShiftRepository,
  input: PostShiftInput,
  poster: User,
  now = new Date(),
): Promise<PostResult> {
  const result = buildShift(input, poster, now)
  if (!result.ok) return result
  return { ok: true, id: await shifts.create(result.shift) }
}
