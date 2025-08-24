"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users } from "lucide-react"

interface FacultyCourse {
  code: string
  name: string
  sections: string[]
}

interface FacultyCourseSelectorProps {
  courses: FacultyCourse[]
  selectedCourse: string | null
  selectedSection: string | null
  onCourseChange: (courseCode: string) => void
  onSectionChange: (section: string) => void
}

export function FacultyCourseSelector({
  courses,
  selectedCourse,
  selectedSection,
  onCourseChange,
  onSectionChange,
}: FacultyCourseSelectorProps) {
  const selectedCourseData = courses.find((c) => c.code === selectedCourse)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Course Selection */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Select Course</label>
          <Select value={selectedCourse || ""} onValueChange={onCourseChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a course..." />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course.code} value={course.code}>
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4" />
                    <span className="font-medium">{course.code}</span>
                    <span className="text-muted-foreground">- {course.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Section Selection */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Select Section</label>
          <Select value={selectedSection || ""} onValueChange={onSectionChange} disabled={!selectedCourse}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a section..." />
            </SelectTrigger>
            <SelectContent>
              {selectedCourseData?.sections.map((section) => (
                <SelectItem key={section} value={section}>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Section {section}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Selected Course Info */}
      {selectedCourse && selectedSection && selectedCourseData && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{selectedCourseData.name}</CardTitle>
            <CardDescription>
              {selectedCourse} - Section {selectedSection}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-chart-1 border-chart-1">
                {selectedCourse}
              </Badge>
              <Badge variant="outline" className="text-chart-2 border-chart-2">
                Section {selectedSection}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
