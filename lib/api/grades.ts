// API functions for grade management
import { getCurrentUser } from '@/lib/auth'

const API_BASE_URL = "http://localhost:8000"

// Types for Grade operations
export interface Grade {
  student_id: number
  course_code: string
  sec_number: number
  grade_type: string
  marks: number
}

export interface CreateGradeRequest {
  student_id: number
  grade_type: string
  marks: number
}

export interface StudentGradeSummary {
  total_marks: number
  grades: {
    grade_type: string
    marks: number
  }[]
  course_code: string
  sec_number: number
}

// Create/Update student grade (Faculty only)
export async function createOrUpdateGrade(
  courseCode: string, 
  secNumber: number, 
  data: CreateGradeRequest
): Promise<Grade> {
  try {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      throw new Error('User not authenticated')
    }

    const response = await fetch(`${API_BASE_URL}/sections/${courseCode}/${secNumber}/grades`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User_ID': currentUser.user_id.toString(),
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Failed to create/update grade: ${response.statusText}`)
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error creating/updating grade:', error)
    throw error
  }
}

// Get all grades for section (Faculty only)
export async function getSectionGrades(courseCode: string, secNumber: number): Promise<Grade[]> {
  try {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      throw new Error('User not authenticated')
    }

    const response = await fetch(`${API_BASE_URL}/sections/${courseCode}/${secNumber}/grades`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-User_ID': currentUser.user_id.toString(),
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch section grades: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching section grades:', error)
    throw error
  }
}

// Get my grades for section (Student only)
export async function getMyGrades(courseCode: string, secNumber: number): Promise<Grade[]> {
  try {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      throw new Error('User not authenticated')
    }

    const response = await fetch(`${API_BASE_URL}/my-grades/${courseCode}/${secNumber}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-User_ID': currentUser.user_id.toString(),
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch my grades: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching my grades:', error)
    throw error
  }
}

// Get student grade summary (Student only)
export async function getStudentGradeSummary(courseCode: string, secNumber: number): Promise<StudentGradeSummary> {
  try {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      throw new Error('User not authenticated')
    }

    const response = await fetch(`${API_BASE_URL}/my-dashboard/${courseCode}/${secNumber}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-User_ID': currentUser.user_id.toString(),
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch grade summary: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching grade summary:', error)
    throw error
  }
}
