"use client"

import { useState } from "react"
import { FacultySidebar } from "@/components/faculty-sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckSquare, Filter, Clock, BookOpen, Plus } from "lucide-react"

// Mock data
const mockTasks = [
  {
    id: "1",
    title: "Grade Quiz 2 - Database Systems",
    status: "pending" as const,
    dueDate: "2024-02-16",
    courseCode: "CSE201",
    section: "B",
    type: "grading" as const,
    priority: "high" as const,
  },
  {
    id: "2",
    title: "Prepare Midterm Exam - Data Structures",
    status: "delayed" as const,
    dueDate: "2024-02-14",
    courseCode: "CSE301",
    section: "A",
    type: "preparation" as const,
    priority: "high" as const,
  },
  {
    id: "3",
    title: "Submit Final Grades - Software Engineering",
    status: "completed" as const,
    dueDate: "2024-02-12",
    courseCode: "CSE401",
    section: "C",
    type: "administrative" as const,
    priority: "medium" as const,
  },
  {
    id: "4",
    title: "Review Assignment Submissions",
    status: "pending" as const,
    dueDate: "2024-02-20",
    courseCode: "CSE201",
    section: "B",
    type: "grading" as const,
    priority: "medium" as const,
  },
  {
    id: "5",
    title: "Prepare Lab Materials - Tree Algorithms",
    status: "pending" as const,
    dueDate: "2024-02-18",
    courseCode: "CSE301",
    section: "A",
    type: "preparation" as const,
    priority: "low" as const,
  },
]

const mockCourses = ["All Courses", "CSE201-B", "CSE301-A", "CSE401-C"]

export default function FacultyTasks() {
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [filterCourse, setFilterCourse] = useState("All Courses")

  const filteredTasks = mockTasks.filter((task) => {
    const matchesStatus = filterStatus === "all" || task.status === filterStatus
    const matchesType = filterType === "all" || task.type === filterType
    const matchesCourse = filterCourse === "All Courses" || `${task.courseCode}-${task.section}` === filterCourse

    return matchesStatus && matchesType && matchesCourse
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-chart-4 text-background"
      case "delayed":
        return "bg-chart-3 text-background"
      default:
        return "bg-chart-1 text-background"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-chart-3/20 text-chart-3 border-chart-3/30"
      case "medium":
        return "bg-chart-1/20 text-chart-1 border-chart-1/30"
      default:
        return "bg-chart-4/20 text-chart-4 border-chart-4/30"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "grading":
        return "📝"
      case "preparation":
        return "📚"
      case "administrative":
        return "📋"
      default:
        return "📌"
    }
  }

  const getStatusCounts = () => {
    return {
      pending: mockTasks.filter((t) => t.status === "pending").length,
      completed: mockTasks.filter((t) => t.status === "completed").length,
      delayed: mockTasks.filter((t) => t.status === "delayed").length,
    }
  }

  const statusCounts = getStatusCounts()

  return (
    <div className="flex h-screen bg-background">
      <FacultySidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
            <p className="text-muted-foreground">Manage your teaching tasks, grading, and administrative duties</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card p-4 rounded-lg border">
              <div className="flex items-center space-x-2">
                <CheckSquare className="h-5 w-5 text-chart-1" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{statusCounts.pending}</p>
                  <p className="text-sm text-muted-foreground">Pending Tasks</p>
                </div>
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="flex items-center space-x-2">
                <CheckSquare className="h-5 w-5 text-chart-4" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{statusCounts.completed}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="flex items-center space-x-2">
                <CheckSquare className="h-5 w-5 text-chart-3" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{statusCounts.delayed}</p>
                  <p className="text-sm text-muted-foreground">Delayed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filter Tasks</span>
              </CardTitle>
              <CardDescription>Filter by status, type, or course</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Status</label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="delayed">Delayed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Type</label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="grading">Grading</SelectItem>
                      <SelectItem value="preparation">Preparation</SelectItem>
                      <SelectItem value="administrative">Administrative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Course</label>
                  <Select value={filterCourse} onValueChange={setFilterCourse}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCourses.map((course) => (
                        <SelectItem key={course} value={course}>
                          {course}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add Manual Task */}
          <Card>
            <CardContent className="pt-6">
              <Button variant="outline" className="w-full bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Add Manual Task
              </Button>
            </CardContent>
          </Card>

          {/* Tasks List */}
          <div className="space-y-4">
            {filteredTasks.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <CheckSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Tasks Found</h3>
                    <p className="text-muted-foreground">
                      No tasks match your current filters. Try adjusting your search criteria.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredTasks.map((task) => (
                <Card key={task.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <span className="text-lg">{getTypeIcon(task.type)}</span>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">{task.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center space-x-1">
                              <BookOpen className="h-3 w-3" />
                              <span>
                                {task.courseCode}-{task.section}
                              </span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>Due: {task.dueDate}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
