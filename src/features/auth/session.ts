import type { AuthService, AuthUser } from "@/services/auth/auth-service"
import type { UserRepository } from "@/services/users/user-repository"
import type { User } from "@/types/models"
import type { Credentials } from "./schema"

interface SessionDeps {
  auth: AuthService
  users: UserRepository
}

export async function ensureProfile(users: UserRepository, authUser: AuthUser): Promise<User> {
  const existing = await users.get(authUser.id)
  if (existing) return existing
  const user: User = {
    id: authUser.id,
    email: authUser.email,
    displayName: "",
    workplaceId: "",
    role: "",
    isManager: false,
  }
  await users.create(user)
  return user
}

export async function signUp({ auth, users }: SessionDeps, { email, password }: Credentials) {
  return ensureProfile(users, await auth.signUp(email, password))
}

export async function signIn({ auth, users }: SessionDeps, { email, password }: Credentials) {
  return ensureProfile(users, await auth.signIn(email, password))
}

export function signOut({ auth }: Pick<SessionDeps, "auth">) {
  return auth.signOut()
}

export function homePathFor(user: User) {
  return user.workplaceId ? "/feed" : "/join"
}
