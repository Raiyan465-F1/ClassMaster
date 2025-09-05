"use client"

import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { updateTaskStatus } from "@/lib/api/todos"
import { ConfirmationDialog } from "@/components/confirmation-dialog"
import { CheckCircle } from "lucide-react"

interface TodoItemProps {
  todo_id: number
  title: string
  status: "pending" | "completed" | "delayed"
  due_date: string | null
  related_announcement_id: number | null
  announcement_title: string | null
  announcement_content: string | null
  announcement_type: "quiz" | "assignment" | "general" | null
  announcement_deadline: string | null
  course_code: string | null
  section_number: number | null
  onStatusChange?: (todoId: number, newStatus: "pending" | "completed" | "delayed") => void
}

export function TodoItem({ 
  todo_id, 
  title, 
  status, 
  due_date, 
  announcement_type, 
  course_code, 
  section_number,
  onStatusChange
}: TodoItemProps) {
  const [checked, setChecked] = useState(status === "completed")
  const [isUpdating, setIsUpdating] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Update checked state when status prop changes
  useEffect(() => {
    setChecked(status === "completed")
  }, [status])

  const isOverdue = (dateString: string | null) => {
    if (!dateString) {
      return false
    }
    try {
      const dueDate = new Date(dateString)
      const today = new Date()
      today.setHours(0, 0, 0, 0) // Reset time to start of day
      dueDate.setHours(0, 0, 0, 0) // Reset time to start of day
      
      return dueDate.getTime() < today.getTime()
    } catch {
      return false
    }
  }

  const handleAssignmentCompletion = async () => {
    if (!todo_id) {
      console.error('Cannot update task: todo_id is undefined')
      return
    }
    
    setIsUpdating(true)
    try {
      const updatedTask = await updateTaskStatus(todo_id, "completed")
      setChecked(true)
      
      // Notify parent component of the status change
      onStatusChange?.(todo_id, "completed")
      
      console.log('Assignment completed:', updatedTask)
    } catch (error) {
      console.error('Failed to complete assignment:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCheckedChange = async (newChecked: boolean) => {
    if (!todo_id) {
      console.error('Cannot update task: todo_id is undefined')
      return
    }
    
    setIsUpdating(true)
    try {
      let newStatus: "pending" | "completed" | "delayed"
      
      if (newChecked) {
        // If checking the task, mark as completed
        newStatus = "completed"
      } else {
        // If unchecking the task, check if it's overdue
        if (isOverdue(due_date)) {
          newStatus = "delayed"
        } else {
          newStatus = "pending"
        }
      }
      
      const updatedTask = await updateTaskStatus(todo_id, newStatus)
      setChecked(newChecked)
      
      // Notify parent component of the status change
      onStatusChange?.(todo_id, newStatus)
      
      console.log('Task updated:', updatedTask)
    } catch (error) {
      console.error('Failed to update task status:', error)
      // Revert the checkbox state on error
      setChecked(!newChecked)
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "completed":
        return "bg-chart-4 text-background"
      case "delayed":
        return "bg-chart-3 text-background"
      default:
        return "bg-chart-1 text-background"
    }
  }

  const getTypeColor = () => {
    switch (announcement_type) {
      case "quiz":
        return "bg-chart-2/20 text-chart-2"
      case "assignment":
        return "bg-chart-1/20 text-chart-1"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) {
      return "None"
    }
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return dateString
    }
  }

  const getDaysLeft = (dateString: string | null) => {
    if (!dateString) {
      return null
    }
    try {
      const dueDate = new Date(dateString)
      const today = new Date()
      today.setHours(0, 0, 0, 0) // Reset time to start of day
      dueDate.setHours(0, 0, 0, 0) // Reset time to start of day
      
      const diffTime = dueDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays < 0) {
        return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`
      } else if (diffDays === 0) {
        return "Due today"
      } else if (diffDays === 1) {
        return "Due tomorrow"
      } else {
        return `${diffDays} days left`
      }
    } catch {
      return null
    }
  }

  const getDaysLeftColor = (dateString: string | null) => {
    if (!dateString) {
      return ""
    }
    try {
      const dueDate = new Date(dateString)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      dueDate.setHours(0, 0, 0, 0)
      
      const diffTime = dueDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays < 0) {
        return "text-destructive" // Red for overdue
      } else if (diffDays === 0) {
        return "text-orange-600" // Orange for due today
      } else if (diffDays <= 3) {
        return "text-yellow-600" // Yellow for due soon (1-3 days)
      } else {
        return "text-muted-foreground" // Default color
      }
    } catch {
      return "text-muted-foreground"
    }
  }

  const getCourseDisplay = () => {
    if (course_code && section_number) {
      return `${course_code}-${section_number}`
    }
    return null
  }

  return (
    <>
      <div className={cn("flex items-center space-x-3 p-3 rounded-lg border", checked && "opacity-60")}>
        {announcement_type === "assignment" ? (
          // Show Done button for assignments
          <div className="flex-shrink-0">
            {status === "completed" ? (
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-chart-4 text-background">
                <CheckCircle className="h-4 w-4" />
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowConfirmation(true)}
                disabled={isUpdating}
                className="h-6 px-2 text-xs"
              >
                Done
              </Button>
            )}
          </div>
        ) : (
          // Show checkbox for other task types
          <Checkbox 
            id={todo_id?.toString() || `todo-${Math.random()}`} 
            checked={checked} 
            onCheckedChange={handleCheckedChange}
            disabled={isUpdating}
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <p className={cn("text-sm font-medium", checked && "line-through text-muted-foreground")}>{title}</p>
            {announcement_type && (
              <Badge variant="secondary" className={getTypeColor()}>
                {announcement_type}
              </Badge>
            )}
            {getCourseDisplay() && (
              <Badge variant="outline" className="text-xs">
                {getCourseDisplay()}
              </Badge>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            <span>Due: {formatDate(due_date)}</span>
            {status !== "completed" && getDaysLeft(due_date) && (
              <span className={`ml-2 font-medium ${getDaysLeftColor(due_date)}`}>
                ({getDaysLeft(due_date)})
              </span>
            )}
          </div>
        </div>
        <Badge className={getStatusColor()}>{status}</Badge>
      </div>

      {/* Confirmation Dialog for Assignment Completion */}
      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleAssignmentCompletion}
        title="Complete Assignment"
        description={`Are you sure you want to mark "${title}" as completed? This action cannot be undone.`}
        confirmText="Mark as Done"
        cancelText="Cancel"
        variant="default"
        isLoading={isUpdating}
      />
    </>
  )
}