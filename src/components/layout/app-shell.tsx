import type { ReactNode } from "react"
import { BottomNav } from "./bottom-nav"

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="mx-auto flex h-14 max-w-md items-center px-4 font-semibold">ShiftSwap</div>
      </header>
      <main className="mx-auto w-full max-w-md flex-1 px-4 pt-4 pb-24">{children}</main>
      <BottomNav />
    </>
  )
}
