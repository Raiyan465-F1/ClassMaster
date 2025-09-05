"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, Crown } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { 
  getSections, 
  getLeaderboard, 
  getCourses,
  type Section,
  type LeaderboardEntry as APILeaderboardEntry,
  type Course
} from "@/lib/api/courses"
import { getCurrentUser } from "@/lib/auth"

interface LeaderboardEntry {
  rank: number
  display_name: string
  total_points: number
  is_anonymous: boolean
}

interface LeaderboardProps {
  userRole: "student" | "faculty"
  userId?: number
}

export function Leaderboard({ userRole, userId }: LeaderboardProps) {
  const [selectedCourse, setSelectedCourse] = useState<string>("")
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])
  const [availableCourses, setAvailableCourses] = useState<Course[]>([])
  const [sections, setSections] = useState<Section[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingCourses, setIsLoadingCourses] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }
  }, [])

  useEffect(() => {
    loadAllCourses()
  }, [user, userRole])

  useEffect(() => {
    if (selectedCourse) {
      fetchLeaderboardData(selectedCourse)
    }
  }, [selectedCourse])

  const loadAllCourses = async () => {
    setIsLoadingCourses(true)
    try {
      // Get all sections to extract unique course codes
      const sectionsData = await getSections()
      setSections(sectionsData)
      
      // Get unique course codes from sections
      const courseCodes = [...new Set(sectionsData.map(section => section.course_code))]
      
      // Get course details for all courses that have sections
      const allCourses = await getCourses()
      const coursesWithSections = allCourses.filter(course => 
        courseCodes.includes(course.course_code)
      )
      
      setAvailableCourses(coursesWithSections)
      
      // Set default course selection
      if (coursesWithSections.length > 0 && !selectedCourse) {
        setSelectedCourse(coursesWithSections[0].course_code)
      }
    } catch (error) {
      console.error("Error loading courses:", error)
      toast.error("Failed to load courses")
    } finally {
      setIsLoadingCourses(false)
    }
  }

  const fetchLeaderboardData = async (courseCode: string) => {
    setIsLoading(true)
    try {
      const data = await getLeaderboard(courseCode)
      
      // Add rank to each entry
      const rankedData = data.map((entry, index) => ({
        ...entry,
        rank: index + 1
      }))
      
      setLeaderboardData(rankedData)
    } catch (error) {
      console.error("Error fetching leaderboard data:", error)
      toast.error("Failed to load leaderboard data")
      setLeaderboardData([])
    } finally {
      setIsLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Trophy className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />
      default:
        return <Award className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-200 to-yellow-300 text-yellow-900 border-yellow-400 font-semibold shadow-sm"
      case 2:
        return "bg-gradient-to-r from-slate-200 to-slate-300 text-slate-800 border-slate-400 font-semibold shadow-sm"
      case 3:
        return "bg-gradient-to-r from-amber-200 to-orange-300 text-amber-900 border-amber-400 font-semibold shadow-sm"
      default:
        return "bg-blue-50 text-blue-700 border-blue-200"
    }
  }

  const getDisplayName = (entry: LeaderboardEntry) => {
    return entry.display_name
  }

  const selectedCourseName = availableCourses.find(course => course.course_code === selectedCourse)?.course_name || ""

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Leaderboard</h1>
          <p className="text-muted-foreground">
            {userRole === "student" 
              ? "See how you rank among your peers" 
              : "Track student progress and engagement"}
          </p>
        </div>
        
        {/* Course Selection */}
        <div className="flex items-center space-x-2">
          <label htmlFor="course-select" className="text-sm font-medium text-foreground">
            Course:
          </label>
          <Select value={selectedCourse} onValueChange={setSelectedCourse} disabled={isLoadingCourses}>
            <SelectTrigger id="course-select" className="w-[200px]">
              <SelectValue placeholder={isLoadingCourses ? "Loading..." : "Select a course"} />
            </SelectTrigger>
                         <SelectContent>
               {availableCourses.length === 0 ? (
                 <div className="px-2 py-1.5 text-sm text-muted-foreground">
                   No courses available
                 </div>
               ) : (
                 availableCourses.map((course) => (
                   <SelectItem key={course.course_code} value={course.course_code}>
                     {course.course_code} - {course.course_name}
                   </SelectItem>
                 ))
               )}
             </SelectContent>
          </Select>
        </div>
      </div>

      {/* Leaderboard Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span>
              {selectedCourseName && `${selectedCourse} - ${selectedCourseName}`}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : leaderboardData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No leaderboard data available for this course.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                  <TableHead className="w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboardData.map((entry) => (
                  <TableRow 
                    key={`${entry.rank}-${entry.display_name}`}
                    className={
                      entry.rank === 1 ? "bg-gradient-to-r from-yellow-50 to-yellow-100/50 border-l-4 border-l-yellow-400" :
                      entry.rank === 2 ? "bg-gradient-to-r from-slate-50 to-slate-100/50 border-l-4 border-l-slate-400" :
                      entry.rank === 3 ? "bg-gradient-to-r from-amber-50 to-orange-100/50 border-l-4 border-l-amber-400" :
                      "hover:bg-muted/30"
                    }
                  >
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getRankIcon(entry.rank)}
                        <Badge 
                          variant="outline" 
                          className={getRankBadgeColor(entry.rank)}
                        >
                          #{entry.rank}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {getDisplayName(entry)}
                        </span>
                        {entry.is_anonymous && (
                          <span className="text-xs text-muted-foreground">
                            Anonymous User
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <span className="font-semibold text-lg">
                          {entry.total_points}
                        </span>
                        <span className="text-sm text-muted-foreground">pts</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {entry.rank <= 3 && (
                        <Badge 
                          variant="secondary" 
                          className={cn(
                            "text-xs font-semibold",
                            entry.rank === 1 ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 shadow-md" :
                            entry.rank === 2 ? "bg-gradient-to-r from-slate-400 to-slate-500 text-white shadow-md" :
                            "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"
                          )}
                        >
                          {entry.rank === 1 ? "🥇 Gold" : entry.rank === 2 ? "🥈 Silver" : "🥉 Bronze"}
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Points Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">How Points Are Calculated</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>• <strong>Early Submission:</strong> 10 points per day early</p>
            <p>• <strong>On-time Submission:</strong> 5 points minimum</p>
            <p>• <strong>Late Submission:</strong> No points awarded</p>
            <p>• Points are awarded when you mark a task as completed</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
