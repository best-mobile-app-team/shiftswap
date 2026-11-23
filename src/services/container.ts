import { firebaseAuth, firestore } from "@/lib/firebase"
import type { AuthService } from "./auth/auth-service"
import { FirebaseAuthService } from "./auth/firebase-auth-service"
import { FirestoreShiftRepository } from "./shifts/firestore-shift-repository"
import type { ShiftRepository } from "./shifts/shift-repository"
import { FirestoreUserRepository } from "./users/firestore-user-repository"
import type { UserRepository } from "./users/user-repository"

export interface Services {
  auth: AuthService
  users: UserRepository
  shifts: ShiftRepository
}

export function createServices(): Services {
  return {
    auth: new FirebaseAuthService(firebaseAuth),
    users: new FirestoreUserRepository(firestore),
    shifts: new FirestoreShiftRepository(firestore),
  }
}
