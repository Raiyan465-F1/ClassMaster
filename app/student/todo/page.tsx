"use client"

import { useState } from "react"
import { StudentSidebar } from "@/components/student-sidebar"
import { TodoItem } from "@/components/todo-item"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Filter, Search, CheckSquare, Plus } from "lucide-react"

// Mock data
const mockTodos = [
  {
    id: "1",
    title: "Complete Database Assignment 2",
    status: "pending" as const,
    dueDate: "2024-02-28",
    type: "assignment" as const,
    courseCode: "CSE201",
    section: "B",
  },
  {
    id: "2",
    title: "Prepare for Data Structures Quiz 3",
    status: "delayed" as const,
    dueDate: "2024-02-15",
    type: "quiz" as const,
    courseCode: "CSE301",
    section: "A",
  },
  {
    id: "3",
    title: "Submit Lab Report - Tree Traversals",
    status: "completed" as const,
    dueDate: "2024-02-10",
    type: "assignment" as const,
    courseCode: "CSE301",
    section: "A",
  },
  {
    id: "4",
    title: "Software Engineering Project Presentation",
    status: "pending" as const,
    dueDate: "2024-03-05",
    type: "assignment" as const,
    courseCode: "CSE401",
    section: "C",
  },
  {
    id: "5",
    title: "Database Normalization Quiz",
    status: "pending" as const,
    dueDate: "2024-02-20",
    type: "quiz" as const,
    courseCode: "CSE201",
    section: "B",
  },
  {
    id: "6",
    title: "Review Chapter 8 - Advanced SQL",
    status: "pending" as const,
    dueDate: "2024-02-18",
    type: "general" as const,
    courseCode: "CSE201",
    section: "B",
  },
]

const mockCourses = ["All Courses", "CSE201-B", "CSE301-A", "CSE401-C"]

export default function StudentTodo() {
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [filterCourse, setFilterCourse] = useState("All Courses")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredTodos = mockTodos.filter((todo) => {
    const matchesStatus = filterStatus === "all" || todo.status === filterStatus
    const matchesType = filterType === "all" || todo.type === filterType
    const matchesCourse = filterCourse === "All Courses" || `${todo.courseCode}-${todo.section}` === filterCourse
    const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesStatus && matchesType && matchesCourse && matchesSearch
  })

  const getStatusCounts = () => {
    return {
      pending: mockTodos.filter((t) => t.status === "pending").length,
      completed: mockTodos.filter((t) => t.status === "completed").length,
      delayed: mockTodos.filter((t) => t.status === "delayed").length,
    }
  }

  const statusCounts = getStatusCounts()

  return (
    <div className="flex h-screen bg-background">
      <StudentSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Todo List</h1>
            <p className="text-muted-foreground">Manage your assignments, quizzes, and tasks across all courses</p>
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
              <CardDescription>Filter by status, type, course, or search for specific tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                      <SelectItem value="general">General</SelectItem>
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

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search tasks..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add Manual Todo */}
          <Card>
            <CardContent className="pt-6">
              <Button variant="outline" className="w-full bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Add Manual Todo
              </Button>
            </CardContent>
          </Card>

          {/* Todo List */}
          <div className="space-y-3">
            {filteredTodos.length === 0 ? (
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
              filteredTodos.map((todo) => <TodoItem key={todo.id} {...todo} />)
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
