"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter } from "lucide-react"

interface Grade {
  id: string
  studentId: string
  studentName: string
  type: "quiz" | "assignment" | "attendance" | "midterm" | "final"
  title: string
  marks: number
  totalMarks: number
  date: string
  percentage: number
}

interface GradeTableProps {
  grades: Grade[]
  courseCode: string
}

export function GradeTable({ grades, courseCode }: GradeTableProps) {
  const [filterType, setFilterType] = useState<string>("all")

  const filteredGrades = filterType === "all" ? grades : grades.filter((grade) => grade.type === filterType)

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "bg-chart-4 text-background"
    if (percentage >= 80) return "bg-chart-1 text-background"
    if (percentage >= 70) return "bg-chart-2 text-background"
    if (percentage >= 60) return "bg-chart-5 text-background"
    return "bg-chart-3 text-background"
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "quiz":
        return "bg-chart-1/20 text-chart-1"
      case "assignment":
        return "bg-chart-2/20 text-chart-2"
      case "attendance":
        return "bg-chart-4/20 text-chart-4"
      case "midterm":
        return "bg-chart-5/20 text-chart-5"
      case "final":
        return "bg-chart-3/20 text-chart-3"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const calculateOverallGrade = () => {
    if (grades.length === 0) return 0
    const total = grades.reduce((sum, grade) => sum + grade.percentage, 0)
    return Math.round(total / grades.length)
  }

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grades</SelectItem>
              <SelectItem value="quiz">Quizzes</SelectItem>
              <SelectItem value="assignment">Assignments</SelectItem>
              <SelectItem value="attendance">Attendance</SelectItem>
              <SelectItem value="midterm">Midterm</SelectItem>
              <SelectItem value="final">Final</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Overall Grade</p>
            <Badge className={getGradeColor(calculateOverallGrade())} variant="secondary">
              {calculateOverallGrade()}%
            </Badge>
          </div>
        </div>
      </div>

      {/* Grades Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Student ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Assessment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Score</TableHead>
              <TableHead className="text-right">Percentage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGrades.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No grades found for the selected filter.
                </TableCell>
              </TableRow>
            ) : (
              filteredGrades.map((grade) => (
                <TableRow key={grade.id}>
                  <TableCell className="font-medium">{grade.studentName}</TableCell>
                  <TableCell className="font-medium">{grade.studentId}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getTypeColor(grade.type)}>
                      {grade.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{grade.title}</TableCell>
                  <TableCell className="text-muted-foreground">{grade.date}</TableCell>
                  <TableCell className="text-right">
                    {grade.marks}/{grade.totalMarks}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge className={getGradeColor(grade.percentage)} variant="secondary">
                      {grade.percentage}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
