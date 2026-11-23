"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { AuthForm } from "@/components/auth/auth-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { homePathFor } from "@/features/auth/session"
import { useAuth } from "@/providers/auth-provider"

export default function LoginPage() {
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (auth.status === "signedIn") router.replace(homePathFor(auth.user))
  }, [auth, router])

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 items-center px-4 py-12">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">ShiftSwap</CardTitle>
          <CardDescription>Hand off shifts you can&apos;t cover.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="login">Log in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <AuthForm mode="login" />
            </TabsContent>
            <TabsContent value="signup">
              <AuthForm mode="signup" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  )
}
