"use client"

import { use } from "react"
import { StudentSidebar } from "@/components/student-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { GradeTable } from "@/components/grade-table"
import { ClassAnnouncements } from "@/components/class-announcements"

// Mock data for courses
const courses = {
  cs101: {
    id: "cs101",
    name: "Computer Science 101",
    code: "CS101",
    instructor: "Dr. Smith",
    section: "A",
    credits: 3,
  },
  math201: {
    id: "math201",
    name: "Calculus II",
    code: "MATH201",
    instructor: "Prof. Johnson",
    section: "B",
    credits: 4,
  },
  phys101: {
    id: "phys101",
    name: "Physics I",
    code: "PHYS101",
    instructor: "Dr. Wilson",
    section: "A",
    credits: 3,
  },
  eng102: {
    id: "eng102",
    name: "English Composition",
    code: "ENG102",
    instructor: "Prof. Davis",
    section: "C",
    credits: 3,
  },
}

export default function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params)
  const course = courses[courseId as keyof typeof courses]

  if (!course) {
    return (
      <div className="flex h-screen bg-background">
        <StudentSidebar />
        <main className="flex-1 p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Course Not Found</h1>
            <p className="text-muted-foreground">The requested course could not be found.</p>
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
          {/* Course Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground">{course.name}</h1>
              <Badge variant="secondary">
                {course.code} - Section {course.section}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Instructor: {course.instructor} • {course.credits} Credits
            </p>
          </div>

          {/* Course Content Tabs */}
          <Tabs defaultValue="grades" className="space-y-4">
            <TabsList>
              <TabsTrigger value="grades">Grades</TabsTrigger>
              <TabsTrigger value="announcements">Announcements</TabsTrigger>
            </TabsList>

            <TabsContent value="grades" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Grade Overview</CardTitle>
                  <CardDescription>View your grades and performance in {course.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <GradeTable courseId={courseId} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="announcements" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Course Announcements</CardTitle>
                  <CardDescription>Latest announcements for {course.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ClassAnnouncements courseId={courseId} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
