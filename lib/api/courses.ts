// API functions for course management
import { getCurrentUser } from '@/lib/auth'

const API_BASE_URL = "http://localhost:8000"

// Types for Course operations
export interface Course {
  course_code: string
  course_name: string
}

export interface CreateCourseRequest {
  course_code: string
  course_name: string
}

// Types for Section operations
export interface Section {
  course_code: string
  sec_number: number
  start_time: string
  end_time: string
  day_of_week: string
  location: string
}

export interface CreateSectionRequest {
  course_code: string
  sec_number: number
  start_time: string
  end_time: string
  day_of_week: string
  location: string
}

// Course API functions
export async function getCourses(): Promise<Course[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/all-courses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch courses: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please check your internet connection.')
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to fetch courses')
  }
}

export async function createCourse(data: CreateCourseRequest): Promise<Course> {
  try {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      throw new Error('User not authenticated. Please log in again.')
    }

    if (currentUser.role !== 'admin') {
      throw new Error('Only admin users can create courses.')
    }

    const response = await fetch(`${API_BASE_URL}/create-course`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User_ID': currentUser.user_id.toString(),
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      if (response.status === 409) {
        throw new Error('A course with this code already exists.')
      } else if (response.status === 400) {
        throw new Error(errorData.message || 'Invalid course data. Please check your inputs.')
      } else if (response.status >= 500) {
        throw new Error('Server error. Please try again later.')
      } else {
        throw new Error(errorData.message || `Failed to create course: ${response.status} ${response.statusText}`)
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
    throw new Error('Failed to create course')
  }
}

// Section API functions
export async function getSections(): Promise<Section[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/all-sections`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch sections: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please check your internet connection.')
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to fetch sections')
  }
}

export async function createSection(data: CreateSectionRequest): Promise<Section> {
  try {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      throw new Error('User not authenticated. Please log in again.')
    }

    if (currentUser.role !== 'admin') {
      throw new Error('Only admin users can create sections.')
    }

    const response = await fetch(`${API_BASE_URL}/create-section`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User_ID': currentUser.user_id.toString(),
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      if (response.status === 409) {
        throw new Error('A section with this number already exists for this course.')
      } else if (response.status === 400) {
        throw new Error(errorData.message || 'Invalid section data. Please check your inputs.')
      } else if (response.status === 404) {
        throw new Error('Course not found. Please create the course first.')
      } else if (response.status >= 500) {
        throw new Error('Server error. Please try again later.')
      } else {
        throw new Error(errorData.message || `Failed to create section: ${response.status} ${response.statusText}`)
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
    throw new Error('Failed to create section')
  }
}
