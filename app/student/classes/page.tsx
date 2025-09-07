"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { StudentSidebar } from "@/components/student-sidebar"
import { CourseSelector } from "@/components/course-selector"
import { GradeTable } from "@/components/grade-table"
import { ClassAnnouncements } from "@/components/class-announcements"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, BarChart3, Megaphone, AlertCircle } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { getStudentSections, getSections, type StudentSection, type Section } from "@/lib/api/courses"
import { getSectionAnnouncements, type Announcement } from "@/lib/api/announcements"
import { getMyGrades, type Grade } from "@/lib/api"

// Interface for course data with instructor info
interface CourseWithInstructor {
  code: string
  name: string
  section: string
  instructor: string
}

// Mock grades data - keeping as requested (no API integration)
const mockGrades = {
  "CSE201-B": [
    {
      id: "1",
      type: "quiz" as const,
      title: "Quiz 1: ER Diagrams",
      marks: 18,
      totalMarks: 20,
      date: "2024-01-10",
      percentage: 90,
    },
    {
      id: "2",
      type: "assignment" as const,
      title: "Assignment 1: Database Design",
      marks: 42,
      totalMarks: 50,
      date: "2024-01-15",
      percentage: 84,
    },
    {
      id: "3",
      type: "attendance" as const,
      title: "January Attendance",
      marks: 95,
      totalMarks: 100,
      date: "2024-01-31",
      percentage: 95,
    },
    {
      id: "4",
      type: "quiz" as const,
      title: "Quiz 2: SQL Queries",
      marks: 16,
      totalMarks: 20,
      date: "2024-02-05",
      percentage: 80,
    },
  ],
  "CSE301-A": [
    {
      id: "5",
      type: "quiz" as const,
      title: "Quiz 1: Arrays and Linked Lists",
      marks: 17,
      totalMarks: 20,
      date: "2024-01-12",
      percentage: 85,
    },
    {
      id: "6",
      type: "assignment" as const,
      title: "Assignment 1: Stack Implementation",
      marks: 45,
      totalMarks: 50,
      date: "2024-01-20",
      percentage: 90,
    },
  ],
}

