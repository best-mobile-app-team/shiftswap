"use client"

import { useRouter, usePathname } from "next/navigation"
import { useEffect, type ReactNode } from "react"
import { LoadingScreen } from "@/components/layout/loading-screen"
import { useAuth } from "@/providers/auth-provider"

export function RequireAuth({ children }: { children: ReactNode }) {
  const auth = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (auth.status === "signedOut") router.replace("/login")
    if (auth.status === "signedIn" && !auth.user.workplaceId && pathname !== "/join") router.replace("/join")
  }, [auth, router, pathname])

  if (auth.status !== "signedIn" || (!auth.user.workplaceId && pathname !== "/join")) return <LoadingScreen />
  return children
}
