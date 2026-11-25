"use client"

import { CalendarX } from "lucide-react"
import { useEffect, useState } from "react"
import { EmptyState } from "@/components/layout/empty-state"
import { PageHeader } from "@/components/layout/page-header"
import { ShiftCard, ShiftListSkeleton } from "@/components/shifts/shift-card"
import { loadFeed, type FeedShift } from "@/features/shifts/list-shifts"
import { useAuth } from "@/providers/auth-provider"
import { useServices } from "@/providers/services-provider"

type FeedState = { status: "loading" } | { status: "error" } | { status: "ready"; shifts: FeedShift[] }

export default function FeedPage() {
  const auth = useAuth()
  const services = useServices()
  const user = auth.status === "signedIn" ? auth.user : null
  const [state, setState] = useState<FeedState>({ status: "loading" })

  useEffect(() => {
    if (!user) return
    let active = true
    loadFeed(services, user)
      .then((shifts) => active && setState({ status: "ready", shifts }))
      .catch(() => active && setState({ status: "error" }))
    return () => {
      active = false
    }
  }, [services, user])

  return (
    <>
      <PageHeader title="Open Shifts" description="Shifts your coworkers need covered." />
      {state.status === "loading" && <ShiftListSkeleton />}
      {state.status === "error" && (
        <p role="alert" className="text-sm text-destructive">Could not load shifts. Try again.</p>
      )}
      {state.status === "ready" && state.shifts.length === 0 && (
        <EmptyState icon={CalendarX} title="No open shifts" description="New shifts at your workplace show up here." />
      )}
      {state.status === "ready" && state.shifts.length > 0 && (
        <div className="flex flex-col gap-3">
          {state.shifts.map((shift) => (
            <ShiftCard key={shift.id} shift={shift} badge={shift.role} subtitle={`Posted by ${shift.posterName}`} />
          ))}
        </div>
      )}
    </>
  )
}
