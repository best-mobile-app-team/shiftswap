"use client"

import { useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authErrorMessage } from "@/features/auth/errors"
import { credentialsSchema } from "@/features/auth/schema"
import { homePathFor, signIn, signUp } from "@/features/auth/session"
import { useServices } from "@/providers/services-provider"

type Mode = "login" | "signup"
type Errors = Partial<Record<"email" | "password" | "form", string>>

export function AuthForm({ mode }: { mode: Mode }) {
  const services = useServices()
  const router = useRouter()
  const [errors, setErrors] = useState<Errors>({})
  const [pending, setPending] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const parsed = credentialsSchema.safeParse({
      email: form.get("email") ?? "",
      password: form.get("password") ?? "",
    })

    if (!parsed.success) {
      const next: Errors = {}
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as "email" | "password"
        next[field] ??= issue.message
      }
      setErrors(next)
      return
    }

    setErrors({})
    setPending(true)
    try {
      const user = mode === "signup" ? await signUp(services, parsed.data) : await signIn(services, parsed.data)
      router.replace(homePathFor(user))
    } catch (error) {
      setErrors({ form: authErrorMessage(error) })
      setPending(false)
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor={`${mode}-email`}>Email</FieldLabel>
          <Input
            id={`${mode}-email`}
            name="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
          />
          <FieldError>{errors.email}</FieldError>
        </Field>
        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor={`${mode}-password`}>Password</FieldLabel>
          <Input
            id={`${mode}-password`}
            name="password"
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            aria-invalid={!!errors.password}
          />
          <FieldError>{errors.password}</FieldError>
        </Field>
        {errors.form && <p role="alert" className="text-sm text-destructive">{errors.form}</p>}
        <Button type="submit" disabled={pending}>
          {mode === "signup" ? "Sign up" : "Log in"}
        </Button>
      </FieldGroup>
    </form>
  )
}
