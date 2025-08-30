"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface TodoItemProps {
  id: string
  title: string
  status: "pending" | "completed" | "delayed"
  dueDate?: string
  type?: "quiz" | "assignment" | "general"
}

export function TodoItem({ id, title, status, dueDate, type }: TodoItemProps) {
  const [checked, setChecked] = useState(status === "completed")

  const handleCheckedChange = (newChecked: boolean) => {
    setChecked(newChecked)
    // Here you would typically update the backend
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
    switch (type) {
      case "quiz":
        return "bg-chart-2/20 text-chart-2"
      case "assignment":
        return "bg-chart-1/20 text-chart-1"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className={cn("flex items-center space-x-3 p-3 rounded-lg border", checked && "opacity-60")}>
      <Checkbox id={id} checked={checked} onCheckedChange={handleCheckedChange} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <p className={cn("text-sm font-medium", checked && "line-through text-muted-foreground")}>{title}</p>
          {type && (
            <Badge variant="secondary" className={getTypeColor()}>
              {type}
            </Badge>
          )}
        </div>
        {dueDate && <p className="text-xs text-muted-foreground">Due: {dueDate}</p>}
      </div>
      <Badge className={getStatusColor()}>{status}</Badge>
    </div>
  )
}