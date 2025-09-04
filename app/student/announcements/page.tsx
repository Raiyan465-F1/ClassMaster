"use client"

import { useState, useEffect } from "react"
import { StudentSidebar } from "@/components/student-sidebar"
import { AnnouncementCard } from "@/components/announcement-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Filter, Search, Megaphone, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { getStudentSections } from "@/lib/api/courses"
import { getStudentAnnouncements, type Announcement as APIAnnouncement } from "@/lib/api/announcements"
import { getCurrentUser } from "@/lib/auth"

// Interface for transformed announcement data
interface TransformedAnnouncement {
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

export default function StudentAnnouncements() {
  const [filterType, setFilterType] = useState("all")
  const [filterCourse, setFilterCourse] = useState("All Courses")
  const [searchTerm, setSearchTerm] = useState("")
  const [announcements, setAnnouncements] = useState<TransformedAnnouncement[]>([])
  const [courses, setCourses] = useState<string[]>(["All Courses"])
  const [isLoading, setIsLoading] = useState(true)
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
      // Get student's enrolled sections for course filter options
      const studentSections = await getStudentSections(user.user_id)
      
      // Build course options for filter
      const courseOptions = ["All Courses"]
      studentSections.forEach(section => {
        courseOptions.push(`${section.course_code}-${section.sec_number}`)
      })
      setCourses(courseOptions)

      // Fetch all announcements for the student in one API call
      const allAnnouncements = await getStudentAnnouncements(user.user_id)
      
      // Transform API data to match component interface
      const transformedAnnouncements: TransformedAnnouncement[] = allAnnouncements.map(announcement => ({
        id: announcement.announcement_id.toString(),
        title: announcement.title,
        content: announcement.content,
        type: announcement.type,
        createdAt: formatTimeAgo(announcement.created_at),
        instructor: `Faculty ${announcement.faculty_id}`, // You might want to fetch faculty names separately
        courseCode: announcement.section_course_code,
        section: announcement.section_sec_number.toString(),
        deadline: announcement.deadline
      }))
      
      setAnnouncements(transformedAnnouncements)
    } catch (error) {
      console.error('Failed to load data:', error)
      toast.error('Failed to load announcements')
    } finally {
      setIsLoading(false)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.round(diffMs / 60000)
    const diffHours = Math.round(diffMs / 3600000)
    const diffDays = Math.round(diffMs / 86400000)

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesType = filterType === "all" || announcement.type === filterType
    const matchesCourse =
      filterCourse === "All Courses" || `${announcement.courseCode}-${announcement.section}` === filterCourse
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.instructor.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesType && matchesCourse && matchesSearch
  })

  return (
    <div className="flex h-screen bg-background">
      <StudentSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Announcements</h1>
              <p className="text-muted-foreground">Stay updated with the latest course announcements and notifications</p>
            </div>
            <button
              onClick={loadData}
              disabled={isLoading}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Announcements</CardTitle>
                <Megaphone className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{announcements.length}</div>
                <p className="text-xs text-muted-foreground">
                  Across all your courses
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
                <Filter className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{courses.length - 1}</div>
                <p className="text-xs text-muted-foreground">
                  With announcements
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Filtered Results</CardTitle>
                <Search className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filteredAnnouncements.length}</div>
                <p className="text-xs text-muted-foreground">
                  Matching current filters
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filter Announcements</span>
              </CardTitle>
              <CardDescription>Filter by type, course, or search for specific content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Type</label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="quiz">📝 Quizzes</SelectItem>
                      <SelectItem value="assignment">📋 Assignments</SelectItem>
                      <SelectItem value="general">📢 General</SelectItem>
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
                      {courses.map((course) => (
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
                      placeholder="Search announcements..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Announcements List */}
          <div className="space-y-4">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="h-6 bg-muted rounded w-3/4"></div>
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                      </div>
                      <div className="h-6 bg-muted rounded w-16"></div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-full"></div>
                      <div className="h-4 bg-muted rounded w-5/6"></div>
                      <div className="h-4 bg-muted rounded w-4/6"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : filteredAnnouncements.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Megaphone className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Announcements Found</h3>
                    <p className="text-muted-foreground">
                      {announcements.length === 0 
                        ? "You don't have any announcements yet. Check back later for updates from your instructors."
                        : "No announcements match your current filters. Try adjusting your search criteria."
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredAnnouncements.map((announcement) => (
                <AnnouncementCard key={announcement.id} announcement={announcement} />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
