"use client"
import { useState } from "react"
import { SignOutButton } from "@/components/auth/sign-out-button"
import { PageHeader } from "@/components/layout/page-header"
import { useAuth } from "@/providers/auth-provider"
import { useServices } from "@/providers/services-provider"
import { getDemo } from "@/services/mock-services"
export default function ProfilePage() {
  const auth = useAuth(), demo = getDemo(useServices())
  const [enabled, setEnabled] = useState(() => demo?.notificationsEnabled() ?? false)
  if (auth.status !== "signedIn") return null
  const user = auth.user
  const notices = demo?.notifications() ?? []
  return <><PageHeader title="Profile" action={<SignOutButton/>}/><section className="rounded-xl border p-4 space-y-3"><h2 className="font-semibold">{user.displayName || user.email}</h2><p>{user.email}</p><p>Workplace: {demo?.workplaceName() ?? (user.workplaceId || "Not joined")}</p><p>Role: {user.role || "Not set"}</p><p>Access: {user.isManager ? "Manager" : "Employee"}</p>{demo && <p>Invite code: TEST123</p>}</section><section className="rounded-xl border p-4 space-y-3"><h2 className="font-semibold">Notifications</h2><label className="flex gap-2"><input type="checkbox" disabled={!demo} checked={enabled} onChange={e => { demo?.setNotifications(e.target.checked); setEnabled(e.target.checked) }}/> In-app demo notifications</label><p className="text-sm text-muted-foreground">Simulated alerts only; no device push delivery.</p>{notices.length ? <ul className="space-y-2">{notices.map((n,i) => <li key={i} className="border-t pt-2">{n}</li>)}</ul> : <p>No notifications yet.</p>}</section>{demo && <p className="text-sm text-muted-foreground">Switch accounts by signing out. Employee: demo@example.com; manager: manager@example.com. Demo password: demo123.</p>}</>
}
