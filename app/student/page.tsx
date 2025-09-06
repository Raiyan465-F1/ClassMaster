"use client"

import { StudentSidebar } from "@/components/student-sidebar"
import { DashboardCard } from "@/components/dashboard-card"
import { TodoItem } from "@/components/todo-item"
import { TodoDialog } from "@/components/todo-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckSquare, Calendar, Megaphone, Clock, BookOpen, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { getStudentDashboard, type StudentDashboard, type DashboardTask, type DashboardCourse, type DashboardAnnouncement } from "@/lib/api"
import { getCurrentUser } from "@/lib/auth"

export default function StudentDashboard() {
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<StudentDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const user = getCurrentUser()
        if (!user) {
          setError('User not authenticated')
          return
        }

        const data = await getStudentDashboard(user.user_id)
        setDashboardData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard')
        console.error('Error fetching dashboard:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const handleAddTodo = (todo: any) => {
    console.log("[v0] New todo added:", todo)
    // In real app, this would call an API to save the todo
  }

  const handleViewAnnouncements = () => {
    router.push("/student/announcements")
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  }

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row h-screen bg-background">
        <StudentSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 space-y-4 md:space-y-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading dashboard...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col md:flex-row h-screen bg-background">
        <StudentSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 space-y-4 md:space-y-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Error Loading Dashboard</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!dashboardData) {
    return null
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background">
      <StudentSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back! Here's your academic overview.</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-chart-1 border-chart-1">
                Spring 2024
              </Badge>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-card p-3 md:p-4 rounded-lg border">
              <div className="flex items-center space-x-2">
                <CheckSquare className="h-4 w-4 md:h-5 md:w-5 text-chart-1" />
                <div>
                  <p className="text-lg md:text-2xl font-bold text-foreground">{dashboardData.pending_tasks.length}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Pending Tasks</p>
                </div>
              </div>
            </div>
            <div className="bg-card p-3 md:p-4 rounded-lg border">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 md:h-5 md:w-5 text-chart-2" />
                <div>
                  <p className="text-lg md:text-2xl font-bold text-foreground">{dashboardData.enrolled_courses.length}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Enrolled Courses</p>
                </div>
              </div>
            </div>
            <div className="bg-card p-3 md:p-4 rounded-lg border">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 md:h-5 md:w-5 text-chart-4" />
                <div>
                  <p className="text-lg md:text-2xl font-bold text-foreground">{dashboardData.tasks_due_tomorrow.length}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Due Tomorrow</p>
                </div>
              </div>
            </div>
            <div className="bg-card p-3 md:p-4 rounded-lg border">
              <div className="flex items-center space-x-2">
                <Megaphone className="h-4 w-4 md:h-5 md:w-5 text-chart-3" />
                <div>
                  <p className="text-lg md:text-2xl font-bold text-foreground">{dashboardData.announcements_count_today}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Today's Announcements</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Todos */}
            <DashboardCard
              title="Recent Tasks"
              description="Your upcoming assignments and quizzes"
              icon={CheckSquare}
              className="lg:row-span-2"
            >
              <div className="space-y-3">
                {dashboardData.pending_tasks.map((task) => (
                  <div key={task.todo_id} className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-foreground text-sm">{task.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {task.status}
                          </Badge>
                          {task.course_code && (
                            <Badge variant="secondary" className="text-xs">
                              {task.course_code}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Due: {task.due_date ? formatDate(task.due_date) : 'None'}
                        </p>
                        {task.announcement_title && (
                          <p className="text-xs text-muted-foreground mt-1">
                            From: {task.announcement_title}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {dashboardData.tasks_due_tomorrow.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-foreground mb-2">Due Tomorrow</h4>
                    {dashboardData.tasks_due_tomorrow.map((task) => (
                      <div key={task.todo_id} className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-foreground text-sm">{task.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs bg-orange-100 dark:bg-orange-900/30">
                                {task.status}
                              </Badge>
                              {task.course_code && (
                                <Badge variant="secondary" className="text-xs">
                                  {task.course_code}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Due: {task.due_date ? formatDate(task.due_date) : 'None'}
                            </p>
                            {task.announcement_title && (
                              <p className="text-xs text-muted-foreground mt-1">
                                From: {task.announcement_title}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <TodoDialog onAddTodo={handleAddTodo} userRole="student" />
              </div>
            </DashboardCard>

            {/* Today's Schedule */}
            <DashboardCard title="Today's Schedule" description="Your classes for today" icon={Calendar}>
              <div className="space-y-3">
                {dashboardData.todays_schedule.length > 0 ? (
                  dashboardData.todays_schedule.map((course, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">{course.course_name}</p>
                        <p className="text-sm text-muted-foreground">{course.location}</p>
                        <p className="text-xs text-muted-foreground">{course.course_code} - Section {course.sec_number}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{formatTime(course.start_time)}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTime(course.start_time)} - {formatTime(course.end_time)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No classes scheduled for today</p>
                  </div>
                )}
              </div>
            </DashboardCard>

            {/* Recent Announcements */}
            <DashboardCard title="Recent Announcements" description="Latest updates from your courses" icon={Megaphone}>
              <div className="space-y-3">
                {dashboardData.todays_announcements.length > 0 ? (
                  dashboardData.todays_announcements.map((announcement) => (
                    <div key={announcement.announcement_id} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-foreground text-sm">{announcement.title}</p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{announcement.content}</p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {announcement.section_course_code}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {announcement.type}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {getTimeAgo(announcement.created_at)}
                            </p>
                          </div>
                          {announcement.deadline && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Deadline: {formatDate(announcement.deadline)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <Megaphone className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No announcements for today</p>
                  </div>
                )}
                <Button variant="outline" className="w-full mt-4 bg-transparent" onClick={handleViewAnnouncements}>
                  View All Announcements
                </Button>
              </div>
            </DashboardCard>
          </div>
        </div>
      </main>
    </div>
  )
}
