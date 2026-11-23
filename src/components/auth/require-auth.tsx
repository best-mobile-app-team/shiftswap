"use client"

import { useRouter } from "next/navigation"
import { useEffect, type ReactNode } from "react"
import { LoadingScreen } from "@/components/layout/loading-screen"
import { useAuth } from "@/providers/auth-provider"

export function RequireAuth({ children }: { children: ReactNode }) {
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (auth.status === "signedOut") router.replace("/login")
  }, [auth.status, router])

  if (auth.status !== "signedIn") return <LoadingScreen />
  return children
}
