// API functions for student todo management
import { getCurrentUser } from '@/lib/auth'

const API_BASE_URL = "http://localhost:8000"

// Types for Todo operations
export interface StudentTask {
  todo_id: number
  title: string
  status: "pending" | "completed" | "delayed"
  due_date: string
  related_announcement_id: number | null
  announcement_title: string | null
  announcement_content: string | null
  announcement_type: "quiz" | "assignment" | "general" | null
  announcement_deadline: string | null
  course_code: string | null
  section_number: number | null
}

// Get all tasks for a specific student
export async function getStudentTasks(studentId: number): Promise<StudentTask[]> {
  try {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      throw new Error('User not authenticated. Please log in again.')
    }

    const response = await fetch(`${API_BASE_URL}/students/${studentId}/tasks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-User_ID': currentUser.user_id.toString(),
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      if (response.status === 404) {
        return [] // Return empty array if no tasks found
      } else if (response.status >= 500) {
        throw new Error('Server error. Please try again later.')
      } else {
        throw new Error(errorData.detail || `Failed to fetch student tasks: ${response.status} ${response.statusText}`)
      }
    }

    return await response.json()
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please check your internet connection.')
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to fetch student tasks')
  }
}

// Update task status
export async function updateTaskStatus(taskId: number, status: "pending" | "completed" | "delayed"): Promise<void> {
  try {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      throw new Error('User not authenticated. Please log in again.')
    }

    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-User_ID': currentUser.user_id.toString(),
      },
      body: JSON.stringify({ status }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      if (response.status === 400) {
        throw new Error(errorData.detail || 'Invalid task data. Please check your inputs.')
      } else if (response.status === 404) {
        throw new Error('Task not found.')
      } else if (response.status >= 500) {
        throw new Error('Server error. Please try again later.')
      } else {
        throw new Error(errorData.detail || `Failed to update task: ${response.status} ${response.statusText}`)
      }
    }
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please check your internet connection.')
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to update task status')
  }
}
