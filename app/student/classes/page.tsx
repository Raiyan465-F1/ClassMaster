"use client"

import { useState } from "react"
import { StudentSidebar } from "@/components/student-sidebar"
import { CourseSelector } from "@/components/course-selector"
import { GradeTable } from "@/components/grade-table"
import { ClassAnnouncements } from "@/components/class-announcements"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, BarChart3, Megaphone } from "lucide-react"

// Mock data - in real app this would come from API
const mockCourses = [
  {
    code: "CSE101",
    name: "Introduction to Programming",
    section: "A",
    instructor: "Dr. Smith",
  },
  {
    code: "CSE201",
    name: "Database Systems",
    section: "B",
    instructor: "Prof. Johnson",
  },
  {
    code: "CSE301",
    name: "Data Structures",
    section: "A",
    instructor: "Dr. Williams",
  },
  {
    code: "CSE401",
    name: "Software Engineering",
    section: "C",
    instructor: "Prof. Brown",
  },
]

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

const mockAnnouncements = {
  "CSE201-B": [
    {
      id: "1",
      title: "Quiz 3 Scheduled",
      content: "Quiz 3 on Normalization will be held next Tuesday. Please review chapters 7-8 from the textbook.",
      type: "quiz" as const,
      createdAt: "2 hours ago",
      instructor: "Prof. Johnson",
    },
    {
      id: "2",
      title: "Assignment 2 Released",
      content:
        "Assignment 2 on Query Optimization is now available. Due date is February 28th. Please check the course portal for detailed requirements.",
      type: "assignment" as const,
      createdAt: "1 day ago",
      instructor: "Prof. Johnson",
    },
    {
      id: "3",
      title: "Office Hours Update",
      content: "My office hours for this week have been moved to Thursday 2-4 PM due to a faculty meeting.",
      type: "general" as const,
      createdAt: "3 days ago",
      instructor: "Prof. Johnson",
    },
  ],
  "CSE301-A": [
    {
      id: "4",
      title: "Lab Session Rescheduled",
      content:
        "Tomorrow's lab session has been moved to Friday 10 AM in Lab 2. We will be covering tree traversal algorithms.",
      type: "general" as const,
      createdAt: "5 hours ago",
      instructor: "Dr. Williams",
    },
  ],
}

export default function StudentClasses() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)

  const selectedCourseData = selectedCourse
    ? mockCourses.find((c) => `${c.code}-${c.section}` === selectedCourse)
    : null
  const courseGrades = selectedCourse ? mockGrades[selectedCourse as keyof typeof mockGrades] || [] : []
  const courseAnnouncements = selectedCourse
    ? mockAnnouncements[selectedCourse as keyof typeof mockAnnouncements] || []
    : []

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
                courses={mockCourses}
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
                    <GradeTable grades={courseGrades} courseCode={selectedCourseData.code} />
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
                    <ClassAnnouncements announcements={courseAnnouncements} courseCode={selectedCourseData.code} />
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
                  <h3 className="text-lg font-semibold text-foreground mb-2">Select a Course</h3>
                  <p className="text-muted-foreground">
                    Choose a course from the dropdown above to view grades and announcements.
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
