import { SignOutButton } from "@/components/auth/sign-out-button"
import { PageHeader } from "@/components/layout/page-header"

export default function ProfilePage() {
  return <PageHeader title="Profile" action={<SignOutButton />} />
}
