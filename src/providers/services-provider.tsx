"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { createServices, type Services } from "@/services/container"

const ServicesContext = createContext<Services | null>(null)

export function ServicesProvider({ children, services }: { children: ReactNode; services?: Services }) {
  const [value] = useState(() => services ?? createServices())
  return <ServicesContext.Provider value={value}>{children}</ServicesContext.Provider>
}

export function useServices() {
  const services = useContext(ServicesContext)
  if (!services) throw new Error("useServices must be used within ServicesProvider")
  return services
}
