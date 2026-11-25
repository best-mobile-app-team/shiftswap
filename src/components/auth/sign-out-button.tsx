"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { signOut } from "@/features/auth/session"
import { useServices } from "@/providers/services-provider"

export function SignOutButton() {
  const services = useServices()
  const router = useRouter()
  const [pending, setPending] = useState(false)

  async function onClick() {
    setPending(true)
    try {
      await signOut(services)
      router.replace("/login")
    } catch {
      toast.error("Couldn't log out. Try again.")
      setPending(false)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={onClick} disabled={pending}>
      Log out
    </Button>
  )
}
