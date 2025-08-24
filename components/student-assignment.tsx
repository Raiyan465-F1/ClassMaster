"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserPlus, Search, Trash2, Users } from "lucide-react"

interface Student {
  id: string
  name: string
  email: string
  enrolledSections: string[]
}

interface Section {
  courseCode: string
  sectionNumber: string
  courseName: string
  instructor: string
}

interface StudentAssignmentProps {
  students: Student[]
  sections: Section[]
  onAssignStudent: (studentId: string, sectionKey: string) => void
  onRemoveStudent: (studentId: string, sectionKey: string) => void
}

export function StudentAssignment({ students, sections, onAssignStudent, onRemoveStudent }: StudentAssignmentProps) {
  const [selectedStudent, setSelectedStudent] = useState("")
  const [selectedSection, setSelectedSection] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAssign = () => {
    if (selectedStudent && selectedSection) {
      onAssignStudent(selectedStudent, selectedSection)
      setSelectedStudent("")
      setSelectedSection("")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5" />
            <span>Assign Student to Section</span>
          </CardTitle>
          <CardDescription>Add students to course sections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="student-select">Select Student</Label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose student..." />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.email}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="section-select">Select Section</Label>
              <Select value={selectedSection} onValueChange={setSelectedSection}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose section..." />
                </SelectTrigger>
                <SelectContent>
                  {sections.map((section) => (
                    <SelectItem
                      key={`${section.courseCode}-${section.sectionNumber}`}
                      value={`${section.courseCode}-${section.sectionNumber}`}
                    >
                      <div>
                        <p className="font-medium">
                          {section.courseCode} - Section {section.sectionNumber}
                        </p>
                        <p className="text-xs text-muted-foreground">{section.courseName}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={handleAssign} disabled={!selectedStudent || !selectedSection} className="w-full">
                <UserPlus className="h-4 w-4 mr-2" />
                Assign Student
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all-students" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all-students">All Students</TabsTrigger>
          <TabsTrigger value="by-section">By Section</TabsTrigger>
        </TabsList>

        <TabsContent value="all-students">
          <Card>
            <CardHeader>
              <CardTitle>Student Enrollments</CardTitle>
              <CardDescription>View and manage student section assignments</CardDescription>
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Enrolled Sections</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell className="text-muted-foreground">{student.email}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {student.enrolledSections.length === 0 ? (
                              <Badge variant="outline" className="text-muted-foreground">
                                No enrollments
                              </Badge>
                            ) : (
                              student.enrolledSections.map((section) => (
                                <Badge key={section} variant="secondary" className="text-xs">
                                  {section}
                                </Badge>
                              ))
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-1">
                            {student.enrolledSections.map((section) => (
                              <Button
                                key={section}
                                variant="ghost"
                                size="sm"
                                onClick={() => onRemoveStudent(student.id, section)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="by-section">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sections.map((section) => {
              const sectionKey = `${section.courseCode}-${section.sectionNumber}`
              const enrolledStudents = students.filter((student) => student.enrolledSections.includes(sectionKey))

              return (
                <Card key={sectionKey}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                      {section.courseCode} - Section {section.sectionNumber}
                    </CardTitle>
                    <CardDescription>{section.courseName}</CardDescription>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{enrolledStudents.length} students</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {enrolledStudents.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No students enrolled</p>
                      ) : (
                        enrolledStudents.map((student) => (
                          <div key={student.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                            <div>
                              <p className="text-sm font-medium">{student.name}</p>
                              <p className="text-xs text-muted-foreground">{student.email}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onRemoveStudent(student.id, sectionKey)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
