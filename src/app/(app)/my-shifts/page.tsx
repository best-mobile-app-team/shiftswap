"use client"

import { CalendarX } from "lucide-react"
import { useEffect, useState } from "react"
import { EmptyState } from "@/components/layout/empty-state"
import { PageHeader } from "@/components/layout/page-header"
import { ShiftCard, ShiftListSkeleton } from "@/components/shifts/shift-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { loadMyShifts, type MyShifts } from "@/features/shifts/list-shifts"
import { useAuth } from "@/providers/auth-provider"
import { useServices } from "@/providers/services-provider"
import type { Shift, ShiftStatus } from "@/types/models"

type MyShiftsState = { status: "loading" } | { status: "error" } | { status: "ready"; shifts: MyShifts; loadedAt: number }

const STATUS_LABELS: Record<ShiftStatus, string> = {
  open: "Open",
  claimed: "Pending",
  approved: "Approved",
  declined: "Declined",
}

function ShiftList({ shifts, empty, now }: { shifts: Shift[]; empty: string; now: number }) {
  if (shifts.length === 0) return <EmptyState icon={CalendarX} title={empty} />
  return (
    <div className="flex flex-col gap-3">
      {shifts.map((shift) => {
        const done = shift.endTime.getTime() < now
        return (
          <ShiftCard
            key={shift.id}
            shift={shift}
            badge={done ? "Done" : STATUS_LABELS[shift.status]}
            subtitle={shift.role}
            muted={done}
          />
        )
      })}
    </div>
  )
}

export default function MyShiftsPage() {
  const auth = useAuth()
  const { shifts } = useServices()
  const user = auth.status === "signedIn" ? auth.user : null
  const [state, setState] = useState<MyShiftsState>({ status: "loading" })

  useEffect(() => {
    if (!user) return
    let active = true
    loadMyShifts(shifts, user)
      .then((mine) => active && setState({ status: "ready", shifts: mine, loadedAt: Date.now() }))
      .catch(() => active && setState({ status: "error" }))
    return () => {
      active = false
    }
  }, [shifts, user])

  return (
    <>
      <PageHeader title="My Shifts" />
      <Tabs defaultValue="posted">
        <TabsList className="w-full">
          <TabsTrigger value="claimed">Claimed</TabsTrigger>
          <TabsTrigger value="posted">Posted</TabsTrigger>
        </TabsList>
        {state.status === "loading" && <ShiftListSkeleton />}
        {state.status === "error" && (
          <p role="alert" className="text-sm text-destructive">Could not load your shifts. Try again.</p>
        )}
        {state.status === "ready" && (
          <>
            <TabsContent value="claimed">
              <ShiftList shifts={state.shifts.claimed} empty="No claimed shifts yet" now={state.loadedAt} />
            </TabsContent>
            <TabsContent value="posted">
              <ShiftList shifts={state.shifts.posted} empty="You haven't posted any shifts" now={state.loadedAt} />
            </TabsContent>
          </>
        )}
      </Tabs>
    </>
  )
}
