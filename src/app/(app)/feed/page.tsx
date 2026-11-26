
"use client"

import { CalendarX } from "lucide-react"
import { useEffect, useState } from "react"
import { EmptyState } from "@/components/layout/empty-state"
import { PageHeader } from "@/components/layout/page-header"
import {
  ShiftCard,
  ShiftListSkeleton,
} from "@/components/shifts/shift-card"
import {
  loadFeed,
  type FeedShift,
} from "@/features/shifts/list-shifts"
import {
  DAYS_OF_WEEK,
  filterShifts,
  getAvailableRoles,
  type DayFilter,
} from "@/features/shifts/filter-shifts"
import { useAuth } from "@/providers/auth-provider"
import { getDemo } from "@/services/mock-services"
import { useServices } from "@/providers/services-provider"

type FeedState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; shifts: FeedShift[] }

export default function FeedPage() {
  const auth = useAuth()
  const services = useServices()

  const user =
    auth.status === "signedIn" ? auth.user : null

  const [state, setState] = useState<FeedState>({
    status: "loading",
  })

  const [selectedRole, setSelectedRole] =
    useState("all")

  const [selectedDay, setSelectedDay] =
    useState<DayFilter>("all")

  useEffect(() => {
    if (!user) return

    let active = true

    loadFeed(services, user)
      .then(
        (shifts) =>
          active &&
          setState({ status: "ready", shifts }),
      )
      .catch(
        () =>
          active &&
          setState({ status: "error" }),
      )

    return () => {
      active = false
    }
  }, [services, user])

  const shifts =
    state.status === "ready" ? state.shifts : []

  const roles = getAvailableRoles(shifts)

  const filteredShifts = filterShifts(shifts, {
    role: selectedRole,
    day: selectedDay,
  })

  const hasFilters =
    selectedRole !== "all" || selectedDay !== "all"

  function clearFilters() {
    setSelectedRole("all")
    setSelectedDay("all")
  }

  return (
    <>
      <PageHeader
        title="Open Shifts"
        description="Shifts your coworkers need covered."
      />

      {user?.isManager && getDemo(services) && <section className="space-y-3"><h2 className="font-semibold">Pending approvals</h2>{getDemo(services)!.pending().length === 0 && <p>No pending claims.</p>}{getDemo(services)!.pending().map(shift => <ShiftCard key={shift.id} shift={shift} badge="Pending" subtitle={shift.role}/>)}</section>}
      {state.status === "loading" && (
        <ShiftListSkeleton />
      )}

      {state.status === "error" && (
        <p
          role="alert"
          className="text-sm text-destructive"
        >
          Could not load shifts. Try again.
        </p>
      )}

      {state.status === "ready" &&
        shifts.length === 0 && (
          <EmptyState
            icon={CalendarX}
            title="No open shifts"
            description="New shifts at your workplace show up here."
          />
        )}

      {state.status === "ready" &&
        shifts.length > 0 && (
          <div className="flex flex-col gap-4">

            {/* Shift filters */}
            <div className="rounded-xl border bg-card p-4">
              <div className="grid grid-cols-2 gap-3">

                {/* Role filter */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="role-filter"
                    className="text-sm font-medium"
                  >
                    Role
                  </label>

                  <select
                    id="role-filter"
                    value={selectedRole}
                    onChange={(event) =>
                      setSelectedRole(event.target.value)
                    }
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  >
                    <option value="all">
                      All roles
                    </option>

                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Day filter */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="day-filter"
                    className="text-sm font-medium"
                  >
                    Day
                  </label>

                  <select
                    id="day-filter"
                    value={selectedDay}
                    onChange={(event) =>
                      setSelectedDay(
                        event.target.value as DayFilter,
                      )
                    }
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  >
                    <option value="all">
                      All days
                    </option>

                    {DAYS_OF_WEEK.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Result count and reset button */}
              <div className="mt-4 flex items-center justify-between">
                <p
                  aria-live="polite"
                  className="text-sm text-muted-foreground"
                >
                  {filteredShifts.length} available{" "}
                  {filteredShifts.length === 1
                    ? "shift"
                    : "shifts"}
                </p>

                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>

            {/* Filtered results */}
            {filteredShifts.length === 0 ? (
              <EmptyState
                icon={CalendarX}
                title="No matching shifts"
                description="Try changing or clearing your filters."
              />
            ) : (
              <div className="flex flex-col gap-3">
                {filteredShifts.map((shift) => (
                  <ShiftCard
                    key={shift.id}
                    shift={shift}
                    badge={shift.role}
                    subtitle={`Posted by ${shift.posterName}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
    </>
  )
}
