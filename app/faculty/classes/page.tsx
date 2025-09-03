"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { FacultySidebar } from "@/components/faculty-sidebar"
import { FacultyCourseSelector } from "@/components/faculty-course-selector"
import { GradeUpload } from "@/components/grade-upload"
import { GradeTable } from "@/components/grade-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, BarChart3, Users, BarChart } from "lucide-react"

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

// Sample grade data with student information
const mockGrades = {
  "CSE201-A": [
    { id: "1", studentId: "1", studentName: "Alice Johnson", type: "quiz" as const, title: "Quiz 1: Database Basics", marks: 18, totalMarks: 20, date: "2024-01-15", percentage: 90 },
    { id: "2", studentId: "1", studentName: "Alice Johnson", type: "assignment" as const, title: "Assignment 1: ER Diagrams", marks: 85, totalMarks: 100, date: "2024-01-20", percentage: 85 },
    { id: "3", studentId: "1", studentName: "Alice Johnson", type: "attendance" as const, title: "Class Participation", marks: 9, totalMarks: 10, date: "2024-02-05", percentage: 90 },
    { id: "4", studentId: "1", studentName: "Alice Johnson", type: "midterm" as const, title: "Midterm Exam", marks: 42, totalMarks: 50, date: "2024-02-01", percentage: 84 },
    { id: "5", studentId: "2", studentName: "Bob Smith", type: "quiz" as const, title: "Quiz 1: Database Basics", marks: 16, totalMarks: 20, date: "2024-01-15", percentage: 80 },
    { id: "6", studentId: "2", studentName: "Bob Smith", type: "assignment" as const, title: "Assignment 1: ER Diagrams", marks: 78, totalMarks: 100, date: "2024-01-20", percentage: 78 },
    { id: "7", studentId: "2", studentName: "Bob Smith", type: "attendance" as const, title: "Class Participation", marks: 8, totalMarks: 10, date: "2024-02-05", percentage: 80 },
    { id: "8", studentId: "2", studentName: "Bob Smith", type: "midterm" as const, title: "Midterm Exam", marks: 38, totalMarks: 50, date: "2024-02-01", percentage: 76 },
    { id: "9", studentId: "3", studentName: "Carol Davis", type: "quiz" as const, title: "Quiz 1: Database Basics", marks: 19, totalMarks: 20, date: "2024-01-15", percentage: 95 },
    { id: "10", studentId: "3", studentName: "Carol Davis", type: "assignment" as const, title: "Assignment 1: ER Diagrams", marks: 92, totalMarks: 100, date: "2024-01-20", percentage: 92 },
    { id: "11", studentId: "3", studentName: "Carol Davis", type: "attendance" as const, title: "Class Participation", marks: 10, totalMarks: 10, date: "2024-02-05", percentage: 100 },
    { id: "12", studentId: "3", studentName: "Carol Davis", type: "midterm" as const, title: "Midterm Exam", marks: 45, totalMarks: 50, date: "2024-02-01", percentage: 90 },
  ],
  "CSE201-B": [
    { id: "13", studentId: "4", studentName: "David Wilson", type: "quiz" as const, title: "Quiz 1: Database Basics", marks: 17, totalMarks: 20, date: "2024-01-15", percentage: 85 },
    { id: "14", studentId: "4", studentName: "David Wilson", type: "assignment" as const, title: "Assignment 1: ER Diagrams", marks: 82, totalMarks: 100, date: "2024-01-20", percentage: 82 },
    { id: "15", studentId: "4", studentName: "David Wilson", type: "attendance" as const, title: "Class Participation", marks: 9, totalMarks: 10, date: "2024-02-05", percentage: 90 },
    { id: "16", studentId: "4", studentName: "David Wilson", type: "midterm" as const, title: "Midterm Exam", marks: 40, totalMarks: 50, date: "2024-02-01", percentage: 80 },
    { id: "17", studentId: "5", studentName: "Eva Brown", type: "quiz" as const, title: "Quiz 1: Database Basics", marks: 15, totalMarks: 20, date: "2024-01-15", percentage: 75 },
    { id: "18", studentId: "5", studentName: "Eva Brown", type: "assignment" as const, title: "Assignment 1: ER Diagrams", marks: 75, totalMarks: 100, date: "2024-01-20", percentage: 75 },
    { id: "19", studentId: "5", studentName: "Eva Brown", type: "attendance" as const, title: "Class Participation", marks: 7, totalMarks: 10, date: "2024-02-05", percentage: 70 },
    { id: "20", studentId: "5", studentName: "Eva Brown", type: "midterm" as const, title: "Midterm Exam", marks: 35, totalMarks: 50, date: "2024-02-01", percentage: 70 },
    { id: "21", studentId: "6", studentName: "Frank Miller", type: "quiz" as const, title: "Quiz 1: Database Basics", marks: 14, totalMarks: 20, date: "2024-01-15", percentage: 70 },
    { id: "22", studentId: "6", studentName: "Frank Miller", type: "assignment" as const, title: "Assignment 1: ER Diagrams", marks: 70, totalMarks: 100, date: "2024-01-20", percentage: 70 },
    { id: "23", studentId: "6", studentName: "Frank Miller", type: "attendance" as const, title: "Class Participation", marks: 6, totalMarks: 10, date: "2024-02-05", percentage: 60 },
    { id: "24", studentId: "6", studentName: "Frank Miller", type: "midterm" as const, title: "Midterm Exam", marks: 32, totalMarks: 50, date: "2024-02-01", percentage: 64 },
  ]
}

export default function FacultyClasses() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const courseParam = searchParams.get("course")
    const sectionParam = searchParams.get("section")

    if (courseParam && sectionParam) {
      setSelectedCourse(courseParam)
      setSelectedSection(sectionParam)
    }
  }, [searchParams])

  // Update URL when selections change
  useEffect(() => {
    if (selectedCourse && selectedSection) {
      const url = new URL(window.location.href)
      url.searchParams.set("course", selectedCourse)
      url.searchParams.set("section", selectedSection)
      window.history.replaceState({}, "", url.toString())
    }
  }, [selectedCourse, selectedSection])

  const selectedCourseData = selectedCourse ? mockFacultyCourses.find((c) => c.code === selectedCourse) : null

  const courseKey = selectedCourse && selectedSection ? `${selectedCourse}-${selectedSection}` : null
  const students = courseKey ? mockStudents[courseKey as keyof typeof mockStudents] || [] : []
  const grades = courseKey ? mockGrades[courseKey as keyof typeof mockGrades] || [] : []

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
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="gradesheet" className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Gradesheet</span>
                </TabsTrigger>
                <TabsTrigger value="grades" className="flex items-center space-x-2">
                  <BarChart className="h-4 w-4" />
                  <span>Grades</span>
                </TabsTrigger>
                <TabsTrigger value="students" className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Students</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="gradesheet">
                <GradeUpload courseCode={selectedCourse} section={selectedSection} students={students} />
              </TabsContent>

              <TabsContent value="grades">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Grades - {selectedCourseData.name}</CardTitle>
                    <CardDescription>
                      View and analyze grades for {selectedCourse} Section {selectedSection}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <GradeTable grades={grades} courseCode={selectedCourse} />
                  </CardContent>
                </Card>
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
