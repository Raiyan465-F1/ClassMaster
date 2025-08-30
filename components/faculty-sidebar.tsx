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
  ChevronDown,
  ChevronUp,
  Users,
  Trophy,
} from "lucide-react"

const mockFacultyCourses = [
  {
    code: "CSE201",
    name: "Database Systems",
    sections: ["A", "B"],
  },
  {
    code: "CSE301",
    name: "Data Structures",
    sections: ["A", "C"],
  },
  {
    code: "CSE401",
    name: "Software Engineering",
    sections: ["B", "C"],
  },
]

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/faculty",
    icon: LayoutDashboard,
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
  const [classesExpanded, setClassesExpanded] = useState(true)
  const pathname = usePathname()

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

          {!collapsed && (
            <div className="space-y-1">
              <Button
                variant="ghost"
                onClick={() => setClassesExpanded(!classesExpanded)}
                className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                <span className="flex-1 text-left">Classes</span>
                {classesExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>

              {classesExpanded && (
                <div className="ml-6 space-y-1">
                  {mockFacultyCourses.map((course) =>
                    course.sections.map((section) => {
                      const courseSection = `${course.code}; section ${section}`
                      const isActive =
                        pathname.includes("/faculty/classes") &&
                        pathname.includes(`course=${course.code}`) &&
                        pathname.includes(`section=${section}`)

                      return (
                        <Link
                          key={`${course.code}-${section}`}
                          href={`/faculty/classes?course=${course.code}&section=${section}`}
                        >
                          <Button
                            variant={isActive ? "default" : "ghost"}
                            size="sm"
                            className={cn(
                              "w-full justify-start text-xs",
                              isActive
                                ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                                : "text-sidebar-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                            )}
                          >
                            <div className="flex flex-col items-start">
                              <span className="font-medium">{courseSection}</span>
                              <span className="text-xs opacity-75">{course.name}</span>
                            </div>
                          </Button>
                        </Link>
                      )
                    }),
                  )}
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <Link href="/">
            <Button variant="outline" className={cn("w-full", collapsed && "px-2")}>
              {collapsed ? "←" : "← Sign Out"}
            </Button>
          </Link>
        </div>
      </div>
    </>
  )
}
