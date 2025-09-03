"use client"

import { useState, useEffect } from "react"
import { StudentSidebar } from "@/components/student-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { BookOpen, Plus, Users, Clock, MapPin, Calendar, GraduationCap } from "lucide-react"
import { 
  getSections, 
  getCourses, 
  assignStudentSection, 
  getStudentSections,
  getAllFacultySections,
  type Section,
  type Course,
  type StudentSection,
  type FacultySection
} from "@/lib/api/courses"
import { getCurrentUser } from "@/lib/auth"

export default function StudentSelectCoursesPage() {
  const [sections, setSections] = useState<Section[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [studentSections, setStudentSections] = useState<StudentSection[]>([])
  const [facultySections, setFacultySections] = useState<FacultySection[]>([])
  const [selectedCourse, setSelectedCourse] = useState<string>("")
  const [selectedSection, setSelectedSection] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [isEnrolling, setIsEnrolling] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }
  }, [])

  useEffect(() => {
    if (user) {
      console.log('User loaded, starting data load for user ID:', user.user_id)
      loadData()
    }
  }, [user])

  const loadData = async () => {
    setIsLoading(true)
    
    try {
      // Load sections first
      try {
        const sectionsData = await getSections()
        console.log('Loaded sections:', sectionsData)
        setSections(sectionsData)
      } catch (error) {
        console.error('Failed to load sections:', error)
        toast.error('Failed to load sections')
      }

      // Load courses independently
      try {
        const coursesData = await getCourses()
        console.log('Loaded courses:', coursesData)
        setCourses(coursesData)
      } catch (error) {
        console.error('Failed to load courses:', error)
        toast.error('Failed to load courses')
      }

      // Load student sections independently
      try {
        const studentSectionsData = await getStudentSections(user?.user_id || 0)
        console.log('Loaded student sections:', studentSectionsData)
        setStudentSections(studentSectionsData)
      } catch (error) {
        console.error('Failed to load student sections:', error)
        toast.error('Failed to load student sections')
      }

      // Load faculty sections to know which sections have faculty assigned
      try {
        const facultySectionsData = await getAllFacultySections() // Get all faculty sections
        console.log('Loaded faculty sections:', facultySectionsData)
        setFacultySections(facultySectionsData)
      } catch (error) {
        console.error('Failed to load faculty sections:', error)
        toast.error('Failed to load faculty sections')
      }
      
    } catch (error) {
      console.error('Unexpected error in loadData:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEnrollSection = async () => {
    if (!selectedCourse || !selectedSection) {
      toast.error('Please select both a course and section')
      return
    }

    setIsEnrolling(true)
    try {
      const sectionNumber = parseInt(selectedSection)
      const response = await assignStudentSection({
        course_code: selectedCourse,
        sec_number: sectionNumber
      })

      // Add the new enrollment to the student sections list
      setStudentSections(prev => [...prev, response])
      
      // Reset form
      setSelectedCourse("")
      setSelectedSection("")
      
      toast.success(`Successfully enrolled in ${selectedCourse} Section ${selectedSection}`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to enroll in section'
      toast.error(errorMessage)
    } finally {
      setIsEnrolling(false)
    }
  }

  const getCourseName = (courseCode: string) => {
    const course = courses.find(c => c.course_code === courseCode)
    return course ? course.course_name : courseCode
  }

  const isAlreadyEnrolled = (courseCode: string, secNumber: number) => {
    return studentSections.some(ss => 
      ss.course_code === courseCode && ss.sec_number === secNumber
    )
  }

  const getAvailableSections = () => {
    if (!selectedCourse) return []
    // Only show sections that have faculty assigned to them
    const sectionsWithFaculty = facultySections
      .filter(fs => fs.course_code === selectedCourse)
      .map(fs => fs.sec_number)
    
    const availableSections = sections.filter(section => 
      section.course_code === selectedCourse && 
      sectionsWithFaculty.includes(section.sec_number)
    )
    return availableSections
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <StudentSidebar />
        <main className="flex-1 overflow-auto p-6">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading courses and sections...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <StudentSidebar />
      <main className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Course Registration</h1>
            <p className="text-muted-foreground">Enroll in courses and sections that have faculty assigned</p>
          </div>

          {/* Enrollment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Enroll in New Section</span>
              </CardTitle>
              <CardDescription>
                Select a course and section (with faculty assigned) to enroll as a student
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Course</label>
                  <Select value={selectedCourse} onValueChange={(value) => {
                    console.log('Course selected:', value)
                    setSelectedCourse(value)
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.length === 0 ? (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground">
                          No items
                        </div>
                      ) : (
                        courses.map((course) => (
                          <SelectItem key={course.course_code} value={course.course_code}>
                            {course.course_code} - {course.course_name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Section</label>
                  <Select 
                    value={selectedSection} 
                    onValueChange={(value) => {
                      console.log('Section selected:', value)
                      setSelectedSection(value)
                    }}
                    disabled={!selectedCourse}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a section" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableSections().length === 0 ? (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground">
                          No items
                        </div>
                      ) : (
                        getAvailableSections().map((section) => {
                          const isEnrolled = isAlreadyEnrolled(section.course_code, section.sec_number)
                          return (
                            <SelectItem 
                              key={`${section.course_code}-${section.sec_number}`} 
                              value={section.sec_number.toString()}
                              disabled={isEnrolled}
                            >
                              Section {section.sec_number}
                              {isEnrolled && " (Already Enrolled)"}
                            </SelectItem>
                          )
                        })
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleEnrollSection}
                disabled={!selectedCourse || !selectedSection || isEnrolling}
                className="w-full md:w-auto"
              >
                {isEnrolling ? "Enrolling..." : "Enroll in Section"}
              </Button>
            </CardContent>
          </Card>

          {/* Current Enrollments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5" />
                <span>Your Enrolled Courses</span>
              </CardTitle>
              <CardDescription>
                Courses and sections you are currently enrolled in
              </CardDescription>
            </CardHeader>
            <CardContent>
              {studentSections.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>You haven't enrolled in any courses yet.</p>
                  <p className="text-sm">Use the form above to enroll in courses.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {studentSections.map((ss) => {
                    const section = sections.find(s => 
                      s.course_code === ss.course_code && s.sec_number === ss.sec_number
                    )
                    return (
                      <Card key={`${ss.course_code}-${ss.sec_number}`} className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="text-sm">
                              {ss.course_code}
                            </Badge>
                            <Badge variant="outline">
                              Section {ss.sec_number}
                            </Badge>
                          </div>
                          
                          <h4 className="font-medium">{getCourseName(ss.course_code)}</h4>
                          
                          {section && (
                            <div className="space-y-2 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4" />
                                <span>{section.start_time} - {section.end_time}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4" />
                                <span>{section.day_of_week}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4" />
                                <span>{section.location}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </Card>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Available Sections Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>All Available Sections</span>
              </CardTitle>
              <CardDescription>
                Overview of all sections with faculty assigned across all courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courses.map((course) => {
                  // Only show sections that have faculty assigned
                  const sectionsWithFaculty = facultySections
                    .filter(fs => fs.course_code === course.course_code)
                    .map(fs => fs.sec_number)
                  
                  const courseSections = sections.filter(s => 
                    s.course_code === course.course_code && 
                    sectionsWithFaculty.includes(s.sec_number)
                  )
                  
                  return (
                    <div key={course.course_code} className="border rounded-lg p-4">
                      <h4 className="font-medium mb-3">
                        {course.course_code} - {course.course_name}
                      </h4>
                      {courseSections.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No sections with faculty assigned</p>
                      ) : (
                        <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-1">
                          {courseSections.map((section) => {
                            const isEnrolled = isAlreadyEnrolled(course.course_code, section.sec_number)
                            return (
                              <div
                                key={`${course.course_code}-${section.sec_number}`}
                                className={`p-1.5 rounded border text-xs ${
                                  isEnrolled 
                                    ? 'bg-blue-50 border-blue-200 text-blue-700' 
                                    : 'bg-gray-50 border-gray-200 text-gray-700'
                                }`}
                              >
                                <div className="font-medium text-center">S{section.sec_number}</div>
                                <div className="text-xs opacity-75 text-center">
                                  {section.day_of_week.slice(0, 3)}
                                </div>
                                {isEnrolled && (
                                  <div className="text-xs font-medium text-blue-600 text-center mt-0.5">
                                    ✓
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
