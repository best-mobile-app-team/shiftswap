"use client"

import type { ReactNode } from "react"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "./auth-provider"
import { ServicesProvider } from "./services-provider"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ServicesProvider>
      <AuthProvider>
        {children}
        <Toaster />
      </AuthProvider>
    </ServicesProvider>
  )
}
