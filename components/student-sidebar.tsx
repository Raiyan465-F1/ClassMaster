"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/mobile-nav"
import {
  LayoutDashboard,
  BookOpen,
  Megaphone,
  Calendar,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from "lucide-react"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/student",
    icon: LayoutDashboard,
  },
  {
    title: "Classes",
    href: "/student/classes",
    icon: BookOpen,
  },
  {
    title: "Announcements",
    href: "/student/announcements",
    icon: Megaphone,
  },
  {
    title: "Schedule",
    href: "/student/schedule",
    icon: Calendar,
  },
  {
    title: "Todo",
    href: "/student/todo",
    icon: CheckSquare,
  },
]

export function StudentSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <div className="md:hidden bg-sidebar border-b border-sidebar-border p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-6 w-6 text-sidebar-primary" />
          <span className="font-semibold text-sidebar-foreground">Student Portal</span>
        </div>
        <MobileNav items={sidebarItems} title="Student Portal" icon={GraduationCap} />
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
              <GraduationCap className="h-6 w-6 text-sidebar-primary" />
              <span className="font-semibold text-sidebar-foreground">Student Portal</span>
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
        <div className="p-4 border-t border-sidebar-border">
          <Link href="/">
            <Button variant="outline" className={cn("w-full", collapsed && "px-2")}>
              {collapsed ? "←" : "← Back to Login"}
            </Button>
          </Link>
        </div>
      </div>
    </>
  )
}
