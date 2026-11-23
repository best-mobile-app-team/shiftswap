import { describe, expect, it, vi } from "vitest"
import type { AuthService } from "@/services/auth/auth-service"
import type { User } from "@/types/models"
import { authErrorMessage } from "./errors"
import { credentialsSchema } from "./schema"
import { homePathFor, signIn, signUp } from "./session"

const authUser = { id: "u1", email: "a@b.com" }
const profile: User = { ...authUser, displayName: "", workplaceId: "w1", role: "", isManager: false }

function fakeAuth(): AuthService {
  return {
    signUp: vi.fn().mockResolvedValue(authUser),
    signIn: vi.fn().mockResolvedValue(authUser),
    signOut: vi.fn(),
    onChange: vi.fn(),
  }
}

describe("session", () => {
  it("creates a profile on sign up", async () => {
    const users = { get: vi.fn().mockResolvedValue(null), create: vi.fn() }
    const user = await signUp({ auth: fakeAuth(), users }, { email: "a@b.com", password: "secret1" })
    expect(user).toMatchObject({ id: "u1", workplaceId: "", isManager: false })
    expect(users.create).toHaveBeenCalledWith(user)
  })

  it("returns the existing profile on sign in", async () => {
    const users = { get: vi.fn().mockResolvedValue(profile), create: vi.fn() }
    await expect(signIn({ auth: fakeAuth(), users }, { email: "a@b.com", password: "secret1" })).resolves.toBe(profile)
    expect(users.create).not.toHaveBeenCalled()
  })

  it("routes users without a workplace to join", () => {
    expect(homePathFor(profile)).toBe("/feed")
    expect(homePathFor({ ...profile, workplaceId: "" })).toBe("/join")
  })
})

describe("credentialsSchema", () => {
  it("trims email and enforces password length", () => {
    expect(credentialsSchema.parse({ email: " a@b.com ", password: "secret1" }).email).toBe("a@b.com")
    expect(credentialsSchema.safeParse({ email: "nope", password: "123" }).success).toBe(false)
  })
})

describe("authErrorMessage", () => {
  it("maps known codes and hides unknown ones", () => {
    expect(authErrorMessage({ code: "auth/invalid-credential" })).toBe("Incorrect email or password.")
    expect(authErrorMessage(new Error("internal"))).toBe("Something went wrong. Try again.")
  })
})
