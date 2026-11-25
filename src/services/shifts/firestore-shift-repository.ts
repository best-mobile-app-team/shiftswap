import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  type DocumentData,
  type Firestore,
  type QueryDocumentSnapshot,
  type QueryFieldFilterConstraint,
} from "firebase/firestore"
import type { NewShift, Shift, ShiftStatus } from "@/types/models"
import type { ShiftRepository } from "./shift-repository"

const STATUSES: ShiftStatus[] = ["open", "claimed", "approved", "declined"]

function toDate(value: unknown): Date {
  if (value instanceof Date) return value
  if (value && typeof (value as { toDate?: unknown }).toDate === "function") {
    return (value as { toDate: () => Date }).toDate()
  }
  return new Date(Number.NaN)
}

function toShift(snapshot: QueryDocumentSnapshot<DocumentData>): Shift {
  const data = snapshot.data()
  return {
    id: snapshot.id,
    workplaceId: data.workplaceId ?? "",
    postedBy: data.postedBy ?? "",
    date: toDate(data.date),
    startTime: toDate(data.startTime),
    endTime: toDate(data.endTime),
    role: data.role ?? "",
    note: data.note ?? "",
    status: STATUSES.includes(data.status) ? data.status : "open",
    claimedBy: typeof data.claimedBy === "string" ? data.claimedBy : null,
  }
}

export class FirestoreShiftRepository implements ShiftRepository {
  private readonly db: () => Firestore

  constructor(db: () => Firestore) {
    this.db = db
  }

  async create(shift: NewShift) {
    const ref = await addDoc(collection(this.db(), "shifts"), shift)
    return ref.id
  }

  listOpen(workplaceId: string) {
    return this.list(workplaceId, where("status", "==", "open"))
  }

  listPostedBy(workplaceId: string, userId: string) {
    return this.list(workplaceId, where("postedBy", "==", userId))
  }

  listClaimedBy(workplaceId: string, userId: string) {
    return this.list(workplaceId, where("claimedBy", "==", userId))
  }

  private async list(workplaceId: string, filter: QueryFieldFilterConstraint) {
    const snapshot = await getDocs(
      query(collection(this.db(), "shifts"), where("workplaceId", "==", workplaceId), filter),
    )
    return snapshot.docs.map(toShift)
  }
}
