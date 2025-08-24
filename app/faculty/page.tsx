"use client"

import { FacultySidebar } from "@/components/faculty-sidebar"
import { DashboardCard } from "@/components/dashboard-card"
import { TodoDialog } from "@/components/todo-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckSquare, Calendar, BookOpen, Clock, Users } from "lucide-react"
import { useRouter } from "next/navigation"

// Mock data for faculty dashboard
const mockFacultyTasks = [
  {
    id: "1",
    title: "Grade Quiz 2 - Database Systems",
    status: "pending",
    dueDate: "2024-01-16",
    course: "CSE201-B",
  },
  {
    id: "2",
    title: "Prepare Midterm Exam - Data Structures",
    status: "delayed",
    dueDate: "2024-01-14",
    course: "CSE301-A",
  },
  {
    id: "3",
    title: "Submit Final Grades - Software Engineering",
    status: "completed",
    dueDate: "2024-01-12",
    course: "CSE401-C",
  },
]

const mockTodayClasses = [
  { time: "09:00 AM", course: "Database Systems", section: "B", room: "Room 101" },
  { time: "11:00 AM", course: "Data Structures", section: "A", room: "Room 205" },
  { time: "02:00 PM", course: "Software Engineering", section: "C", room: "Room 301" },
]

const mockRecentActivity = [
  { action: "New assignment submitted", course: "CSE201-B", time: "2 hours ago" },
  { action: "Quiz grades uploaded", course: "CSE301-A", time: "1 day ago" },
  { action: "Announcement posted", course: "CSE401-C", time: "2 days ago" },
]

export default function FacultyDashboard() {
  const router = useRouter()

  const handleAddTask = (task: any) => {
    console.log("[v0] New faculty task added:", task)
    // In real app, this would call an API to save the task
  }

  const handleViewActivity = () => {
    router.push("/faculty/announcements")
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card p-4 rounded-lg border">
              <div className="flex items-center space-x-2">
                <CheckSquare className="h-5 w-5 text-chart-1" />
                <div>
                  <p className="text-2xl font-bold text-foreground">8</p>
                  <p className="text-sm text-muted-foreground">Pending Tasks</p>
                </div>
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-chart-2" />
                <div>
                  <p className="text-2xl font-bold text-foreground">4</p>
                  <p className="text-sm text-muted-foreground">Courses Teaching</p>
                </div>
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-chart-4" />
                <div>
                  <p className="text-2xl font-bold text-foreground">156</p>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                </div>
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-chart-3" />
                <div>
                  <p className="text-2xl font-bold text-foreground">12</p>
                  <p className="text-sm text-muted-foreground">Hours This Week</p>
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
                {mockFacultyTasks.map((task) => (
                  <div key={task.id} className="p-3 rounded-lg border">
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
                      <span>{task.course}</span>
                      <span>Due: {task.dueDate}</span>
                    </div>
                  </div>
                ))}
                <TodoDialog onAddTodo={handleAddTask} />
              </div>
            </DashboardCard>

            {/* Today's Classes */}
            <DashboardCard title="Today's Classes" description="Your teaching schedule for today" icon={Calendar}>
              <div className="space-y-3">
                {mockTodayClasses.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{item.course}</p>
                      <p className="text-sm text-muted-foreground">
                        Section {item.section} • {item.room}
                      </p>
                    </div>
                    <Badge variant="outline">{item.time}</Badge>
                  </div>
                ))}
              </div>
            </DashboardCard>

            {/* Recent Activity */}
            <DashboardCard title="Recent Activity" description="Latest updates from your courses" icon={Clock}>
              <div className="space-y-3">
                {mockRecentActivity.map((activity, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium text-foreground text-sm">{activity.action}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-muted-foreground">{activity.course}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4 bg-transparent" onClick={handleViewActivity}>
                  View All Activity
                </Button>
              </div>
            </DashboardCard>
          </div>
        </div>
      </main>
    </div>
  )
}
