import { doc, getDoc, setDoc, type Firestore } from "firebase/firestore"
import type { User } from "@/types/models"
import type { UserRepository } from "./user-repository"

export class FirestoreUserRepository implements UserRepository {
  private readonly db: () => Firestore

  constructor(db: () => Firestore) {
    this.db = db
  }

  async get(id: string): Promise<User | null> {
    const snapshot = await getDoc(doc(this.db(), "users", id))
    if (!snapshot.exists()) return null
    const data = snapshot.data()
    return {
      id: snapshot.id,
      email: data.email ?? "",
      displayName: data.displayName ?? "",
      workplaceId: data.workplaceId ?? "",
      role: data.role ?? "",
      isManager: data.isManager === true,
    }
  }

  async create({ id, ...data }: User) {
    await setDoc(doc(this.db(), "users", id), data)
  }
}
