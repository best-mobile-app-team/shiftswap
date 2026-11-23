import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type Auth,
  type User as FirebaseUser,
} from "firebase/auth"
import type { AuthService, AuthUser } from "./auth-service"

const toAuthUser = (user: FirebaseUser): AuthUser => ({
  id: user.uid,
  email: user.email ?? "",
})

export class FirebaseAuthService implements AuthService {
  private readonly auth: () => Auth

  constructor(auth: () => Auth) {
    this.auth = auth
  }

  async signUp(email: string, password: string) {
    const credential = await createUserWithEmailAndPassword(this.auth(), email, password)
    return toAuthUser(credential.user)
  }

  async signIn(email: string, password: string) {
    const credential = await signInWithEmailAndPassword(this.auth(), email, password)
    return toAuthUser(credential.user)
  }

  signOut() {
    return signOut(this.auth())
  }

  onChange(listener: (user: AuthUser | null) => void) {
    return onAuthStateChanged(this.auth(), (user) => listener(user ? toAuthUser(user) : null))
  }
}
