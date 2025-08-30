"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, Crown } from "lucide-react"
import { cn } from "@/lib/utils"

interface LeaderboardEntry {
  rank: number
  studentName: string
  courseCode: string
  points: number
  isAnonymous: boolean
  anonymousName?: string
}

interface Course {
  code: string
  name: string
}

interface LeaderboardProps {
  userRole: "student" | "faculty"
  userId?: number
}

// Mock data - replace with actual API calls
const mockCourses: Course[] = [
  { code: "CSE101", name: "Introduction to Programming" },
  { code: "CSE201", name: "Database Systems" },
  { code: "CSE301", name: "Data Structures" },
  { code: "CSE401", name: "Software Engineering" },
]

const mockLeaderboardData: LeaderboardEntry[] = [
  { rank: 1, studentName: "Alice Johnson", courseCode: "CSE201", points: 150, isAnonymous: false },
  { rank: 2, studentName: "Anonymous User", courseCode: "CSE201", points: 135, isAnonymous: true, anonymousName: "CodeNinja" },
  { rank: 3, studentName: "Bob Smith", courseCode: "CSE201", points: 120, isAnonymous: false },
  { rank: 4, studentName: "Anonymous User", courseCode: "CSE201", points: 105, isAnonymous: true, anonymousName: "DataMaster" },
  { rank: 5, studentName: "Charlie Brown", courseCode: "CSE201", points: 95, isAnonymous: false },
  { rank: 6, studentName: "Diana Prince", courseCode: "CSE201", points: 80, isAnonymous: false },
  { rank: 7, studentName: "Edward Wilson", courseCode: "CSE201", points: 75, isAnonymous: false },
  { rank: 8, studentName: "Fiona Green", courseCode: "CSE201", points: 60, isAnonymous: false },
  { rank: 9, studentName: "George Harris", courseCode: "CSE201", points: 45, isAnonymous: false },
  { rank: 10, studentName: "Hannah Davis", courseCode: "CSE201", points: 30, isAnonymous: false },
]

export function Leaderboard({ userRole, userId }: LeaderboardProps) {
  const [selectedCourse, setSelectedCourse] = useState<string>("")
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (selectedCourse) {
      fetchLeaderboardData(selectedCourse)
    }
  }, [selectedCourse])

  useEffect(() => {
    // Set default course selection
    if (mockCourses.length > 0 && !selectedCourse) {
      setSelectedCourse(mockCourses[0].code)
    }
  }, [selectedCourse])

  const fetchLeaderboardData = async (courseCode: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Filter mock data by course code
      const filteredData = mockLeaderboardData.filter(entry => entry.courseCode === courseCode)
      setLeaderboardData(filteredData)
    } catch (error) {
      console.error("Error fetching leaderboard data:", error)
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
    if (entry.isAnonymous && entry.anonymousName) {
      return entry.anonymousName
    }
    return entry.isAnonymous ? "Anonymous" : entry.studentName
  }

  const selectedCourseName = mockCourses.find(course => course.code === selectedCourse)?.name || ""

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
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger id="course-select" className="w-[200px]">
              <SelectValue placeholder="Select a course" />
            </SelectTrigger>
            <SelectContent>
              {mockCourses.map((course) => (
                <SelectItem key={course.code} value={course.code}>
                  {course.code} - {course.name}
                </SelectItem>
              ))}
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
                    key={`${entry.rank}-${entry.studentName}`}
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
                        {entry.isAnonymous && (
                          <span className="text-xs text-muted-foreground">
                            Anonymous User
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <span className="font-semibold text-lg">
                          {entry.points}
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
