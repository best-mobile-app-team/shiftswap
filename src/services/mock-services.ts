
import type { Services } from "./container"
import type { AuthUser } from "./auth/auth-service"
import type { User, Shift } from "@/types/models"

export function createMockServices() {
  const workplaceId = "demo-workplace"

  const demoUser: User = {
    id: "demo-user",
    email: "demo@example.com",
    displayName: "Demo User",
    workplaceId,
    role: "Server",
    isManager: false,
  }

  const users = new Map<string, User>([
    [demoUser.id, demoUser],
    [
      "maria",
      {
        ...demoUser,
        id: "maria",
        displayName: "Maria",
        email: "maria@example.com",
      },
    ],
    [
      "alex",
      {
        ...demoUser,
        id: "alex",
        displayName: "Alex",
        email: "alex@example.com",
        role: "Barista",
      },
    ],
    [
      "jordan",
      {
        ...demoUser,
        id: "jordan",
        displayName: "Jordan",
        email: "jordan@example.com",
        role: "Host",
      },
    ],
  ])

  let currentUser: AuthUser | null = {
    id: demoUser.id,
    email: demoUser.email,
  }

  const listeners = new Set<
    (user: AuthUser | null) => void
  >()

  function notifyListeners() {
    listeners.forEach((listener) =>
      listener(currentUser),
    )
  }

  function createDemoShift(
    id: string,
    daysFromToday: number,
    startHour: number,
    endHour: number,
    role: string,
    postedBy: string,
    note: string,
    status: Shift["status"] = "open",
    claimedBy: string | null = null,
  ): Shift {
    const date = new Date()
    date.setDate(date.getDate() + daysFromToday)
    date.setHours(0, 0, 0, 0)

    const startTime = new Date(date)
    startTime.setHours(startHour)

    const endTime = new Date(date)
    endTime.setHours(endHour)

    return {
      id,
      workplaceId,
      postedBy,
      date,
      startTime,
      endTime,
      role,
      note,
      status,
      claimedBy,
    }
  }

  const shifts: Shift[] = [
    createDemoShift(
      "shift-1", 1, 16, 22,
      "Server", "maria",
      "Need coverage for my evening shift.",
    ),
    createDemoShift(
      "shift-2", 2, 9, 15,
      "Barista", "alex",
      "I have an appointment that morning.",
    ),
    createDemoShift(
      "shift-3", 3, 12, 18,
      "Host", "jordan",
      "Family commitment.",
    ),
    createDemoShift(
      "shift-4", 3, 17, 23,
      "Server", "maria",
      "Looking for someone to cover dinner.",
    ),
    createDemoShift(
      "shift-5", 4, 16, 22,
      "Bartender", "alex",
      "Unable to work this evening.",
    ),
    createDemoShift(
      "shift-6", 5, 11, 17,
      "Server", "jordan",
      "Need someone to cover my lunch shift.",
    ),
    createDemoShift(
      "shift-7", 6, 16, 22,
      "Server", demoUser.id,
      "My posted shift.",
    ),
    createDemoShift(
      "shift-8", 7, 12, 18,
      "Host", "jordan",
      "Waiting for manager approval.",
      "claimed", demoUser.id,
    ),
  ]

  const notices: { userId: string; message: string }[] = []
  const preferences = new Map<string, boolean>()
  const passwords = new Map<string, string>([[demoUser.email, "demo123"], ["manager@example.com", "demo123"]])
  users.set("manager", { ...demoUser, id: "manager", email: "manager@example.com", displayName: "Demo Manager", role: "Manager", isManager: true })
  function actor() {
    const user = currentUser && users.get(currentUser.id)
    if (!user) throw new Error("Please sign in.")
    return user
  }
  function alert(userId: string, message: string) {
    if (preferences.get(userId) !== false) notices.push({ userId, message })
  }
  function findShift(id: string) {
    const user = actor()
    const shift = shifts.find(s => s.id === id && s.workplaceId === user.workplaceId)
    if (!shift) throw new Error("Shift not found.")
    return shift
  }
  const base: Services = {
    auth: {
      async signUp(email, password) {
        email = email.trim().toLowerCase()
        if (passwords.has(email)) throw new Error("Account already exists.")
        const id = crypto.randomUUID()
        passwords.set(email, password)
        users.set(id, { id, email, displayName: email.split("@")[0], workplaceId: "", role: "", isManager: false })
        currentUser = { id, email }
        notifyListeners()
        return currentUser
      },
      async signIn(email, password) {
        email = email.trim().toLowerCase()
        const user = [...users.values()].find(u => u.email === email)
        if (!user || passwords.get(email) !== password) throw new Error("Invalid demo credentials.")
        currentUser = { id: user.id, email }
        notifyListeners()
        return currentUser
      },

      async signOut() {
        currentUser = null
        notifyListeners()
      },

      onChange(listener) {
        listeners.add(listener)
        listener(currentUser)

        return () => {
          listeners.delete(listener)
        }
      },
    },

    users: {
      async get(id) {
        return users.get(id) ?? null
      },

      async create(user) {
        users.set(user.id, user)
      },
    },

    shifts: {
      async create(shift) {
        const user = actor()
        if (!user.workplaceId || shift.workplaceId !== user.workplaceId || shift.postedBy !== user.id) throw new Error("Invalid workplace or poster.")
        const id = crypto.randomUUID()

        shifts.push({
          ...shift,
          id,
        })

        for (const user of users.values()) {
          if (user.workplaceId === shift.workplaceId && user.id !== shift.postedBy) alert(user.id, `New ${shift.role} shift available.`)
        }
        return id
      },

      async listOpen(id) {
        if (!actor().workplaceId || actor().workplaceId !== id) return []
        return shifts.filter(
          (shift) =>
            shift.workplaceId === id &&
            shift.status === "open",
        )
      },

      async listPostedBy(id, userId) {
        if (!actor().workplaceId || actor().workplaceId !== id) return []
        return shifts.filter(
          (shift) =>
            shift.workplaceId === id &&
            shift.postedBy === userId,
        )
      },

      async listClaimedBy(id, userId) {
        if (!actor().workplaceId || actor().workplaceId !== id) return []
        return shifts.filter(
          (shift) =>
            shift.workplaceId === id &&
            shift.claimedBy === userId,
        )
      },
    },
  }
  return Object.assign(base, { demo: {
    join(code: string, role: string) {
      const user = actor()
      if (user.workplaceId) throw new Error("You already belong to a workplace.")
      if (code.trim().toUpperCase() !== "TEST123") throw new Error("Invalid invite code.")
      if (!role.trim()) throw new Error("Choose a role.")
      users.set(user.id, { ...user, workplaceId, role: role.trim() })
      notifyListeners()
    },
    getShift(id: string) { return { ...findShift(id) } },
    claim(id: string) {
      const user = actor(), shift = findShift(id)
      if (shift.status !== "open" || shift.postedBy === user.id || shift.startTime <= new Date()) throw new Error("This shift cannot be claimed.")
      shift.status = "claimed"; shift.claimedBy = user.id
      alert(shift.postedBy, "Your shift has been claimed.")
    },
    decide(id: string, decision: "approved" | "declined") {
      const user = actor(), shift = findShift(id)
      if (!user.isManager || shift.status !== "claimed" || !shift.claimedBy) throw new Error("Only managers can decide pending claims.")
      shift.status = decision
      alert(shift.claimedBy, `Your shift claim was ${decision}.`)
    },
    pending() { const user = actor(); return user.isManager ? shifts.filter(s => s.workplaceId === user.workplaceId && s.status === "claimed").map(s => ({...s})) : [] },
    notifications() { return notices.filter(n => n.userId === actor().id).map(n => n.message) },
    notificationsEnabled() { return preferences.get(actor().id) !== false },
    setNotifications(enabled: boolean) { preferences.set(actor().id, enabled) },
    workplaceName() { return actor().workplaceId === workplaceId ? "Test Cafe" : "Not joined" },
  } })
}
export type MockServices = ReturnType<typeof createMockServices>
export function getDemo(services: Services): MockServices["demo"] | undefined {
  return "demo" in services ? (services as MockServices).demo : undefined
}
