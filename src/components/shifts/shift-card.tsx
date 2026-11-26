"use client"
import Link from "next/link"
import { useServices } from "@/providers/services-provider"
import { getDemo } from "@/services/mock-services"
import { Badge } from "@/components/ui/badge"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatShiftWhen } from "@/features/shifts/list-shifts"
import { cn } from "@/lib/utils"
import type { Shift } from "@/types/models"

interface ShiftCardProps {
  shift: Shift
  badge: string
  subtitle: string
  muted?: boolean
}

export function ShiftCard({ shift, badge, subtitle, muted }: ShiftCardProps) {
  const demo = getDemo(useServices())
  return (
    <Card className={cn(muted && "opacity-50")}>
      <CardHeader>
        <CardTitle>{formatShiftWhen(shift.startTime, shift.endTime)}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
        <CardAction>
          <Badge variant={muted ? "outline" : "default"}>{badge}</Badge>
        </CardAction>
      </CardHeader>
      {demo && <CardContent><Link className="underline text-sm" href={`/shift/${shift.id}`}>View shift details</Link></CardContent>}
      {shift.note && <CardContent className="text-muted-foreground">{shift.note}</CardContent>}
    </Card>
  )
}

export function ShiftListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[0, 1, 2].map((i) => (
        <Skeleton key={i} className="h-20 rounded-xl" />
      ))}
    </div>
  )
}
