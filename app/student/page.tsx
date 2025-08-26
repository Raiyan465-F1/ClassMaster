"use client"

import { StudentSidebar } from "@/components/student-sidebar"
import { DashboardCard } from "@/components/dashboard-card"
import { TodoItem } from "@/components/todo-item"
import { TodoDialog } from "@/components/todo-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckSquare, Calendar, Megaphone, Clock, BookOpen } from "lucide-react"
import { useRouter } from "next/navigation"

// Mock data - in real app this would come from API
const mockTodos = [
  {
    id: "1",
    title: "Complete Database Assignment",
    status: "pending" as const,
    dueDate: "2024-01-15",
    type: "assignment" as const,
  },
  {
    id: "2",
    title: "Prepare for Data Structures Quiz",
    status: "delayed" as const,
    dueDate: "2024-01-12",
    type: "quiz" as const,
  },
  {
    id: "3",
    title: "Submit Lab Report",
    status: "completed" as const,
    dueDate: "2024-01-10",
    type: "assignment" as const,
  },
]

const mockSchedule = [
  { time: "09:00 AM", course: "Database Systems", room: "Room 101" },
  { time: "11:00 AM", course: "Data Structures", room: "Room 205" },
  { time: "02:00 PM", course: "Software Engineering", room: "Room 301" },
]

const mockAnnouncements = [
  { title: "Quiz postponed to next week", course: "Database Systems", time: "2 hours ago" },
  { title: "New assignment uploaded", course: "Data Structures", time: "1 day ago" },
  { title: "Lab session rescheduled", course: "Software Engineering", time: "2 days ago" },
]

export default function StudentDashboard() {
  const router = useRouter()

  const handleAddTodo = (todo: any) => {
    console.log("New todo added:", todo)
    // In real app, this would call an API to save the todo
  }

  const handleViewAnnouncements = () => {
    router.push("/student/announcements")
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
                  <p className="text-lg md:text-2xl font-bold text-foreground">5</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Pending Tasks</p>
                </div>
              </div>
            </div>
            <div className="bg-card p-3 md:p-4 rounded-lg border">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 md:h-5 md:w-5 text-chart-2" />
                <div>
                  <p className="text-lg md:text-2xl font-bold text-foreground">6</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Enrolled Courses</p>
                </div>
              </div>
            </div>
            <div className="bg-card p-3 md:p-4 rounded-lg border">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 md:h-5 md:w-5 text-chart-4" />
                <div>
                  <p className="text-lg md:text-2xl font-bold text-foreground">3.7</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Current GPA</p>
                </div>
              </div>
            </div>
            <div className="bg-card p-3 md:p-4 rounded-lg border">
              <div className="flex items-center space-x-2">
                <Megaphone className="h-4 w-4 md:h-5 md:w-5 text-chart-3" />
                <div>
                  <p className="text-lg md:text-2xl font-bold text-foreground">12</p>
                  <p className="text-xs md:text-sm text-muted-foreground">New Announcements</p>
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
                {mockTodos.map((todo) => (
                  <TodoItem key={todo.id} {...todo} />
                ))}
                <TodoDialog onAddTodo={handleAddTodo} />
              </div>
            </DashboardCard>

            {/* Today's Schedule */}
            <DashboardCard title="Today's Schedule" description="Your classes for today" icon={Calendar}>
              <div className="space-y-3">
                {mockSchedule.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{item.course}</p>
                      <p className="text-sm text-muted-foreground">{item.room}</p>
                    </div>
                    <Badge variant="outline">{item.time}</Badge>
                  </div>
                ))}
              </div>
            </DashboardCard>

            {/* Recent Announcements */}
            <DashboardCard title="Recent Announcements" description="Latest updates from your courses" icon={Megaphone}>
              <div className="space-y-3">
                {mockAnnouncements.map((announcement, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium text-foreground text-sm">{announcement.title}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-muted-foreground">{announcement.course}</p>
                      <p className="text-xs text-muted-foreground">{announcement.time}</p>
                    </div>
                  </div>
                ))}
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
