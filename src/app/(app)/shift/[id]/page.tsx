"use client"
import { useParams } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { useServices } from "@/providers/services-provider"
import { useAuth } from "@/providers/auth-provider"
import { getDemo } from "@/services/mock-services"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { formatShiftWhen } from "@/features/shifts/list-shifts"
export default function ShiftDetail() {
  const { id } = useParams<{id:string}>(), demo = getDemo(useServices()), auth = useAuth()
  const [error,setError] = useState("")
  const [revision,setRevision] = useState(0)
  if (!demo || auth.status !== "signedIn") return <p>Shift details are available in demo mode.</p>
  let shift: ReturnType<typeof demo.getShift>
  try { shift = demo.getShift(id) } catch { return <p>Shift not found. <Link href="/feed">Return to feed</Link></p> }
  const user = auth.user
  function act(action: () => void) { try { action(); setError(""); setRevision(n=>n+1) } catch(e) { setError(e instanceof Error ? e.message : "Unable to update shift.") } }
  return <><PageHeader title="Shift Details"/><section key={revision} className="rounded-xl border p-4 space-y-3"><h2 className="font-semibold">{shift.role}</h2><p>{formatShiftWhen(shift.startTime,shift.endTime)}</p><p>Status: {shift.status === "claimed" ? "Pending approval" : shift.status}</p><p>{shift.note || "No note provided."}</p>{shift.status === "open" && shift.postedBy !== user.id && <Button onClick={()=>act(()=>demo.claim(id))}>Claim shift</Button>}{user.isManager && shift.status === "claimed" && <div className="flex gap-2"><Button onClick={()=>act(()=>demo.decide(id,"approved"))}>Approve</Button><Button variant="outline" onClick={()=>act(()=>demo.decide(id,"declined"))}>Decline</Button></div>}{error && <p role="alert">{error}</p>}</section><Link className="underline" href="/feed">Back to feed</Link><Link className="underline" href="/my-shifts">My shifts</Link></>
}
