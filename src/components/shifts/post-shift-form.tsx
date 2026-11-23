"use client"

import { useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { postShift, type PostShiftErrors } from "@/features/shifts/post-shift"
import type { PostShiftField } from "@/features/shifts/schema"
import { useServices } from "@/providers/services-provider"
import type { User } from "@/types/models"

export function PostShiftForm({ user }: { user: User }) {
  const { shifts } = useServices()
  const router = useRouter()
  const [errors, setErrors] = useState<PostShiftErrors>({})
  const [pending, setPending] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const value = (field: PostShiftField) => String(form.get(field) ?? "")

    setPending(true)
    try {
      const result = await postShift(
        shifts,
        {
          date: value("date"),
          startTime: value("startTime"),
          endTime: value("endTime"),
          role: value("role"),
          note: value("note"),
        },
        user,
      )
      if (!result.ok) {
        setErrors(result.errors)
        setPending(false)
        return
      }
      toast.success("Shift posted")
      router.push("/feed")
    } catch {
      setErrors({ form: "Could not post the shift. Try again." })
      setPending(false)
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.date}>
          <FieldLabel htmlFor="date">Date</FieldLabel>
          <Input id="date" name="date" type="date" aria-invalid={!!errors.date} />
          <FieldError>{errors.date}</FieldError>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field data-invalid={!!errors.startTime}>
            <FieldLabel htmlFor="startTime">Start time</FieldLabel>
            <Input id="startTime" name="startTime" type="time" aria-invalid={!!errors.startTime} />
            <FieldError>{errors.startTime}</FieldError>
          </Field>
          <Field data-invalid={!!errors.endTime}>
            <FieldLabel htmlFor="endTime">End time</FieldLabel>
            <Input id="endTime" name="endTime" type="time" aria-invalid={!!errors.endTime} />
            <FieldError>{errors.endTime}</FieldError>
          </Field>
        </div>
        <Field data-invalid={!!errors.role}>
          <FieldLabel htmlFor="role">Role</FieldLabel>
          <Input id="role" name="role" defaultValue={user.role} maxLength={50} aria-invalid={!!errors.role} />
          <FieldError>{errors.role}</FieldError>
        </Field>
        <Field data-invalid={!!errors.note}>
          <FieldLabel htmlFor="note">Note (optional)</FieldLabel>
          <Textarea id="note" name="note" maxLength={500} aria-invalid={!!errors.note} />
          <FieldError>{errors.note}</FieldError>
        </Field>
        {errors.form && <p role="alert" className="text-sm text-destructive">{errors.form}</p>}
        <Button type="submit" disabled={pending}>Post shift</Button>
      </FieldGroup>
    </form>
  )
}
