// API functions for faculty task management
import { getCurrentUser } from '@/lib/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface FacultyTask {
  todo_id: number
  title: string
  status: 'pending' | 'completed' | 'delayed'
  due_date: string | null
  related_announcement_id: number | null
  announcement_title: string | null
  announcement_content: string | null
  announcement_type: string | null
  announcement_deadline: string | null
  course_code: string | null
  section_number: number | null
}

// Types for creating faculty tasks
export interface CreateFacultyTaskRequest {
  title: string
  due_date: string
}

// Get faculty tasks
export async function getFacultyTasks(facultyId: number): Promise<FacultyTask[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/faculty/${facultyId}/tasks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-User_ID': facultyId.toString(),
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch faculty tasks: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching faculty tasks:', error)
    throw error
  }
}

// Create faculty task
export async function createFacultyTask(facultyId: number, data: CreateFacultyTaskRequest): Promise<FacultyTask> {
  try {
    const response = await fetch(`${API_BASE_URL}/faculty/${facultyId}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User_ID': facultyId.toString(),
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Failed to create faculty task: ${response.statusText}`)
    }

    const newTask = await response.json()
    return newTask
  } catch (error) {
    console.error('Error creating faculty task:', error)
    throw error
  }
}

// Update faculty task status
export interface UpdateFacultyTaskRequest {
  status: "pending" | "completed" | "delayed"
}

export async function updateFacultyTaskStatus(
  facultyId: number, 
  todoId: number, 
  data: UpdateFacultyTaskRequest
): Promise<FacultyTask> {
  try {
    const response = await fetch(`${API_BASE_URL}/faculty/${facultyId}/tasks/${todoId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-User_ID': facultyId.toString(),
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Failed to update faculty task: ${response.statusText}`)
    }

    const updatedTask = await response.json()
    return updatedTask
  } catch (error) {
    console.error('Error updating faculty task:', error)
    throw error
  }
}
