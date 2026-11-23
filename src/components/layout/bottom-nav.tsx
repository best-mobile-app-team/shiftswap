"use client"

import { CalendarDaysIcon, HomeIcon, PlusCircleIcon, UserIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const tabs = [
  { href: "/feed", label: "Feed", icon: HomeIcon },
  { href: "/post", label: "Post", icon: PlusCircleIcon },
  { href: "/my-shifts", label: "My Shifts", icon: CalendarDaysIcon },
  { href: "/profile", label: "Profile", icon: UserIcon },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 border-t bg-background pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto grid max-w-md grid-cols-4">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 py-2 text-xs text-muted-foreground",
                  active && "text-foreground",
                )}
              >
                <Icon className="size-5" />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
