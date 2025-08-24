"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { UserCheck, Trash2, Users } from "lucide-react"

interface Faculty {
  id: string
  name: string
  email: string
  assignedSections: string[]
}

interface Section {
  courseCode: string
  sectionNumber: string
  courseName: string
  instructor: string
}

interface FacultyAssignmentProps {
  faculty: Faculty[]
  sections: Section[]
  onAssignFaculty: (facultyId: string, sectionKey: string) => void
  onRemoveFaculty: (facultyId: string, sectionKey: string) => void
}

export function FacultyAssignment({ faculty, sections, onAssignFaculty, onRemoveFaculty }: FacultyAssignmentProps) {
  const [selectedFaculty, setSelectedFaculty] = useState("")
  const [selectedSection, setSelectedSection] = useState("")

  const handleAssign = () => {
    if (selectedFaculty && selectedSection) {
      onAssignFaculty(selectedFaculty, selectedSection)
      setSelectedFaculty("")
      setSelectedSection("")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserCheck className="h-5 w-5" />
            <span>Assign Faculty to Section</span>
          </CardTitle>
          <CardDescription>Assign faculty members to teach course sections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="faculty-select">Select Faculty</Label>
              <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose faculty..." />
                </SelectTrigger>
                <SelectContent>
                  {faculty.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
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
              <Button onClick={handleAssign} disabled={!selectedFaculty || !selectedSection} className="w-full">
                <UserCheck className="h-4 w-4 mr-2" />
                Assign Faculty
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Faculty Assignments</CardTitle>
          <CardDescription>View and manage faculty teaching assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Faculty</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Assigned Sections</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faculty.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell className="text-muted-foreground">{member.email}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {member.assignedSections.length === 0 ? (
                          <Badge variant="outline" className="text-muted-foreground">
                            No assignments
                          </Badge>
                        ) : (
                          member.assignedSections.map((section) => (
                            <Badge key={section} variant="secondary" className="text-xs">
                              {section}
                            </Badge>
                          ))
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        {member.assignedSections.map((section) => (
                          <Button
                            key={section}
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveFaculty(member.id, section)}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section) => {
          const sectionKey = `${section.courseCode}-${section.sectionNumber}`
          const assignedFaculty = faculty.filter((member) => member.assignedSections.includes(sectionKey))

          return (
            <Card key={sectionKey}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  {section.courseCode} - Section {section.sectionNumber}
                </CardTitle>
                <CardDescription>{section.courseName}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {assignedFaculty.length === 0 ? (
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">No faculty assigned</span>
                    </div>
                  ) : (
                    assignedFaculty.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveFaculty(member.id, sectionKey)}
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
    </div>
  )
}
