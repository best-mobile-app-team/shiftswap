export interface AuthUser {
  id: string
  email: string
}

export interface AuthService {
  signUp(email: string, password: string): Promise<AuthUser>
  signIn(email: string, password: string): Promise<AuthUser>
  signOut(): Promise<void>
  onChange(listener: (user: AuthUser | null) => void): () => void
}
