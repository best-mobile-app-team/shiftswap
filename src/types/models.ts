export type ShiftStatus = "open" | "claimed" | "approved" | "declined"

export interface User {
  id: string
  email: string
  displayName: string
  workplaceId: string
  role: string
  isManager: boolean
}

export interface Workplace {
  id: string
  name: string
  inviteCode: string
}

export interface Shift {
  id: string
  workplaceId: string
  postedBy: string
  date: Date
  startTime: Date
  endTime: Date
  role: string
  note: string
  status: ShiftStatus
  claimedBy: string | null
}

export type NewShift = Omit<Shift, "id">
