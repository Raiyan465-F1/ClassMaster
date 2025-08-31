"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/mobile-nav"
import { clearCurrentUser } from "@/lib/auth"
import {
  LayoutDashboard,
  BookOpen,
  Megaphone,
  Calendar,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Users,
  Trophy,
  User,
} from "lucide-react"



const sidebarItems = [
  {
    title: "Dashboard",
    href: "/faculty",
    icon: LayoutDashboard,
  },
  {
    title: "Select Courses",
    href: "/faculty/select-courses",
    icon: BookOpen,
  },
  {
    title: "Announcements",
    href: "/faculty/announcements",
    icon: Megaphone,
  },
  {
    title: "Tasks",
    href: "/faculty/tasks",
    icon: CheckSquare,
  },
  {
    title: "Schedule",
    href: "/faculty/schedule",
    icon: Calendar,
  },
  {
    title: "Leaderboard",
    href: "/faculty/leaderboard",
    icon: Trophy,
  },
]

export function FacultySidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  const handleSignOut = () => {
    clearCurrentUser()
  }

  return (
    <>
      <div className="md:hidden bg-sidebar border-b border-sidebar-border p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6 text-sidebar-primary" />
          <span className="font-semibold text-sidebar-foreground">Faculty Portal</span>
        </div>
        <MobileNav items={sidebarItems} title="Faculty Portal" icon={Users} />
      </div>

      <div
        className={cn(
          "hidden md:flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
          collapsed ? "w-16" : "w-64",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-sidebar-primary" />
              <span className="font-semibold text-sidebar-foreground">Faculty Portal</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    collapsed && "px-2",
                  )}
                >
                  <Icon className={cn("h-4 w-4", !collapsed && "mr-2")} />
                  {!collapsed && item.title}
                </Button>
              </Link>
            )
          })}


        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border space-y-2">
          <Link href="/faculty/profile">
            <Button variant="ghost" className={cn("w-full justify-start", collapsed && "px-2")}>
              <User className={cn("h-4 w-4", !collapsed && "mr-2")} />
              {!collapsed && "Profile"}
            </Button>
          </Link>
          <Link href="/" onClick={handleSignOut}>
            <Button variant="outline" className={cn("w-full", collapsed && "px-2")}>
              {collapsed ? "←" : "← Sign Out"}
            </Button>
          </Link>
        </div>
      </div>
    </>
  )
}
