import { RequireAuth } from "@/components/auth/require-auth"

export default function OnboardingLayout({ children }: LayoutProps<"/">) {
  return (
    <RequireAuth>
      <main className="mx-auto w-full max-w-md flex-1 px-4 py-12">{children}</main>
    </RequireAuth>
  )
}
