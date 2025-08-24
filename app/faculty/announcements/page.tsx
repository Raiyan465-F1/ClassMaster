"use client"

import { useState } from "react"
import { FacultySidebar } from "@/components/faculty-sidebar"
import { AnnouncementCard } from "@/components/announcement-card"
import { AnnouncementForm } from "@/components/announcement-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Megaphone, Plus } from "lucide-react"

// Mock data
const mockCourses = [
  { code: "CSE201", name: "Database Systems", sections: ["A", "B"] },
  { code: "CSE301", name: "Data Structures", sections: ["A", "C"] },
  { code: "CSE401", name: "Software Engineering", sections: ["B", "C"] },
]

const initialAnnouncements = [
  {
    id: "1",
    title: "Quiz 3 Scheduled for Next Week",
    content: "Quiz 3 on Normalization will be held next Tuesday. Please review chapters 7-8 from the textbook.",
    type: "quiz" as const,
    createdAt: "2 hours ago",
    instructor: "Prof. Johnson",
    courseCode: "CSE201",
    section: "B",
  },
  {
    id: "2",
    title: "Assignment 2 Released",
    content: "Assignment 2 on Query Optimization is now available. Due date is February 28th.",
    type: "assignment" as const,
    createdAt: "1 day ago",
    instructor: "Prof. Johnson",
    courseCode: "CSE201",
    section: "B",
  },
  {
    id: "3",
    title: "Lab Session Rescheduled",
    content: "Tomorrow's lab session has been moved to Friday 10 AM in Lab 2.",
    type: "general" as const,
    createdAt: "5 hours ago",
    instructor: "Prof. Johnson",
    courseCode: "CSE301",
    section: "A",
  },
]

export default function FacultyAnnouncements() {
  const [announcements, setAnnouncements] = useState(initialAnnouncements)

  const handleCreateAnnouncement = (newAnnouncement: {
    title: string
    content: string
    type: "quiz" | "assignment" | "general"
    courseCode: string
    section: string
  }) => {
    const announcement = {
      id: Date.now().toString(),
      ...newAnnouncement,
      createdAt: "Just now",
      instructor: "Prof. Johnson", // In real app, this would come from auth
    }
    setAnnouncements((prev) => [announcement, ...prev])
  }

  const handleEditAnnouncement = (id: string) => {
    // In real app, this would open an edit modal
    console.log("Edit announcement:", id)
  }

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id))
  }

  return (
    <div className="flex h-screen bg-background">
      <FacultySidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Announcements</h1>
            <p className="text-muted-foreground">Create and manage course announcements for your students</p>
          </div>

          <Tabs defaultValue="create" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create" className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Create Announcement</span>
              </TabsTrigger>
              <TabsTrigger value="manage" className="flex items-center space-x-2">
                <Megaphone className="h-4 w-4" />
                <span>Manage Announcements</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="create">
              <AnnouncementForm onSubmit={handleCreateAnnouncement} courses={mockCourses} />
            </TabsContent>

            <TabsContent value="manage">
              <Card>
                <CardHeader>
                  <CardTitle>Your Announcements</CardTitle>
                  <CardDescription>View, edit, and delete your course announcements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {announcements.length === 0 ? (
                      <div className="text-center py-8">
                        <Megaphone className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">No Announcements Yet</h3>
                        <p className="text-muted-foreground">Create your first announcement using the form above.</p>
                      </div>
                    ) : (
                      announcements.map((announcement) => (
                        <AnnouncementCard
                          key={announcement.id}
                          announcement={announcement}
                          showActions={true}
                          onEdit={handleEditAnnouncement}
                          onDelete={handleDeleteAnnouncement}
                        />
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
