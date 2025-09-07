"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/mobile-nav"
import { clearCurrentUser, getCurrentUser } from "@/lib/auth"
import { getFacultySections, getCourses } from "@/lib/api"
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

// Interface for faculty courses in sidebar
interface FacultyCourse {
  id: string
  code: string
  name: string
  section: string
}

export function FacultySidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [classesExpanded, setClassesExpanded] = useState(true)
  const [facultyCourses, setFacultyCourses] = useState<FacultyCourse[]>([])
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()

  // Fetch faculty courses on mount
  useEffect(() => {
    const fetchFacultyCourses = async () => {
      try {
        const user = getCurrentUser()
        if (!user) {
          setLoading(false)
          return
        }

        // Fetch faculty sections and all courses
        const [facultySections, allCourses] = await Promise.all([
          getFacultySections(user.user_id),
          getCourses()
        ])

        // Create a map of course codes to course names
        const courseMap = new Map(allCourses.map(course => [course.course_code, course.course_name]))

        // Create faculty courses list
        const courses: FacultyCourse[] = facultySections.map(section => ({
          id: `${section.course_code}-${section.sec_number}`,
          code: section.course_code,
          name: courseMap.get(section.course_code) || section.course_code,
          section: section.sec_number.toString()
        }))

        setFacultyCourses(courses)
      } catch (err) {
        console.error('Failed to fetch faculty courses:', err)
        setFacultyCourses([])
      } finally {
        setLoading(false)
      }
    }

    fetchFacultyCourses()
  }, [])

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

          <div className="space-y-1">
            <Button
              variant="ghost"
              onClick={() => setClassesExpanded(!classesExpanded)}
              className={cn(
                "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                collapsed && "px-2",
              )}
            >
              <Users className={cn("h-4 w-4", !collapsed && "mr-2")} />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">Classes</span>
                  {classesExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </>
              )}
            </Button>

            {classesExpanded && !collapsed && (
              <div className="ml-4 space-y-1">
                {loading ? (
                  <div className="flex items-center justify-center py-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-sidebar-primary"></div>
                  </div>
                ) : facultyCourses.length === 0 ? (
                  <div className="text-center py-2">
                    <p className="text-xs text-sidebar-muted-foreground">No courses</p>
                  </div>
                ) : (
                  facultyCourses.map((course) => {
                    const courseKey = `${course.code}-${course.section}`
                    const isActive = pathname.includes("/faculty/classes") && pathname.includes(courseKey.toLowerCase())

                    return (
                      <Link key={course.id} href={`/faculty/classes?course=${course.code}&section=${course.section}`}>
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
                            <span className="font-medium">{course.code} ({course.section})</span>
                            <span className="text-xs opacity-75 truncate max-w-[140px]">
                              {course.name}
                            </span>
                          </div>
                        </Button>
                      </Link>
                    )
                  })
                )}
              </div>
            )}
          </div>


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
