"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, User, Edit, Trash2, Calendar } from "lucide-react"

interface Announcement {
  id: string
  title: string
  content: string
  type: "quiz" | "assignment" | "general"
  createdAt: string
  instructor: string
  courseCode: string
  section: string
  deadline?: string
}

interface AnnouncementCardProps {
  announcement: Announcement
  showActions?: boolean
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export function AnnouncementCard({ announcement, showActions = false, onEdit, onDelete }: AnnouncementCardProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "quiz":
        return "bg-chart-1/20 text-chart-1 border-chart-1/30"
      case "assignment":
        return "bg-chart-2/20 text-chart-2 border-chart-2/30"
      default:
        return "bg-chart-4/20 text-chart-4 border-chart-4/30"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "quiz":
        return "📝"
      case "assignment":
        return "📋"
      default:
        return "📢"
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getTypeIcon(announcement.type)}</span>
            <div>
              <CardTitle className="text-lg">{announcement.title}</CardTitle>
              <CardDescription className="flex items-center space-x-4 mt-1">
                <span className="flex items-center space-x-1">
                  <User className="h-3 w-3" />
                  <span>{announcement.instructor}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{announcement.createdAt}</span>
                </span>
                <span className="font-medium">
                  {announcement.courseCode}-{announcement.section}
                </span>
                {announcement.deadline && (
                  <span className="flex items-center space-x-1 text-orange-600">
                    <Calendar className="h-3 w-3" />
                    <span>Due: {new Date(announcement.deadline).toLocaleDateString()}</span>
                  </span>
                )}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className={getTypeColor(announcement.type)}>
              {announcement.type}
            </Badge>
            {showActions && (
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm" onClick={() => onEdit?.(announcement.id)}>
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete?.(announcement.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-foreground leading-relaxed">{announcement.content}</p>
      </CardContent>
    </Card>
  )
}