export default function StudentClasses() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [courses, setCourses] = useState<CourseWithInstructor[]>([])
  const [announcements, setAnnouncements] = useState<Record<string, Announcement[]>>({})
  const [grades, setGrades] = useState<Record<string, Grade[]>>({})
  const [loading, setLoading] = useState(true)
  const [gradesLoading, setGradesLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const courseParam = searchParams.get("course")
    if (courseParam) {
      setSelectedCourse(courseParam)
    }
  }, [searchParams])

  // Fetch grades when course is selected
  useEffect(() => {
    const fetchGrades = async () => {
      if (!selectedCourse) {
        return
      }

      const courseData = courses.find((c) => `${c.code}-${c.section}` === selectedCourse)
      if (!courseData) {
        return
      }

      try {
        setGradesLoading(true)
        const courseGrades = await getMyGrades(courseData.code, parseInt(courseData.section))
        setGrades(prev => ({
          ...prev,
          [selectedCourse]: courseGrades
        }))
      } catch (err) {
        console.error('Failed to fetch grades:', err)
        setGrades(prev => ({
          ...prev,
          [selectedCourse]: []
        }))
      } finally {
        setGradesLoading(false)
      }
    }

    fetchGrades()
  }, [selectedCourse, courses])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const user = getCurrentUser()
        if (!user) {
          setError('User not authenticated')
          return
        }

        // Fetch student's enrolled sections
        const studentSections = await getStudentSections(user.user_id)
        
        // Fetch all sections to get course names and instructor info
        const allSections = await getSections()
        
        // Create course list with instructor info
        const courseList: CourseWithInstructor[] = studentSections.map(studentSection => {
          const sectionInfo = allSections.find(s => 
            s.course_code === studentSection.course_code && 
            s.sec_number === studentSection.sec_number
          )
          
          return {
            code: studentSection.course_code,
            name: sectionInfo?.course_name || studentSection.course_code,
            section: String(studentSection.sec_number),
            instructor: `Instructor ${studentSection.sec_number}` // Placeholder - would need faculty info
          }
        })

        setCourses(courseList)

        // Fetch announcements for each course
        const announcementsData: Record<string, Announcement[]> = {}
        for (const course of courseList) {
          try {
            const courseAnnouncements = await getSectionAnnouncements(course.code, parseInt(course.section))
            announcementsData[`${course.code}-${course.section}`] = courseAnnouncements
          } catch (err) {
            console.error(`Failed to fetch announcements for ${course.code}-${course.section}:`, err)
            announcementsData[`${course.code}-${course.section}`] = []
          }
        }
        setAnnouncements(announcementsData)

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load courses')
        console.error('Error fetching courses:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const selectedCourseData = selectedCourse
    ? courses.find((c) => `${c.code}-${c.section}` === selectedCourse)
    : null
  const courseGrades = selectedCourse ? mockGrades[selectedCourse as keyof typeof mockGrades] || [] : []
  const courseAnnouncements = selectedCourse
    ? announcements[selectedCourse] || []
    : []

  // Convert API grades to GradeTable format
  const apiGrades = selectedCourse ? grades[selectedCourse] || [] : []
  const convertedGrades = apiGrades.map((grade, index) => ({
    id: `${grade.student_id}-${grade.grade_type}-${index}`,
    studentId: grade.student_id.toString(),
    studentName: "You", // Student viewing their own grades
    type: grade.grade_type.toLowerCase().includes('quiz') ? 'quiz' as const :
          grade.grade_type.toLowerCase().includes('assignment') ? 'assignment' as const :
          grade.grade_type.toLowerCase().includes('midterm') ? 'midterm' as const :
          grade.grade_type.toLowerCase().includes('final') ? 'final' as const :
          'assignment' as const,
    title: grade.grade_type,
    marks: grade.marks,
    totalMarks: 100, // Default to 100, could be enhanced later
    date: new Date().toISOString().split('T')[0], // Current date as default
    percentage: grade.marks // Assuming marks are already percentages
  }))

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  }

  // Transform API announcements to match component expectations
  const transformedAnnouncements = courseAnnouncements.map(announcement => ({
    id: announcement.announcement_id.toString(),
    title: announcement.title,
    content: announcement.content,
    type: announcement.type,
    createdAt: formatTimeAgo(announcement.created_at),
    instructor: `Instructor ${announcement.section_sec_number}` // Placeholder
  }))

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <StudentSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading courses...</p>
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
        <StudentSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Error Loading Courses</h3>
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
      <StudentSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Classes</h1>
            <p className="text-muted-foreground">View your enrolled courses, grades, and announcements</p>
          </div>

          {/* Course Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Course Selection</span>
              </CardTitle>
              <CardDescription>Select a course to view details, grades, and announcements</CardDescription>
            </CardHeader>
            <CardContent>
              <CourseSelector
                courses={courses}
                selectedCourse={selectedCourse}
                onCourseChange={setSelectedCourse}
              />
            </CardContent>
          </Card>

          {/* Course Details */}
          {selectedCourse && selectedCourseData && (
            <Tabs defaultValue="grades" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="grades" className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Grades</span>
                </TabsTrigger>
                <TabsTrigger value="announcements" className="flex items-center space-x-2">
                  <Megaphone className="h-4 w-4" />
                  <span>Announcements</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="grades">
                <Card>
                  <CardHeader>
                    <CardTitle>Grade Sheet - {selectedCourseData.name}</CardTitle>
                    <CardDescription>
                      View your grades for {selectedCourseData.code} Section {selectedCourseData.section}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {gradesLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <span className="ml-2 text-muted-foreground">Loading grades...</span>
                      </div>
                    ) : convertedGrades.length === 0 ? (
                      <div className="text-center py-8">
                        <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No grades recorded yet.</p>
                        <p className="text-sm text-muted-foreground">Your instructor will add grades as they become available.</p>
                      </div>
                    ) : (
                      <GradeTable grades={convertedGrades} courseCode={selectedCourseData.code} />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="announcements">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Announcements - {selectedCourseData.name}</CardTitle>
                    <CardDescription>Latest announcements from {selectedCourseData.instructor}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ClassAnnouncements announcements={transformedAnnouncements} courseCode={selectedCourseData.code} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          {/* Empty State */}
          {!selectedCourse && (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  {courses.length === 0 ? (
                    <>
                      <h3 className="text-lg font-semibold text-foreground mb-2">No Enrolled Courses</h3>
                      <p className="text-muted-foreground">
                        You are not currently enrolled in any courses. Contact your advisor to enroll in courses.
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Select a Course</h3>
                      <p className="text-muted-foreground">
                        Choose a course from the dropdown above to view grades and announcements.
                      </p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
