"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Save } from "lucide-react"

interface AnnouncementFormProps {
  onSubmit: (announcement: {
    title: string
    content: string
    type: "quiz" | "assignment" | "general"
    courseCode: string
    section: string
  }) => void
  courses: Array<{ code: string; name: string; sections: string[] }>
}

export function AnnouncementForm({ onSubmit, courses }: AnnouncementFormProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [type, setType] = useState<"quiz" | "assignment" | "general">("general")
  const [selectedCourse, setSelectedCourse] = useState("")
  const [selectedSection, setSelectedSection] = useState("")

  const selectedCourseData = courses.find((c) => c.code === selectedCourse)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title && content && selectedCourse && selectedSection) {
      onSubmit({
        title,
        content,
        type,
        courseCode: selectedCourse,
        section: selectedSection,
      })
      // Reset form
      setTitle("")
      setContent("")
      setType("general")
      setSelectedCourse("")
      setSelectedSection("")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Create New Announcement</span>
        </CardTitle>
        <CardDescription>Post announcements to your course sections</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="course">Course</Label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Select course..." />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.code} value={course.code}>
                      {course.code} - {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="section">Section</Label>
              <Select value={selectedSection} onValueChange={setSelectedSection} disabled={!selectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Select section..." />
                </SelectTrigger>
                <SelectContent>
                  {selectedCourseData?.sections.map((section) => (
                    <SelectItem key={section} value={section}>
                      Section {section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={type} onValueChange={(value: "quiz" | "assignment" | "general") => setType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">📢 General</SelectItem>
                  <SelectItem value="quiz">📝 Quiz</SelectItem>
                  <SelectItem value="assignment">📋 Assignment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter announcement title..."
              required
            />
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter announcement content..."
              rows={4}
              required
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={!title || !content || !selectedCourse || !selectedSection}>
              <Save className="h-4 w-4 mr-2" />
              Post Announcement
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
