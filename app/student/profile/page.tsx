"use client"

import { useState, useEffect } from "react"
import { StudentSidebar } from "@/components/student-sidebar"
import { Profile } from "@/components/profile"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { BookOpen, Eye, EyeOff } from "lucide-react"
import { 
  getStudentSections, 
  getCourses, 
  updateStudentAnonymity,
  getStudentAnonymityStatus,
  type StudentSection,
  type Course,
  type UpdateAnonymityRequest,
  type AnonymityStatus
} from "@/lib/api/courses"
import { getCurrentUser } from "@/lib/auth"

interface CourseWithAnonymity extends Course {
  anonymityStatus?: AnonymityStatus
  isLoadingAnonymity?: boolean
}

export default function StudentProfile() {
  const [user, setUser] = useState<any>(null)
  const [enrolledCourses, setEnrolledCourses] = useState<CourseWithAnonymity[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [updatingAnonymity, setUpdatingAnonymity] = useState<string | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }
  }, [])

  useEffect(() => {
    if (user) {
      loadEnrolledCourses()
    }
  }, [user])

  const loadEnrolledCourses = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      const sections = await getStudentSections(user.user_id)
      
      // Get unique course codes from student sections
      const courseCodes = [...new Set(sections.map(section => section.course_code))]
      
      // Get course details for enrolled courses
      const allCourses = await getCourses()
      const enrolledCoursesData = allCourses.filter(course => 
        courseCodes.includes(course.course_code)
      )
      
      // Set initial state with courses
      setEnrolledCourses(enrolledCoursesData)
      
      // Fetch anonymity status for each course
      for (const course of enrolledCoursesData) {
        try {
          const anonymityStatus = await getStudentAnonymityStatus(user.user_id, course.course_code)
          
          // Update the course with anonymity status
          setEnrolledCourses(prev => 
            prev.map(c => 
              c.course_code === course.course_code 
                ? { ...c, anonymityStatus, isLoadingAnonymity: false }
                : c
            )
          )
        } catch (error) {
          console.error(`Error loading anonymity status for ${course.course_code}:`, error)
          
          // Set loading state to false even if there's an error
          setEnrolledCourses(prev => 
            prev.map(c => 
              c.course_code === course.course_code 
                ? { ...c, isLoadingAnonymity: false }
                : c
            )
          )
        }
      }
    } catch (error) {
      console.error("Error loading enrolled courses:", error)
      toast.error("Failed to load your enrolled courses")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnonymityToggle = async (courseCode: string, isAnonymous: boolean) => {
    if (!user) return
    
    setUpdatingAnonymity(courseCode)
    try {
      await updateStudentAnonymity(user.user_id, courseCode, { is_anonymous: isAnonymous })
      
      // Fetch updated anonymity status
      const updatedStatus = await getStudentAnonymityStatus(user.user_id, courseCode)
      
      // Update local state with the new status
      setEnrolledCourses(prev => 
        prev.map(course => 
          course.course_code === courseCode 
            ? { ...course, anonymityStatus: updatedStatus }
            : course
        )
      )
      
      toast.success(
        `Successfully ${isAnonymous ? 'enabled' : 'disabled'} anonymous mode for ${courseCode}`
      )
    } catch (error) {
      console.error("Error updating anonymity:", error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to update anonymity setting'
      toast.error(errorMessage)
    } finally {
      setUpdatingAnonymity(null)
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <StudentSidebar />
      <main className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          {/* Profile Section */}
          <Profile />
          
          {/* Enrolled Courses with Anonymity Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Leaderboard Anonymity</span>
              </CardTitle>
              <CardDescription>
                Manage your anonymity settings for each course's leaderboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : enrolledCourses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>You are not enrolled in any courses yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {enrolledCourses.map((course) => {
                    const isAnonymous = course.anonymityStatus?.is_anonymous || false
                    const isLoadingAnonymity = course.isLoadingAnonymity !== false
                    const isUpdating = updatingAnonymity === course.course_code
                    
                    return (
                      <div
                        key={course.course_code}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Badge variant="secondary" className="text-sm">
                            {course.course_code}
                          </Badge>
                          <div>
                            <h4 className="font-medium">{course.course_name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {isLoadingAnonymity 
                                ? 'Loading anonymity status...' 
                                : isAnonymous 
                                  ? 'Anonymous in leaderboard' 
                                  : 'Visible in leaderboard'
                              }
                            </p>
                            {course.anonymityStatus && (
                              <p className="text-xs text-muted-foreground">
                                Points: {course.anonymityStatus.total_points} | 
                                Display: {course.anonymityStatus.display_name}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            {isLoadingAnonymity ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                            ) : isAnonymous ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="text-sm text-muted-foreground">
                              {isLoadingAnonymity 
                                ? 'Loading...' 
                                : isAnonymous 
                                  ? 'Anonymous' 
                                  : 'Visible'
                              }
                            </span>
                          </div>
                          
                          <Switch
                            checked={isAnonymous}
                            onCheckedChange={(checked) => 
                              handleAnonymityToggle(course.course_code, checked)
                            }
                            disabled={isLoadingAnonymity || isUpdating}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
