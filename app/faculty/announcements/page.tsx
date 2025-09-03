"use client"

import { useState, useEffect } from "react"
import { FacultySidebar } from "@/components/faculty-sidebar"
import { AnnouncementCard } from "@/components/announcement-card"
import { AnnouncementForm } from "@/components/announcement-form"
import { EditAnnouncementModal } from "@/components/edit-announcement-modal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Megaphone, Plus, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { getFacultySections, getCourses, getSections } from "@/lib/api/courses"
import { createAnnouncement, updateAnnouncement, getSectionAnnouncements, getFacultyAnnouncements, type Announcement } from "@/lib/api/announcements"
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

// Types for the dropdown
interface CourseSectionOption {
  value: string
  label: string
}

export default function FacultyAnnouncements() {
  const [announcements, setAnnouncements] = useState<DisplayAnnouncement[]>([])
  const [courses, setCourses] = useState<Array<{ code: string; name: string; sections: string[] }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [selectedFilter, setSelectedFilter] = useState<string>("all")
  const [courseSectionOptions, setCourseSectionOptions] = useState<CourseSectionOption[]>([])
  const [editingAnnouncement, setEditingAnnouncement] = useState<DisplayAnnouncement | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

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
      
      // Create dropdown options for course-section filtering
      const options: CourseSectionOption[] = [
        { value: "all", label: "All Announcements" }
      ]
      
      transformedCourses.forEach(course => {
        course.sections.forEach(section => {
          options.push({
            value: `${course.code}-${section}`,
            label: `${course.code} Section ${section} - ${course.name}`
          })
        })
      })
      
      setCourseSectionOptions(options)
      
      // Load all faculty announcements initially
      await loadAnnouncements("all")
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

      // Refresh the announcements list based on current filter
      await loadAnnouncements(selectedFilter)
      toast.success('Announcement created successfully!')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create announcement'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditAnnouncement = (id: string) => {
    const announcement = announcements.find(a => a.id === id)
    if (announcement) {
      setEditingAnnouncement(announcement)
      setIsEditModalOpen(true)
    }
  }

  const handleUpdateAnnouncement = async (updatedData: any) => {
    if (!editingAnnouncement) return

    try {
      // Convert section string to number
      const sectionNumber = parseInt(updatedData.sec_number)
      
      // Update the announcement via API
      await updateAnnouncement(parseInt(editingAnnouncement.id), {
        title: updatedData.title,
        content: updatedData.content,
        type: updatedData.type,
        course_code: updatedData.course_code,
        sec_number: sectionNumber,
        deadline: updatedData.deadline
      })

      // Refresh the announcements list
      await loadAnnouncements(selectedFilter)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update announcement'
      toast.error(errorMessage)
      throw error // Re-throw to let the modal handle the error
    }
  }

  const loadAnnouncements = async (filter: string) => {
    try {
      let apiAnnouncements: Announcement[] = []
      
      if (filter === "all") {
        // Load all faculty announcements
        apiAnnouncements = await getFacultyAnnouncements(user.user_id)
      } else {
        // Load announcements for specific course-section
        const [courseCode, sectionNumber] = filter.split("-")
        apiAnnouncements = await getSectionAnnouncements(courseCode, parseInt(sectionNumber))
      }
      
      // Transform API announcements to display format
      const displayAnnouncements: DisplayAnnouncement[] = apiAnnouncements.map(apiAnn => ({
        id: apiAnn.announcement_id.toString(),
        title: apiAnn.title,
        content: apiAnn.content,
        type: apiAnn.type,
        createdAt: new Date(apiAnn.created_at).toLocaleDateString(),
        instructor: `Prof. ${user?.name || 'Faculty'}`,
        courseCode: apiAnn.section_course_code,
        section: apiAnn.section_sec_number.toString(),
        deadline: apiAnn.deadline
      }))
      
      setAnnouncements(displayAnnouncements)
    } catch (error) {
      console.error('Failed to load announcements:', error)
      toast.error('Failed to load announcements')
    }
  }

  const handleFilterChange = async (filter: string) => {
    setSelectedFilter(filter)
    await loadAnnouncements(filter)
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
                  {/* Filter Dropdown and Refresh Button */}
                  <div className="mb-6 flex items-end gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Filter Announcements
                      </label>
                      <Select value={selectedFilter} onValueChange={handleFilterChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select filter" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {courseSectionOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <button
                      onClick={() => loadAnnouncements(selectedFilter)}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Refresh
                    </button>
                  </div>

                  {/* Announcements List */}
                  <div className="space-y-4">
                    {announcements.length === 0 ? (
                      <div className="text-center py-8">
                        <Megaphone className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          {selectedFilter === "all" ? "No Announcements Found" : "No Announcements for Selected Course-Section"}
                        </h3>
                        <p className="text-muted-foreground">
                          {selectedFilter === "all" 
                            ? "You haven't created any announcements yet." 
                            : "No announcements found for the selected course and section."
                          }
                        </p>
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

      {/* Edit Announcement Modal */}
      <EditAnnouncementModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingAnnouncement(null)
        }}
        announcement={editingAnnouncement}
        courses={courses}
        onUpdate={handleUpdateAnnouncement}
      />
    </div>
  )
}
