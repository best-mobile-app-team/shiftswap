import type { NewShift, Shift } from "@/types/models"

export interface ShiftRepository {
  create(shift: NewShift): Promise<string>
  listOpen(workplaceId: string): Promise<Shift[]>
  listPostedBy(workplaceId: string, userId: string): Promise<Shift[]>
  listClaimedBy(workplaceId: string, userId: string): Promise<Shift[]>
}
