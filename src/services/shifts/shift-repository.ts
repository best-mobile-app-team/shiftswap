import type { NewShift } from "@/types/models"

export interface ShiftRepository {
  create(shift: NewShift): Promise<string>
}
