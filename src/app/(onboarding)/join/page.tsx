"use client"
import { useState, useEffect, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/layout/page-header"
import { useServices } from "@/providers/services-provider"
import { useAuth } from "@/providers/auth-provider"
import { getDemo } from "@/services/mock-services"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
export default function JoinPage() {
  const demo = getDemo(useServices()), auth = useAuth(), router = useRouter()
  const [error, setError] = useState("")
  useEffect(() => { if (auth.status === "signedIn" && auth.user.workplaceId) router.replace("/feed") }, [auth, router])
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const data = new FormData(e.currentTarget)
    try { if (!demo) throw new Error("Joining is available in the development preview only."); demo.join(String(data.get("code")), String(data.get("role"))); setError("") }
    catch (e) { setError(e instanceof Error ? e.message : "Unable to join.") }
  }
  return <><PageHeader title="Join Workplace" description="Enter your workplace invitation."/><form onSubmit={submit} className="flex flex-col gap-4 mt-4"><label>Invite code<Input name="code" required autoComplete="off" /></label><label>Role<Input name="role" required maxLength={50}/></label>{demo && <p className="text-sm text-muted-foreground">Demo invite: TEST123</p>}{error && <p role="alert" className="text-destructive">{error}</p>}<Button disabled={!demo}>Join workplace</Button></form></>
}
