"use client"

import { useEffect, useState, type ReactNode } from "react"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "./auth-provider"
import { ServicesProvider } from "./services-provider"
import { createMockServices } from "@/services/mock-services"
import type { Services } from "@/services/container"

const useMockServices =
  process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_USE_MOCK_SERVICES !== "false"

export function Providers({
  children,
}: {
  children: ReactNode
}) {
  const [services, setServices] = useState<Services>()

  useEffect(() => {
    if (useMockServices) {
      setServices(createMockServices())
    }
  }, [])

  if (useMockServices && !services) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading ShiftSwap...
      </div>
    )
  }

  return (
    <ServicesProvider services={services}>
      <AuthProvider>
        {useMockServices && (
          <div className="bg-amber-100 px-3 py-2 text-center text-xs font-medium text-amber-900">
            Development preview — sample data
          </div>
        )}

        {children}
        <Toaster />
      </AuthProvider>
    </ServicesProvider>
  )
}