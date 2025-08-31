"use client"

import { useState, useEffect } from "react"
import { FacultySidebar } from "@/components/faculty-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { BookOpen, Plus, Users, Clock, MapPin, Calendar } from "lucide-react"
import { 
  getSections, 
  getCourses, 
  assignSection, 
  getFacultySections,
  type Section,
  type Course,
  type FacultySection 
} from "@/lib/api/courses"
import { getCurrentUser } from "@/lib/auth"

export default function FacultySelectCoursesPage() {
  const [sections, setSections] = useState<Section[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [facultySections, setFacultySections] = useState<FacultySection[]>([])
  const [selectedCourse, setSelectedCourse] = useState<string>("")
  const [selectedSection, setSelectedSection] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [isAssigning, setIsAssigning] = useState(false)
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

  // Debug state changes
  useEffect(() => {
    console.log('Sections state changed:', sections)
  }, [sections])

  useEffect(() => {
    console.log('Courses state changed:', courses)
  }, [courses])

  useEffect(() => {
    console.log('Faculty sections state changed:', facultySections)
  }, [facultySections])

  const loadData = async () => {
    setIsLoading(true)
    
    try {
      // Load sections first
      try {
        const sectionsData = await getSections()
        console.log('Loaded sections:', sectionsData)
        setSections(sectionsData)
        console.log('Sections state set to:', sectionsData)
      } catch (error) {
        console.error('Failed to load sections:', error)
        toast.error('Failed to load sections')
      }

      // Load courses independently
      try {
        const coursesData = await getCourses()
        console.log('Loaded courses:', coursesData)
        setCourses(coursesData)
        console.log('Courses state set to:', coursesData)
      } catch (error) {
        console.error('Failed to load courses:', error)
        toast.error('Failed to load courses')
      }

      // Load faculty sections independently
      try {
        const facultySectionsData = await getFacultySections(user?.user_id || 0)
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

  const handleAssignSection = async () => {
    if (!selectedCourse || !selectedSection) {
      toast.error('Please select both a course and section')
      return
    }

    setIsAssigning(true)
    try {
      const sectionNumber = parseInt(selectedSection)
      const response = await assignSection({
        course_code: selectedCourse,
        sec_number: sectionNumber
      })

      // Add the new assignment to the faculty sections list
      setFacultySections(prev => [...prev, response])
      
      // Reset form
      setSelectedCourse("")
      setSelectedSection("")
      
      toast.success(`Successfully assigned to ${selectedCourse} Section ${selectedSection}`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to assign section'
      toast.error(errorMessage)
    } finally {
      setIsAssigning(false)
    }
  }

  const getCourseName = (courseCode: string) => {
    const course = courses.find(c => c.course_code === courseCode)
    return course ? course.course_name : courseCode
  }

  const isAlreadyAssigned = (courseCode: string, secNumber: number) => {
    return facultySections.some(fs => 
      fs.course_code === courseCode && fs.sec_number === secNumber
    )
  }

  const getAvailableSections = () => {
    if (!selectedCourse) return []
    const availableSections = sections.filter(section => section.course_code === selectedCourse)
    console.log('Selected course:', selectedCourse)
    console.log('All sections:', sections)
    console.log('Available sections:', availableSections)
    return availableSections
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <FacultySidebar />
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
      <FacultySidebar />
      <main className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Select Courses</h1>
            <p className="text-muted-foreground">Choose which sections you want to teach</p>
          </div>


           {/* Assignment Form */}
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Assign New Section</span>
              </CardTitle>
              <CardDescription>
                Select a course and section to assign yourself as the instructor
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
                           const isAssigned = isAlreadyAssigned(section.course_code, section.sec_number)
                           return (
                             <SelectItem 
                               key={`${section.course_code}-${section.sec_number}`} 
                               value={section.sec_number.toString()}
                               disabled={isAssigned}
                             >
                               Section {section.sec_number}
                               {isAssigned && " (Already Assigned)"}
                             </SelectItem>
                           )
                         })
                       )}
                     </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleAssignSection}
                disabled={!selectedCourse || !selectedSection || isAssigning}
                className="w-full md:w-auto"
              >
                {isAssigning ? "Assigning..." : "Assign Section"}
              </Button>
            </CardContent>
          </Card>

          {/* Current Assignments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Your Current Sections</span>
              </CardTitle>
              <CardDescription>
                Sections you are currently assigned to teach
              </CardDescription>
            </CardHeader>
            <CardContent>
              {facultySections.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>You haven't been assigned to any sections yet.</p>
                  <p className="text-sm">Use the form above to assign yourself to sections.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {facultySections.map((fs) => {
                    const section = sections.find(s => 
                      s.course_code === fs.course_code && s.sec_number === fs.sec_number
                    )
                    return (
                      <Card key={`${fs.course_code}-${fs.sec_number}`} className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="text-sm">
                              {fs.course_code}
                            </Badge>
                            <Badge variant="outline">
                              Section {fs.sec_number}
                            </Badge>
                          </div>
                          
                          <h4 className="font-medium">{getCourseName(fs.course_code)}</h4>
                          
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
                Overview of all sections across all courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courses.map((course) => {
                  const courseSections = sections.filter(s => s.course_code === course.course_code)
                  return (
                    <div key={course.course_code} className="border rounded-lg p-4">
                      <h4 className="font-medium mb-3">
                        {course.course_code} - {course.course_name}
                      </h4>
                                             <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-1">
                         {courseSections.map((section) => {
                           const isAssigned = isAlreadyAssigned(course.course_code, section.sec_number)
                           return (
                             <div
                               key={`${course.course_code}-${section.sec_number}`}
                               className={`p-1.5 rounded border text-xs ${
                                 isAssigned 
                                   ? 'bg-green-50 border-green-200 text-green-700' 
                                   : 'bg-gray-50 border-gray-200 text-gray-700'
                               }`}
                             >
                               <div className="font-medium text-center">S{section.sec_number}</div>
                               <div className="text-xs opacity-75 text-center">
                                 {section.day_of_week.slice(0, 3)}
                               </div>
                               {isAssigned && (
                                 <div className="text-xs font-medium text-green-600 text-center mt-0.5">
                                   ✓
                                 </div>
                               )}
                             </div>
                           )
                         })}
                       </div>
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
