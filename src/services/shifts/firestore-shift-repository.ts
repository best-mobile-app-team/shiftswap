import { addDoc, collection, type Firestore } from "firebase/firestore"
import type { NewShift } from "@/types/models"
import type { ShiftRepository } from "./shift-repository"

export class FirestoreShiftRepository implements ShiftRepository {
  private readonly db: () => Firestore

  constructor(db: () => Firestore) {
    this.db = db
  }

  async create(shift: NewShift) {
    const ref = await addDoc(collection(this.db(), "shifts"), shift)
    return ref.id
  }
}
