// Dev-only: puts a test user into a test workplace so Post Shift can be tried
// before the Join Workplace flow (#7) exists.
//
// Usage: npm run seed -- <email> [password] [--manager]
// Needs a Firebase service-account key at ./service-account.json
// (or a path in FIREBASE_SERVICE_ACCOUNT). Never commit that file.

import { existsSync, readFileSync } from "node:fs"
import { cert, initializeApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

const WORKPLACE_ID = "test-workplace"
const WORKPLACE = { name: "Test Cafe", inviteCode: "TEST123" }
const DEFAULT_ROLE = "Barista"
const DEFAULT_PASSWORD = "password123"

const args = process.argv.slice(2)
const isManager = args.includes("--manager")
const [email, password = DEFAULT_PASSWORD] = args.filter((arg) => !arg.startsWith("--"))

if (!email) {
  console.error("Usage: npm run seed -- <email> [password] [--manager]")
  process.exit(1)
}

const keyPath = process.env.FIREBASE_SERVICE_ACCOUNT ?? "service-account.json"
if (!existsSync(keyPath)) {
  console.error(
    `No service-account key at ${keyPath}.\n` +
      "Firebase console → Project settings → Service accounts → Generate new private key,\n" +
      "then save it as service-account.json in the project root.",
  )
  process.exit(1)
}

initializeApp({ credential: cert(JSON.parse(readFileSync(keyPath, "utf8"))) })
const auth = getAuth()
const db = getFirestore()

async function findOrCreateUser() {
  try {
    return { user: await auth.getUserByEmail(email), created: false }
  } catch (error) {
    if ((error as { code?: string }).code !== "auth/user-not-found") throw error
    return { user: await auth.createUser({ email, password }), created: true }
  }
}

const { user, created } = await findOrCreateUser()

await db.doc(`workplaces/${WORKPLACE_ID}`).set(WORKPLACE, { merge: true })

const profileRef = db.doc(`users/${user.uid}`)
const existing = (await profileRef.get()).data()
await profileRef.set(
  {
    email,
    displayName: existing?.displayName ?? "",
    role: existing?.role || DEFAULT_ROLE,
    workplaceId: WORKPLACE_ID,
    isManager,
  },
  { merge: true },
)

console.log(`✓ Workplace "${WORKPLACE.name}" (${WORKPLACE_ID}, invite code ${WORKPLACE.inviteCode})`)
console.log(
  created
    ? `✓ Created user ${email} with password "${password}"`
    : `✓ Found existing user ${email} (password unchanged)`,
)
console.log(`✓ ${email} is in ${WORKPLACE_ID}${isManager ? " as a manager" : ""}`)
console.log("Reload the app (or log in) and open the Post tab.")
