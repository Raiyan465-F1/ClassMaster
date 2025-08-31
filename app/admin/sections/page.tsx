"use client"

import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, BookOpen, Clock } from "lucide-react"
import { toast } from "sonner"
import { 
  getCourses, 
  getSections,
  createCourse,
  createSection,
  type Course, 
  type CreateCourseRequest,
  type Section,
  type CreateSectionRequest
} from "@/lib/api"

export default function AdminSections() {
  const [courses, setCourses] = useState<Course[]>([])
  const [sections, setSections] = useState<Section[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false)
  const [isCreateSectionOpen, setIsCreateSectionOpen] = useState(false)
  const [editingSection, setEditingSection] = useState<Section | null>(null)

  // Form states
  const [courseForm, setCourseForm] = useState<CreateCourseRequest>({
    course_code: "",
    course_name: ""
  })

  const [sectionForm, setSectionForm] = useState<CreateSectionRequest>({
    course_code: "",
    sec_number: 1,
    start_time: "",
    end_time: "",
    day_of_week: "",
    location: ""
  })

  // Load data on component mount
  useEffect(() => {
    let isMounted = true
    
    const loadDataSafely = async () => {
      setIsLoading(true)
      
      try {
        const coursesData = await getCourses()
        if (coursesData && isMounted) {
          setCourses(coursesData)
        }
      } catch (error) {
        console.error('Failed to load courses:', error)
      }
      
      try {
        const sectionsData = await getSections()
        if (sectionsData && isMounted) {
          setSections(sectionsData)
        }
      } catch (error) {
        console.error('Failed to load sections:', error)
      }
      
      if (isMounted) {
        setIsLoading(false)
      }
    }
    
    loadDataSafely()
    
    return () => {
      isMounted = false
    }
  }, [])



  // Course management
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!courseForm.course_code || !courseForm.course_name) {
      toast.error("Please fill in all course fields")
      return
    }

    setIsLoading(true)
    try {
      const newCourse = await createCourse(courseForm)
      setCourses(prev => [...prev, newCourse])
      setCourseForm({ course_code: "", course_name: "" })
      setIsCreateCourseOpen(false)
      toast.success("Course created successfully!")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create course"
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Section management
  const handleCreateSection = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!sectionForm.course_code || !sectionForm.start_time || !sectionForm.end_time || 
        !sectionForm.day_of_week || !sectionForm.location) {
      toast.error("Please fill in all section fields")
      return
    }

    setIsLoading(true)
    try {
      // Format time to HH:MM:SS format as expected by backend
      const formatTime = (time: string) => time.includes(':') && time.split(':').length === 2 ? time + ':00' : time
      
      const sectionData: CreateSectionRequest = {
        ...sectionForm,
        start_time: formatTime(sectionForm.start_time),
        end_time: formatTime(sectionForm.end_time)
      }
      
      const newSection = await createSection(sectionData)
      setSections(prev => [...prev, newSection])
      setSectionForm({
        course_code: "",
        sec_number: 1,
        start_time: "",
        end_time: "",
        day_of_week: "",
        location: ""
      })
      setIsCreateSectionOpen(false)
      toast.success("Section created successfully!")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create section"
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteSection = async (courseCode: string, secNumber: number) => {
    if (!confirm("Are you sure you want to delete this section?")) return

    // TODO: Implement delete section API
    toast.info("Delete section functionality will be implemented when you provide the API endpoint.")
  }

  const daysOfWeek = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ]

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Course Sections</h1>
              <p className="text-muted-foreground">Manage courses and their sections</p>
            </div>
            <div className="flex space-x-2">
              <Dialog open={isCreateCourseOpen} onOpenChange={setIsCreateCourseOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Course
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Course</DialogTitle>
                    <DialogDescription>
                      Add a new course to the system
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateCourse} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="course_code">Course Code</Label>
                      <Input
                        id="course_code"
                        placeholder="e.g., CSE101"
                        value={courseForm.course_code}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, course_code: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="course_name">Course Name</Label>
                      <Input
                        id="course_name"
                        placeholder="e.g., Introduction to Programming"
                        value={courseForm.course_name}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, course_name: e.target.value }))}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Creating..." : "Create Course"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={isCreateSectionOpen} onOpenChange={setIsCreateSectionOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    disabled={courses.length === 0}
                    title={courses.length === 0 ? "Create a course first to add sections" : "Add a new section"}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Section
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Section</DialogTitle>
                    <DialogDescription>
                      Add a new section to a course
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateSection} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="section_course_code">Course</Label>
                      <Select
                        value={sectionForm.course_code}
                        onValueChange={(value) => setSectionForm(prev => ({ ...prev, course_code: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a course" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.length === 0 ? (
                            <SelectItem value="" disabled>
                              No courses available. Create a course first.
                            </SelectItem>
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
                      <Label htmlFor="sec_number">Section Number</Label>
                      <Input
                        id="sec_number"
                        type="number"
                        min="1"
                        value={sectionForm.sec_number}
                        onChange={(e) => setSectionForm(prev => ({ ...prev, sec_number: parseInt(e.target.value) || 1 }))}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="start_time">Start Time</Label>
                        <Input
                          id="start_time"
                          type="time"
                          value={sectionForm.start_time}
                          onChange={(e) => setSectionForm(prev => ({ ...prev, start_time: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="end_time">End Time</Label>
                        <Input
                          id="end_time"
                          type="time"
                          value={sectionForm.end_time}
                          onChange={(e) => setSectionForm(prev => ({ ...prev, end_time: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="day_of_week">Day of Week</Label>
                      <Select
                        value={sectionForm.day_of_week}
                        onValueChange={(value) => setSectionForm(prev => ({ ...prev, day_of_week: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                          {daysOfWeek.map((day) => (
                            <SelectItem key={day} value={day}>
                              {day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="e.g., Room 101"
                        value={sectionForm.location}
                        onChange={(e) => setSectionForm(prev => ({ ...prev, location: e.target.value }))}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Creating..." : "Create Section"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="sections" className="space-y-4">
            <TabsList>
              <TabsTrigger value="sections">Sections</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
            </TabsList>

            <TabsContent value="sections" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Course Sections
                  </CardTitle>
                  <CardDescription>
                    Manage course sections and schedules
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-4">Loading sections...</div>
                  ) : sections.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No sections found. Create your first section above.
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Course</TableHead>
                          <TableHead>Section</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Day</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sections.map((section) => (
                          <TableRow key={`${section.course_code}-${section.sec_number}`}>
                            <TableCell className="font-medium">{section.course_code}</TableCell>
                            <TableCell>{section.sec_number}</TableCell>
                            <TableCell>{section.start_time} - {section.end_time}</TableCell>
                            <TableCell>{section.day_of_week}</TableCell>
                            <TableCell>{section.location}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setEditingSection(section)}
                                  disabled
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteSection(section.course_code, section.sec_number)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="courses" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Courses
                  </CardTitle>
                  <CardDescription>
                    View all available courses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-4">Loading courses...</div>
                  ) : courses.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No courses found. Create your first course above.
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Course Code</TableHead>
                          <TableHead>Course Name</TableHead>
                          <TableHead>Sections</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {courses.map((course) => {
                          const courseSections = sections.filter(s => s.course_code === course.course_code)
                          return (
                            <TableRow key={course.course_code}>
                              <TableCell className="font-medium">{course.course_code}</TableCell>
                              <TableCell>{course.course_name}</TableCell>
                              <TableCell>{courseSections.length} sections</TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
