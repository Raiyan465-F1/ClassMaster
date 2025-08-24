import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Megaphone, Clock, User } from "lucide-react"

interface Announcement {
  id: string
  title: string
  content: string
  type: "quiz" | "assignment" | "general"
  createdAt: string
  instructor: string
}

interface ClassAnnouncementsProps {
  announcements: Announcement[]
  courseCode: string
}

export function ClassAnnouncements({ announcements, courseCode }: ClassAnnouncementsProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "quiz":
        return "bg-chart-1/20 text-chart-1"
      case "assignment":
        return "bg-chart-2/20 text-chart-2"
      default:
        return "bg-chart-4/20 text-chart-4"
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
    <div className="space-y-4">
      {announcements.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No announcements for this course yet.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        announcements.map((announcement) => (
          <Card key={announcement.id}>
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
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className={getTypeColor(announcement.type)}>
                  {announcement.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">{announcement.content}</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
