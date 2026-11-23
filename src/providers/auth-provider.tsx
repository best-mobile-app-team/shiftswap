"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { ensureProfile } from "@/features/auth/session"
import type { User } from "@/types/models"
import { useServices } from "./services-provider"

export type AuthState =
  | { status: "loading" }
  | { status: "signedOut" }
  | { status: "signedIn"; user: User }

const AuthContext = createContext<AuthState>({ status: "loading" })

export function AuthProvider({ children }: { children: ReactNode }) {
  const { auth, users } = useServices()
  const [state, setState] = useState<AuthState>({ status: "loading" })

  useEffect(() => {
    let latest = 0
    return auth.onChange(async (authUser) => {
      const call = ++latest
      if (!authUser) {
        setState({ status: "signedOut" })
        return
      }
      try {
        const user = await ensureProfile(users, authUser)
        if (call === latest) setState({ status: "signedIn", user })
      } catch {
        if (call === latest) setState({ status: "signedOut" })
      }
    })
  }, [auth, users])

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
