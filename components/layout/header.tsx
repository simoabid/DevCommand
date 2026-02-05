"use client"

import { MobileSidebar } from "@/components/layout/mobile-sidebar"
import { ModeToggle } from "@/components/layout/theme-toggle"
import { UserMenu } from "@/components/layout/user-menu"
import { TimerWidget } from "@/components/finance/timer-widget"
import { usePathname } from "next/navigation"

export function Header() {
  const pathname = usePathname()
  
  // Simple breadcrumb logic
  const formattedPath = pathname.split('/').filter(Boolean).map(segment => 
    segment.charAt(0).toUpperCase() + segment.slice(1)
  ).join(' > ')

  return (
    <header className="flex items-center p-4 border-b h-16 bg-background">
      <MobileSidebar />
      <div className="flex items-center ml-4 md:ml-0 font-semibold text-lg">
        {formattedPath || 'Home'}
      </div>
      <div className="ml-auto flex items-center gap-x-4">
        <TimerWidget />
        <ModeToggle />
        <UserMenu />
      </div>
    </header>
  )
}
