"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Upload, Save, FileSpreadsheet } from "lucide-react"

interface Student {
  id: string
  name: string
  email: string
}

interface GradeUploadProps {
  courseCode: string
  section: string
  students: Student[]
}

export function GradeUpload({ courseCode, section, students }: GradeUploadProps) {
  const [gradeType, setGradeType] = useState("")
  const [assessmentTitle, setAssessmentTitle] = useState("")
  const [totalMarks, setTotalMarks] = useState("")
  const [grades, setGrades] = useState<Record<string, string>>({})

  const handleGradeChange = (studentId: string, marks: string) => {
    setGrades((prev) => ({ ...prev, [studentId]: marks }))
  }

  const handleSaveGrades = () => {
    // Here you would typically save to backend
    console.log("Saving grades:", { gradeType, assessmentTitle, totalMarks, grades })
    alert("Grades saved successfully!")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Upload Grades - {courseCode} Section {section}
          </CardTitle>
          <CardDescription>Add or update student grades for assessments</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="manual" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              <TabsTrigger value="excel">Excel Upload</TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="space-y-4">
              {/* Assessment Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="gradeType">Grade Type</Label>
                  <Select value={gradeType} onValueChange={setGradeType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                      <SelectItem value="attendance">Attendance</SelectItem>
                      <SelectItem value="midterm">Midterm</SelectItem>
                      <SelectItem value="final">Final</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="assessmentTitle">Assessment Title</Label>
                  <Input
                    id="assessmentTitle"
                    value={assessmentTitle}
                    onChange={(e) => setAssessmentTitle(e.target.value)}
                    placeholder="e.g., Quiz 1: Database Design"
                  />
                </div>
                <div>
                  <Label htmlFor="totalMarks">Total Marks</Label>
                  <Input
                    id="totalMarks"
                    type="number"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(e.target.value)}
                    placeholder="e.g., 20"
                  />
                </div>
              </div>

              {/* Grade Entry Table */}
              {gradeType && assessmentTitle && totalMarks && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Enter Student Grades</h3>
                    <Badge variant="outline" className="text-chart-1 border-chart-1">
                      Total: {totalMarks} marks
                    </Badge>
                  </div>

                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead className="text-right">Marks Obtained</TableHead>
                          <TableHead className="text-right">Percentage</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students.map((student) => {
                          const marks = grades[student.id] || ""
                          const percentage =
                            marks && totalMarks
                              ? Math.round((Number.parseFloat(marks) / Number.parseFloat(totalMarks)) * 100)
                              : 0

                          return (
                            <TableRow key={student.id}>
                              <TableCell className="font-medium">{student.name}</TableCell>
                              <TableCell className="text-muted-foreground">{student.email}</TableCell>
                              <TableCell className="text-right">
                                <Input
                                  type="number"
                                  value={marks}
                                  onChange={(e) => handleGradeChange(student.id, e.target.value)}
                                  placeholder="0"
                                  className="w-20 text-right"
                                  max={totalMarks}
                                />
                              </TableCell>
                              <TableCell className="text-right">
                                {marks && (
                                  <Badge
                                    variant="secondary"
                                    className={
                                      percentage >= 90
                                        ? "bg-chart-4 text-background"
                                        : percentage >= 80
                                          ? "bg-chart-1 text-background"
                                          : percentage >= 70
                                            ? "bg-chart-2 text-background"
                                            : percentage >= 60
                                              ? "bg-chart-5 text-background"
                                              : "bg-chart-3 text-background"
                                    }
                                  >
                                    {percentage}%
                                  </Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSaveGrades} className="bg-chart-4 hover:bg-chart-4/90">
                      <Save className="h-4 w-4 mr-2" />
                      Save Grades
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="excel" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <FileSpreadsheet className="h-16 w-16 text-muted-foreground mx-auto" />
                    <div>
                      <h3 className="text-lg font-semibold">Upload Excel File</h3>
                      <p className="text-muted-foreground">Upload a spreadsheet with student grades</p>
                    </div>
                    <div className="space-y-2">
                      <Input type="file" accept=".xlsx,.xls,.csv" className="max-w-sm mx-auto" />
                      <Button className="bg-chart-2 hover:bg-chart-2/90">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload File
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Supported formats: .xlsx, .xls, .csv</p>
                      <p>Make sure the file includes columns: Student ID, Name, Marks</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
