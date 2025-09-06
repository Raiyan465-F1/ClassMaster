"use client"

import { useState, useEffect } from "react"
import { FacultySidebar } from "@/components/faculty-sidebar"
import { TodoDialog } from "@/components/todo-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckSquare, Filter, Clock, BookOpen, AlertCircle, Lock } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { getCurrentUser } from "@/lib/auth"
import { getFacultyTasks, createFacultyTask, updateFacultyTaskStatus, type FacultyTask, type CreateFacultyTaskRequest, type UpdateFacultyTaskRequest } from "@/lib/api"

export default function FacultyTasks() {
  const [tasks, setTasks] = useState<FacultyTask[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingTasks, setUpdatingTasks] = useState<Set<number>>(new Set())
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [filterCourse, setFilterCourse] = useState("All Courses")

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true)
        setError(null)

        const user = getCurrentUser()
        if (!user) {
          setError('User not authenticated')
          return
        }

        const data = await getFacultyTasks(user.user_id)
        setTasks(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tasks')
        console.error('Error fetching tasks:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [])

  // Get unique courses from tasks for filter dropdown
  const availableCourses = ["All Courses", ...Array.from(new Set(
    tasks
      .filter(task => task.course_code && task.section_number)
      .map(task => `${task.course_code}-${task.section_number}`)
  ))]

  const handleAddTask = async (task: any) => {
    try {
      const user = getCurrentUser()
      if (!user) {
        console.error('User not authenticated')
        return
      }

      // Transform the task data to match the API format
      const taskData: CreateFacultyTaskRequest = {
        title: task.title,
        due_date: task.dueDate || new Date().toISOString().split('T')[0] // Use provided date or today
      }

      const newTask = await createFacultyTask(user.user_id, taskData)
      
      // Add the new task to the local state
      setTasks(prevTasks => [newTask, ...prevTasks])
      
      console.log('Faculty task created successfully:', newTask)
    } catch (error) {
      console.error('Failed to create faculty task:', error)
      // You might want to show a toast notification here
    }
  }

  const handleTaskToggle = async (taskId: number, checked: boolean) => {
    try {
      const user = getCurrentUser()
      if (!user) {
        console.error('User not authenticated')
        return
      }

      // Find the current task to check its type and current status
      const currentTask = tasks.find(task => task.todo_id === taskId)
      if (!currentTask) {
        console.error('Task not found')
        return
      }

      // Prevent unchecking (undoing) completed quiz/assignment tasks
      if (!checked && currentTask.status === 'completed' && 
          (currentTask.announcement_type === 'quiz' || currentTask.announcement_type === 'assignment')) {
        console.log('Cannot undo completed quiz/assignment tasks')
        return
      }

      // Add task to updating set
      setUpdatingTasks(prev => new Set(prev).add(taskId))

      const newStatus: "pending" | "completed" | "delayed" = checked ? 'completed' : 'pending'
      
      // Update the task via API
      const updatedTask = await updateFacultyTaskStatus(user.user_id, taskId, { status: newStatus })
      
      // Update local state with the updated task
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.todo_id === taskId ? updatedTask : task
        )
      )
      
      console.log(`Task ${taskId} updated to ${newStatus}:`, updatedTask)
    } catch (error) {
      console.error('Failed to update task status:', error)
      // You might want to show a toast notification here
    } finally {
      // Remove task from updating set
      setUpdatingTasks(prev => {
        const newSet = new Set(prev)
        newSet.delete(taskId)
        return newSet
      })
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No due date'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getTaskType = (task: FacultyTask) => {
    if (task.announcement_type) {
      switch (task.announcement_type) {
        case 'quiz':
          return 'grading'
        case 'assignment':
          return 'grading'
        default:
          return 'preparation'
      }
    }
    return 'administrative'
  }

  const getTaskPriority = (task: FacultyTask) => {
    if (task.announcement_type === 'quiz' || task.announcement_type === 'assignment') {
      return 'high'
    }
    if (task.due_date) {
      const dueDate = new Date(task.due_date)
      const now = new Date()
      const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysUntilDue <= 1) return 'high'
      if (daysUntilDue <= 3) return 'medium'
    }
    return 'low'
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = filterStatus === "all" || task.status === filterStatus
    const taskType = getTaskType(task)
    const matchesType = filterType === "all" || taskType === filterType
    const courseKey = task.course_code && task.section_number ? `${task.course_code}-${task.section_number}` : null
    const matchesCourse = filterCourse === "All Courses" || courseKey === filterCourse

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
      pending: tasks.filter((t) => t.status === "pending").length,
      completed: tasks.filter((t) => t.status === "completed").length,
      delayed: tasks.filter((t) => t.status === "delayed").length,
    }
  }

  const statusCounts = getStatusCounts()

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <FacultySidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading tasks...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen bg-background">
        <FacultySidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Error Loading Tasks</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  Try Again
                </button>
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
                      {availableCourses.map((course) => (
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
              <TodoDialog onAddTodo={handleAddTask} userRole="faculty" />
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
              filteredTasks.map((task) => {
                const taskType = getTaskType(task)
                const taskPriority = getTaskPriority(task)
                const courseKey = task.course_code && task.section_number ? `${task.course_code}-${task.section_number}` : null
                
                return (
                  <Card key={task.todo_id} className="hover:shadow-md transition-shadow pt-2">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <Checkbox 
                            id={`task-${task.todo_id}`}
                            checked={task.status === 'completed'}
                            onCheckedChange={(checked) => handleTaskToggle(task.todo_id, checked as boolean)}
                            disabled={
                              updatingTasks.has(task.todo_id) || 
                              (task.status === 'completed' && 
                               (task.announcement_type === 'quiz' || task.announcement_type === 'assignment'))
                            }
                            className="mt-1 flex-shrink-0 border-2 border-muted-foreground/40 bg-background hover:border-muted-foreground/60 size-5 shadow-sm transition-all disabled:opacity-50"
                          />
                          <span className="text-lg">{getTypeIcon(taskType)}</span>
                          <div className="flex-1">
                            <h3 className={`font-semibold text-foreground mb-1 ${task.status === 'completed' ? 'line-through opacity-60' : ''}`}>
                              {task.title}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              {courseKey && (
                                <span className="flex items-center space-x-1">
                                  <BookOpen className="h-3 w-3" />
                                  <span>{courseKey}</span>
                                </span>
                              )}
                              <span className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>Due: {formatDate(task.due_date)}</span>
                              </span>
                            </div>
                            {task.announcement_title && (
                              <div className="mt-2 text-sm text-muted-foreground">
                                <span className="font-medium">Related: </span>
                                <span>{task.announcement_title}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={getPriorityColor(taskPriority)}>
                            {taskPriority}
                          </Badge>
                          <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                          {task.status === 'completed' && 
                           (task.announcement_type === 'quiz' || task.announcement_type === 'assignment') && (
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <Lock className="h-3 w-3" />
                              <span>Locked</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
