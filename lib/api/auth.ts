// API functions for authentication
const API_BASE_URL = "http://localhost:8000"

// Types for API requests and responses
export interface RegisterRequest {
  email: string
  name: string
  password: string
  preferred_anonymous_name: string
  role: "student" | "faculty"
  user_id: number
}

export interface RegisterResponse {
  email: string
  name: string
  preferred_anonymous_name: string
  role: "student" | "faculty"
  user_id: number
}

export interface LoginRequest {
  user_id: number
  password: string
}

export interface LoginResponse {
  email: string
  name: string
  role: "student" | "faculty" | "admin"
  user_id: number
}

// Register function
export async function registerUser(data: RegisterRequest): Promise<RegisterResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      
      // Handle specific error cases
      if (response.status === 400) {
        throw new Error(errorData.message || 'Invalid registration data. Please check your inputs.')
      } else if (response.status === 409) {
        throw new Error('An account with this email or user ID already exists.')
      } else if (response.status >= 500) {
        throw new Error('Server error. Please try again later.')
      } else {
        throw new Error(errorData.message || `Registration failed: ${response.status} ${response.statusText}`)
      }
    }

    const result: RegisterResponse = await response.json()
    return result
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please check your internet connection.')
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Registration failed: Unknown error occurred')
  }
}

// Login function
export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      
      // Handle specific error cases
      if (response.status === 401) {
        throw new Error('Invalid user ID or password. Please check your credentials.')
      } else if (response.status === 404) {
        throw new Error('User not found. Please check your user ID.')
      } else if (response.status >= 500) {
        throw new Error('Server error. Please try again later.')
      } else {
        throw new Error(errorData.message || `Login failed: ${response.status} ${response.statusText}`)
      }
    }

    const result: LoginResponse = await response.json()
    return result
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please check your internet connection.')
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Login failed: Unknown error occurred')
  }
}
