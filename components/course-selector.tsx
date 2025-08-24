"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface Course {
  code: string
  name: string
  section: string
  instructor: string
}

interface CourseSelectorProps {
  courses: Course[]
  selectedCourse: string | null
  onCourseChange: (courseId: string) => void
}

export function CourseSelector({ courses, selectedCourse, onCourseChange }: CourseSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Select Course</label>
        <Select value={selectedCourse || ""} onValueChange={onCourseChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose a course..." />
          </SelectTrigger>
          <SelectContent>
            {courses.map((course) => (
              <SelectItem key={`${course.code}-${course.section}`} value={`${course.code}-${course.section}`}>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{course.code}</span>
                  <Badge variant="outline" className="text-xs">
                    Sec {course.section}
                  </Badge>
                  <span className="text-muted-foreground">- {course.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedCourse && (
        <div className="p-4 bg-muted/50 rounded-lg">
          {(() => {
            const course = courses.find((c) => `${c.code}-${c.section}` === selectedCourse)
            return course ? (
              <div>
                <h3 className="font-semibold text-foreground">{course.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {course.code} - Section {course.section} | Instructor: {course.instructor}
                </p>
              </div>
            ) : null
          })()}
        </div>
      )}
    </div>
  )
}
