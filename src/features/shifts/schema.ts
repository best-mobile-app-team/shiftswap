import { z } from "zod"

const time = (error: string) =>
  z
    .string()
    .regex(/^\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?$/, { error })
    .transform((value) => value.slice(0, 5))

export const postShiftSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { error: "Pick a date." }),
  startTime: time("Pick a start time."),
  endTime: time("Pick an end time."),
  role: z
    .string()
    .trim()
    .min(1, { error: "Enter the role needed." })
    .max(50, { error: "Role must be 50 characters or fewer." }),
  note: z.string().trim().max(500, { error: "Note must be 500 characters or fewer." }),
})

export type PostShiftInput = z.input<typeof postShiftSchema>
export type PostShiftField = keyof PostShiftInput
