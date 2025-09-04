"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "lucide-react"
import { toast } from "sonner"

interface EditAnnouncementModalProps {
  isOpen: boolean
  onClose: () => void
  announcement: {
    id: string
    title: string
    content: string
    type: "quiz" | "assignment" | "general"
    courseCode: string
    section: string
    deadline?: string
  } | null
  courses: Array<{ code: string; name: string; sections: string[] }>
  onUpdate: (updatedAnnouncement: any) => void
}

export function EditAnnouncementModal({ 
  isOpen, 
  onClose, 
  announcement, 
  courses, 
  onUpdate 
}: EditAnnouncementModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "general" as "quiz" | "assignment" | "general",
    courseCode: "",
    section: "",
    deadline: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (announcement) {
      setFormData({
        title: announcement.title,
        content: announcement.content,
        type: announcement.type,
        courseCode: announcement.courseCode,
        section: announcement.section,
        deadline: announcement.deadline || ""
      })
    }
  }, [announcement])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!announcement) return

    // Validate deadline requirement for quiz and assignment types
    if ((formData.type === "quiz" || formData.type === "assignment") && !formData.deadline) {
      toast.error(`Deadline is required for ${formData.type} announcements.`)
      return
    }

    setIsSubmitting(true)
    try {
      const updatedData = {
        title: formData.title,
        content: formData.content,
        type: formData.type,
        course_code: formData.courseCode,
        sec_number: parseInt(formData.section),
        deadline: formData.deadline || undefined
      }

      await onUpdate(updatedData)
      toast.success('Announcement updated successfully!')
      onClose()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update announcement'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const selectedCourse = courses.find(c => c.code === formData.courseCode)
  const availableSections = selectedCourse?.sections || []

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Announcement</DialogTitle>
          <DialogDescription>
            Update the announcement details below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter announcement title"
              required
            />
          </div>

          {/* Content */}
          <div>
            <Label htmlFor="edit-content">Content</Label>
            <Textarea
              id="edit-content"
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              placeholder="Enter announcement content"
              rows={4}
              required
            />
          </div>

          {/* Type */}
          <div>
            <Label htmlFor="edit-type">Type</Label>
            <Select value={formData.type} onValueChange={(value: "quiz" | "assignment" | "general") => handleInputChange("type", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="quiz">Quiz</SelectItem>
                <SelectItem value="assignment">Assignment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Course */}
          <div>
            <Label htmlFor="edit-course">Course</Label>
            <Select value={formData.courseCode} onValueChange={(value) => handleInputChange("courseCode", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select course" />
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

          {/* Section */}
          <div>
            <Label htmlFor="edit-section">Section</Label>
            <Select value={formData.section} onValueChange={(value) => handleInputChange("section", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select section" />
              </SelectTrigger>
              <SelectContent>
                {availableSections.map((section) => (
                  <SelectItem key={section} value={section}>
                    Section {section}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

                     {/* Deadline - Required for quiz and assignment, optional for general */}
           <div>
             <Label htmlFor="edit-deadline" className="flex items-center gap-2">
               <Calendar className="h-4 w-4" />
               Deadline
               {(formData.type === "quiz" || formData.type === "assignment") && (
                 <span className="text-red-500">*</span>
               )}
             </Label>
             <Input
               id="edit-deadline"
               type="datetime-local"
               value={formData.deadline}
               onChange={(e) => handleInputChange("deadline", e.target.value)}
               required={formData.type === "quiz" || formData.type === "assignment"}
               placeholder={(formData.type === "quiz" || formData.type === "assignment") 
                 ? "Required for quiz/assignment" 
                 : "Optional for general announcements"
               }
             />
             {(formData.type === "general" && formData.deadline) && (
               <p className="text-sm text-muted-foreground mt-1">
                 Deadline is optional for general announcements
               </p>
             )}
           </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Announcement"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
