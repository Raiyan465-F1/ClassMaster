"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/mobile-nav"
import { clearCurrentUser, getCurrentUser } from "@/lib/auth"
import { getStudentSections, getSections, getCourses, type StudentSection, type Section, type Course } from "@/lib/api/courses"
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
  GraduationCap,
  Trophy,
  User,
  AlertCircle,
} from "lucide-react"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/student",
    icon: LayoutDashboard,
  },
  {
    title: "Course Registration",
    href: "/student/select-courses",
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
  {
    title: "Leaderboard",
    href: "/student/leaderboard",
    icon: Trophy,
  },
]

// Interface for course data with instructor info
interface CourseWithInstructor {
  id: string
  code: string
  name: string
  section: string
}

export function StudentSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [classesExpanded, setClassesExpanded] = useState(true)
  const [studentCourses, setStudentCourses] = useState<CourseWithInstructor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        setError(null)

        const user = getCurrentUser()
        if (!user) {
          setError('User not authenticated')
          return
        }

        // Fetch student's enrolled sections
        const studentSections = await getStudentSections(user.user_id)
        
        // Fetch all courses to get course names
        const allCourses = await getCourses()
        
        // Create course list
        const courseList: CourseWithInstructor[] = studentSections.map((studentSection) => {
          const courseInfo = allCourses.find(c => c.course_code === studentSection.course_code)
          
          return {
            id: `${studentSection.course_code}-${studentSection.sec_number}`,
            code: studentSection.course_code,
            name: courseInfo?.course_name || studentSection.course_code,
            section: String(studentSection.sec_number)
          }
        })

        setStudentCourses(courseList)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load courses')
        console.error('Error fetching courses:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const handleSignOut = () => {
    clearCurrentUser()
    // No need to navigate, the Link component will handle the navigation
  }

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
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
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
              <BookOpen className={cn("h-4 w-4", !collapsed && "mr-2")} />
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
                    <span className="ml-2 text-xs text-sidebar-muted-foreground">Loading...</span>
                  </div>
                ) : error ? (
                  <div className="flex items-center py-2 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    <span>Failed to load courses</span>
                  </div>
                ) : studentCourses.length === 0 ? (
                  <div className="text-xs text-sidebar-muted-foreground py-2">
                    No enrolled courses
                  </div>
                ) : (
                  studentCourses.map((course) => {
                    const courseKey = `${course.code}-${course.section}`
                    const isActive = pathname.includes("/student/classes") && pathname.includes(courseKey.toLowerCase())

                    return (
                      <Link key={course.id} href={`/student/classes?course=${courseKey}`}>
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
                            <span className="font-medium">{course.code}</span>
                            <span className="text-xs opacity-75 truncate max-w-[140px]">
                              {course.name} (Sec {course.section})
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
          <Link href="/student/profile">
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
