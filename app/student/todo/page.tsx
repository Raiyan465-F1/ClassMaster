"use client"

import { useState, useEffect } from "react"
import { StudentSidebar } from "@/components/student-sidebar"
import { TodoItem } from "@/components/todo-item"
import { TodoDialog } from "@/components/todo-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Filter, Search, CheckSquare, AlertCircle } from "lucide-react"
import { getStudentTasks, StudentTask } from "@/lib/api/todos"
import { getCurrentUser } from "@/lib/auth"
import { type FacultyTask } from "@/lib/api/faculty-tasks"


export default function StudentTodo() {
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [filterCourse, setFilterCourse] = useState("All Courses")
  const [searchTerm, setSearchTerm] = useState("")
  const [todos, setTodos] = useState<StudentTask[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const currentUser = getCurrentUser()

  useEffect(() => {
    const fetchTodos = async () => {
      const user = getCurrentUser() // Get fresh user data inside the effect
      if (!user || user.role !== 'student') {
        setError('User not authenticated or not a student')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const tasks = await getStudentTasks(user.user_id)
        setTodos(tasks)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tasks')
      } finally {
        setLoading(false)
      }
    }

    fetchTodos()
  }, []) // Empty dependency array - only run once on mount

  const handleAddTodo = (newTask: StudentTask | FacultyTask) => {
    // Add the new task to the existing todos list
    setTodos(prevTodos => [newTask as StudentTask, ...prevTodos])
  }

  const handleStatusChange = (todoId: number, newStatus: "pending" | "completed" | "delayed") => {
    // Update the todo in the local state
    setTodos(prevTodos => 
      prevTodos.map(todo => 
        todo.todo_id === todoId 
          ? { ...todo, status: newStatus }
          : todo
      )
    )
  }

  const refreshTodos = async () => {
    const user = getCurrentUser()
    if (!user || user.role !== 'student') {
      setError('User not authenticated or not a student')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const tasks = await getStudentTasks(user.user_id)
      setTodos(tasks)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }

  // Get unique courses for filter dropdown
  const availableCourses = ["All Courses", ...Array.from(new Set(
    todos
      .filter(todo => todo.course_code && todo.course_code !== null && todo.section_number !== null)
      .map(todo => `${todo.course_code}-${todo.section_number}`)
  ))]

  const filteredTodos = todos.filter((todo) => {
    const matchesStatus = filterStatus === "all" || todo.status === filterStatus
    const matchesType = filterType === "all" || todo.announcement_type === filterType
    const courseDisplay = todo.course_code && todo.course_code !== null && todo.section_number !== null ? `${todo.course_code}-${todo.section_number}` : null
    const matchesCourse = filterCourse === "All Courses" || courseDisplay === filterCourse
    const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesStatus && matchesType && matchesCourse && matchesSearch
  })

  const getStatusCounts = () => {
    return {
      pending: todos.filter((t) => t.status === "pending").length,
      completed: todos.filter((t) => t.status === "completed").length,
      delayed: todos.filter((t) => t.status === "delayed").length,
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
                      {availableCourses.map((course) => (
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
              <TodoDialog onAddTodo={handleAddTodo} userRole="student" />
            </CardContent>
          </Card>

          {/* Todo List */}
          <div className="space-y-3">
            {loading ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <CheckSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4 animate-pulse" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">Loading Tasks...</h3>
                    <p className="text-muted-foreground">
                      Please wait while we fetch your tasks.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : error ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">Error Loading Tasks</h3>
                    <p className="text-muted-foreground mb-4">
                      {error}
                    </p>
                    <button 
                      onClick={refreshTodos} 
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                    >
                      Retry
                    </button>
                  </div>
                </CardContent>
              </Card>
            ) : filteredTodos.length === 0 ? (
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
              filteredTodos
                .filter(todo => todo.todo_id !== undefined && todo.todo_id !== null)
                .map((todo) => <TodoItem key={todo.todo_id} {...todo} onStatusChange={handleStatusChange} />)
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
