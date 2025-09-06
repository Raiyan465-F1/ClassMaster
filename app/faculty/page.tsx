"use client"

import { useState, useEffect } from "react"
import { FacultySidebar } from "@/components/faculty-sidebar"
import { DashboardCard } from "@/components/dashboard-card"
import { TodoDialog } from "@/components/todo-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckSquare, Calendar, BookOpen, Clock, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getFacultyDashboard, type FacultyDashboard, type FacultyDashboardTask, type FacultyTask } from "@/lib/api"

// Utility functions
const formatTime = (timeString: string) => {
  const [hours, minutes] = timeString.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'No due date'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
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

export default function FacultyDashboard() {
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<FacultyDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const user = getCurrentUser()
        if (!user) {
          setError('User not authenticated')
          return
        }

        const data = await getFacultyDashboard(user.user_id)
        setDashboardData(data)
      } catch (err) {
        console.error('Failed to fetch faculty dashboard:', err)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const handleAddTask = (task: FacultyTask) => {
    console.log("[v0] New faculty task added:", task)
    // Convert FacultyTask to FacultyDashboardTask format
    const dashboardTask: FacultyDashboardTask = {
      todo_id: task.todo_id,
      title: task.title,
      status: task.status,
      due_date: task.due_date,
      due_date_display: null,
      related_announcement_id: task.related_announcement_id,
      announcement_title: task.announcement_title,
      announcement_content: task.announcement_content,
      announcement_type: task.announcement_type,
      announcement_deadline: task.announcement_deadline,
      course_code: task.course_code,
      section_number: task.section_number
    }
    
    // Refresh dashboard data after adding a task
    if (dashboardData) {
      setDashboardData({
        ...dashboardData,
        pending_tasks: [dashboardTask, ...dashboardData.pending_tasks]
      })
    }
  }

  const handleViewActivity = () => {
    router.push("/faculty/announcements")
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <FacultySidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
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

  if (error || !dashboardData) {
    return (
      <div className="flex h-screen bg-background">
        <FacultySidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-destructive mb-4">{error || 'Failed to load dashboard'}</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <FacultySidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Faculty Dashboard</h1>
              <p className="text-muted-foreground">Welcome back! Here's your teaching overview.</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-chart-1 border-chart-1">
                Spring 2024
              </Badge>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card p-4 rounded-lg border">
              <div className="flex items-center space-x-2">
                <CheckSquare className="h-5 w-5 text-chart-1" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{dashboardData?.pending_tasks?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Pending Tasks</p>
                </div>
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-chart-2" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{dashboardData?.courses_teaching?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Courses Teaching</p>
                </div>
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-chart-4" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{dashboardData?.total_students || 0}</p>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Faculty Tasks */}
            <DashboardCard
              title="My Tasks"
              description="Upcoming grading and teaching tasks"
              icon={CheckSquare}
              className="lg:row-span-2"
            >
              <div className="space-y-3">
                {dashboardData?.pending_tasks && dashboardData.pending_tasks.length > 0 ? (
                  dashboardData.pending_tasks.map((task) => (
                    <div key={task.todo_id} className="p-3 rounded-lg border">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium text-foreground text-sm">{task.title}</p>
                        <Badge
                          className={
                            task.status === "completed"
                              ? "bg-chart-4 text-background"
                              : task.status === "delayed"
                                ? "bg-chart-3 text-background"
                                : "bg-chart-1 text-background"
                          }
                        >
                          {task.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{task.course_code ? `${task.course_code}-${task.section_number}` : 'General'}</span>
                        <span>Due: {task.due_date ? formatDate(task.due_date) : 'None'}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No pending tasks</p>
                    <p className="text-sm">You're all caught up!</p>
                  </div>
                )}
                <TodoDialog onAddTodo={handleAddTask} userRole="faculty" />
              </div>
            </DashboardCard>

            {/* Today's Classes */}
            <DashboardCard title="Today's Classes" description="Your teaching schedule for today" icon={Calendar}>
              <div className="space-y-3">
                {dashboardData?.todays_schedule && dashboardData.todays_schedule.length > 0 ? (
                  dashboardData.todays_schedule.map((classItem, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">{classItem.course_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Section {classItem.sec_number} • {classItem.location}
                        </p>
                      </div>
                      <Badge variant="outline">{formatTime(classItem.start_time)}</Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No classes today</p>
                    <p className="text-sm">Enjoy your free time!</p>
                  </div>
                )}
              </div>
            </DashboardCard>

            {/* Recent Announcements */}
            <DashboardCard title="Recent Announcements" description="Latest announcements from your courses" icon={Clock}>
              <div className="space-y-3">
                {dashboardData?.todays_announcements && dashboardData.todays_announcements.length > 0 ? (
                  dashboardData.todays_announcements.map((announcement, index) => (
                    <div key={index} className="p-3 bg-muted/50 rounded-lg">
                      <p className="font-medium text-foreground text-sm">{announcement.title}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-muted-foreground">{announcement.section_course_code}-{announcement.section_sec_number}</p>
                        <p className="text-xs text-muted-foreground">{getTimeAgo(announcement.created_at)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No recent announcements</p>
                    <p className="text-sm">Check back later for updates</p>
                  </div>
                )}
                <Button variant="outline" className="w-full mt-4 bg-transparent" onClick={handleViewActivity}>
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
