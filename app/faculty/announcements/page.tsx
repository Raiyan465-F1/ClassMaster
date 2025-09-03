"use client"

import { useState, useEffect } from "react"
import { FacultySidebar } from "@/components/faculty-sidebar"
import { AnnouncementCard } from "@/components/announcement-card"
import { AnnouncementForm } from "@/components/announcement-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Megaphone, Plus } from "lucide-react"
import { toast } from "sonner"
import { getFacultySections, getCourses, getSections } from "@/lib/api/courses"
import { createAnnouncement, type Announcement } from "@/lib/api/announcements"
import { getCurrentUser } from "@/lib/auth"

// Types for the form
interface FormAnnouncement {
  title: string
  content: string
  type: "quiz" | "assignment" | "general"
  courseCode: string
  section: string
  deadline?: string
}

// Types for display
interface DisplayAnnouncement {
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

export default function FacultyAnnouncements() {
  const [announcements, setAnnouncements] = useState<DisplayAnnouncement[]>([])
  const [courses, setCourses] = useState<Array<{ code: string; name: string; sections: string[] }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }
  }, [])

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    setIsLoading(true)
    try {
      // Load faculty sections to get available courses and sections
      const facultySections = await getFacultySections(user.user_id)
      
      // Get unique courses from faculty sections
      const courseCodes = [...new Set(facultySections.map(fs => fs.course_code))]
      
      // Load course details
      const allCourses = await getCourses()
      const facultyCourses = allCourses.filter(course => courseCodes.includes(course.course_code))
      
      // Transform faculty sections into the format needed for the form
      const transformedCourses = facultyCourses.map(course => {
        const courseSections = facultySections
          .filter(fs => fs.course_code === course.course_code)
          .map(fs => fs.sec_number.toString())
        
        return {
          code: course.course_code,
          name: course.course_name,
          sections: courseSections
        }
      })
      
      setCourses(transformedCourses)
    } catch (error) {
      console.error('Failed to load data:', error)
      toast.error('Failed to load course data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateAnnouncement = async (newAnnouncement: FormAnnouncement) => {
    setIsSubmitting(true)
    try {
      // Convert section string to number
      const sectionNumber = parseInt(newAnnouncement.section)
      
      // Create the announcement via API
      const apiAnnouncement = await createAnnouncement({
        title: newAnnouncement.title,
        content: newAnnouncement.content,
        type: newAnnouncement.type,
        course_code: newAnnouncement.courseCode,
        sec_number: sectionNumber,
        deadline: newAnnouncement.deadline
      })

      // Add to local state for display
      const displayAnnouncement: DisplayAnnouncement = {
        id: apiAnnouncement.announcement_id.toString(),
        title: apiAnnouncement.title,
        content: apiAnnouncement.content,
        type: apiAnnouncement.type,
        createdAt: "Just now",
        instructor: `Prof. ${user?.name || 'Faculty'}`,
        courseCode: apiAnnouncement.section_course_code,
        section: apiAnnouncement.section_sec_number.toString(),
        deadline: apiAnnouncement.deadline
      }
      
      setAnnouncements(prev => [displayAnnouncement, ...prev])
      toast.success('Announcement created successfully!')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create announcement'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
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

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Loading courses and sections...</p>
            </div>
          ) : (
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
              <AnnouncementForm 
                onSubmit={handleCreateAnnouncement} 
                courses={courses} 
                isSubmitting={isSubmitting}
              />
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
          )}
        </div>
      </main>
    </div>
  )
}
