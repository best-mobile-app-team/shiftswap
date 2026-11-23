"use client"

import { PageHeader } from "@/components/layout/page-header"
import { PostShiftForm } from "@/components/shifts/post-shift-form"
import { useAuth } from "@/providers/auth-provider"

export default function PostPage() {
  const auth = useAuth()
  if (auth.status !== "signedIn") return null

  return (
    <>
      <PageHeader title="Post Shift" description="Post a shift you need covered." />
      <PostShiftForm user={auth.user} />
    </>
  )
}
