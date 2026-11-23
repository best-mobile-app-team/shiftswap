import { z } from "zod"

export const credentialsSchema = z.object({
  email: z.string().trim().pipe(z.email({ error: "Enter a valid email." })),
  password: z.string().min(6, { error: "Password must be at least 6 characters." }),
})

export type Credentials = z.output<typeof credentialsSchema>
