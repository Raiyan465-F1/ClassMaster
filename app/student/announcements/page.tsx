"use client"

import { useState } from "react"
import { StudentSidebar } from "@/components/student-sidebar"
import { AnnouncementCard } from "@/components/announcement-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Filter, Search, Megaphone } from "lucide-react"

// Mock data
const mockAnnouncements = [
  {
    id: "1",
    title: "Quiz 3 Scheduled for Next Week",
    content:
      "Quiz 3 on Normalization will be held next Tuesday. Please review chapters 7-8 from the textbook. The quiz will cover 1NF, 2NF, 3NF, and BCNF concepts.",
    type: "quiz" as const,
    createdAt: "2 hours ago",
    instructor: "Prof. Johnson",
    courseCode: "CSE201",
    section: "B",
  },
  {
    id: "2",
    title: "Assignment 2 Released",
    content:
      "Assignment 2 on Query Optimization is now available on the course portal. Due date is February 28th. Please check the detailed requirements and submission guidelines.",
    type: "assignment" as const,
    createdAt: "1 day ago",
    instructor: "Prof. Johnson",
    courseCode: "CSE201",
    section: "B",
  },
  {
    id: "3",
    title: "Lab Session Rescheduled",
    content:
      "Tomorrow's lab session has been moved to Friday 10 AM in Lab 2. We will be covering tree traversal algorithms including inorder, preorder, and postorder traversals.",
    type: "general" as const,
    createdAt: "5 hours ago",
    instructor: "Dr. Williams",
    courseCode: "CSE301",
    section: "A",
  },
  {
    id: "4",
    title: "Midterm Exam Schedule",
    content:
      "The midterm examination will be held on March 15th from 2:00 PM to 4:00 PM in the main auditorium. Please bring your student ID and writing materials.",
    type: "quiz" as const,
    createdAt: "3 days ago",
    instructor: "Prof. Brown",
    courseCode: "CSE401",
    section: "C",
  },
  {
    id: "5",
    title: "Project Presentation Guidelines",
    content:
      "Final project presentations will be held during the last week of classes. Each team will have 15 minutes to present followed by 5 minutes for questions. Detailed rubric is available on the portal.",
    type: "assignment" as const,
    createdAt: "1 week ago",
    instructor: "Dr. Williams",
    courseCode: "CSE301",
    section: "A",
  },
]

const mockCourses = ["All Courses", "CSE201-B", "CSE301-A", "CSE401-C"]

export default function StudentAnnouncements() {
  const [filterType, setFilterType] = useState("all")
  const [filterCourse, setFilterCourse] = useState("All Courses")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredAnnouncements = mockAnnouncements.filter((announcement) => {
    const matchesType = filterType === "all" || announcement.type === filterType
    const matchesCourse =
      filterCourse === "All Courses" || `${announcement.courseCode}-${announcement.section}` === filterCourse
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.instructor.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesType && matchesCourse && matchesSearch
  })

  return (
    <div className="flex h-screen bg-background">
      <StudentSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Announcements</h1>
            <p className="text-muted-foreground">Stay updated with the latest course announcements and notifications</p>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filter Announcements</span>
              </CardTitle>
              <CardDescription>Filter by type, course, or search for specific content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Type</label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="quiz">📝 Quizzes</SelectItem>
                      <SelectItem value="assignment">📋 Assignments</SelectItem>
                      <SelectItem value="general">📢 General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Course</label>
                  <Select value={filterCourse} onValueChange={setFilterCourse}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCourses.map((course) => (
                        <SelectItem key={course} value={course}>
                          {course}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search announcements..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Announcements List */}
          <div className="space-y-4">
            {filteredAnnouncements.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Megaphone className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Announcements Found</h3>
                    <p className="text-muted-foreground">
                      No announcements match your current filters. Try adjusting your search criteria.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredAnnouncements.map((announcement) => (
                <AnnouncementCard key={announcement.id} announcement={announcement} />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
