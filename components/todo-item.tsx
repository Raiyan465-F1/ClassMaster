"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { updateTaskStatus } from "@/lib/api/todos"

interface TodoItemProps {
  todo_id: number
  title: string
  status: "pending" | "completed" | "delayed"
  due_date: string
  related_announcement_id: number | null
  announcement_title: string | null
  announcement_content: string | null
  announcement_type: "quiz" | "assignment" | "general" | null
  announcement_deadline: string | null
  course_code: string | null
  section_number: number | null
}

export function TodoItem({ 
  todo_id, 
  title, 
  status, 
  due_date, 
  announcement_type, 
  course_code, 
  section_number 
}: TodoItemProps) {
  const [checked, setChecked] = useState(status === "completed")
  const [isUpdating, setIsUpdating] = useState(false)

  const handleCheckedChange = async (newChecked: boolean) => {
    if (!todo_id) {
      console.error('Cannot update task: todo_id is undefined')
      return
    }
    
    setIsUpdating(true)
    try {
      const newStatus = newChecked ? "completed" : "pending"
      await updateTaskStatus(todo_id, newStatus)
      setChecked(newChecked)
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

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return dateString
    }
  }

  const getCourseDisplay = () => {
    if (course_code && section_number) {
      return `${course_code}-${section_number}`
    }
    return null
  }

  return (
    <div className={cn("flex items-center space-x-3 p-3 rounded-lg border", checked && "opacity-60")}>
      <Checkbox 
        id={todo_id?.toString() || `todo-${Math.random()}`} 
        checked={checked} 
        onCheckedChange={handleCheckedChange}
        disabled={isUpdating}
      />
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
        <p className="text-xs text-muted-foreground">Due: {formatDate(due_date)}</p>
      </div>
      <Badge className={getStatusColor()}>{status}</Badge>
    </div>
  )
}