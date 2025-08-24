"use client"

import { useState } from "react"
import { FacultySidebar } from "@/components/faculty-sidebar"
import { FacultyCourseSelector } from "@/components/faculty-course-selector"
import { GradeUpload } from "@/components/grade-upload"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, BarChart3, Users } from "lucide-react"

// Mock data
const mockFacultyCourses = [
  {
    code: "CSE201",
    name: "Database Systems",
    sections: ["A", "B"],
  },
  {
    code: "CSE301",
    name: "Data Structures",
    sections: ["A", "C"],
  },
  {
    code: "CSE401",
    name: "Software Engineering",
    sections: ["B", "C"],
  },
]

const mockStudents = {
  "CSE201-A": [
    { id: "1", name: "Alice Johnson", email: "alice@university.edu" },
    { id: "2", name: "Bob Smith", email: "bob@university.edu" },
    { id: "3", name: "Carol Davis", email: "carol@university.edu" },
  ],
  "CSE201-B": [
    { id: "4", name: "David Wilson", email: "david@university.edu" },
    { id: "5", name: "Eva Brown", email: "eva@university.edu" },
    { id: "6", name: "Frank Miller", email: "frank@university.edu" },
  ],
}

export default function FacultyClasses() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)

  const selectedCourseData = selectedCourse ? mockFacultyCourses.find((c) => c.code === selectedCourse) : null

  const courseKey = selectedCourse && selectedSection ? `${selectedCourse}-${selectedSection}` : null
  const students = courseKey ? mockStudents[courseKey as keyof typeof mockStudents] || [] : []

  const handleCourseChange = (courseCode: string) => {
    setSelectedCourse(courseCode)
    setSelectedSection(null) // Reset section when course changes
  }

  return (
    <div className="flex h-screen bg-background">
      <FacultySidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Classes</h1>
            <p className="text-muted-foreground">Manage your courses, sections, and student grades</p>
          </div>

          {/* Course and Section Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Course & Section Selection</span>
              </CardTitle>
              <CardDescription>Select a course and section to manage grades and students</CardDescription>
            </CardHeader>
            <CardContent>
              <FacultyCourseSelector
                courses={mockFacultyCourses}
                selectedCourse={selectedCourse}
                selectedSection={selectedSection}
                onCourseChange={handleCourseChange}
                onSectionChange={setSelectedSection}
              />
            </CardContent>
          </Card>

          {/* Course Management */}
          {selectedCourse && selectedSection && selectedCourseData && (
            <Tabs defaultValue="gradesheet" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="gradesheet" className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Gradesheet</span>
                </TabsTrigger>
                <TabsTrigger value="students" className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Students</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="gradesheet">
                <GradeUpload courseCode={selectedCourse} section={selectedSection} students={students} />
              </TabsContent>

              <TabsContent value="students">
                <Card>
                  <CardHeader>
                    <CardTitle>Enrolled Students - {selectedCourseData.name}</CardTitle>
                    <CardDescription>
                      Students enrolled in {selectedCourse} Section {selectedSection}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {students.length === 0 ? (
                        <div className="text-center py-8">
                          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">No students enrolled in this section.</p>
                        </div>
                      ) : (
                        students.map((student) => (
                          <div
                            key={student.id}
                            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                          >
                            <div>
                              <p className="font-medium text-foreground">{student.name}</p>
                              <p className="text-sm text-muted-foreground">{student.email}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Student ID: {student.id}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          {/* Empty State */}
          {(!selectedCourse || !selectedSection) && (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Select Course & Section</h3>
                  <p className="text-muted-foreground">
                    Choose a course and section from the dropdown above to manage grades and students.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
