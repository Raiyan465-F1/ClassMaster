# Student Course Selection System

## Overview

This system allows students to enroll in course sections that have faculty assigned to them, similar to the faculty course assignment system. Students can view available courses and sections, enroll in sections, and see their current enrollments. Only sections with faculty assigned are available for enrollment.

## Features

- **Course Registration Form**: Students can select a course and section (with faculty assigned) to enroll in
- **Current Enrollments Display**: Shows all courses and sections the student is currently enrolled in
- **Available Sections Overview**: Visual representation of all sections with faculty assigned across courses
- **Real-time Updates**: Enrollments are immediately reflected in the UI after successful API calls
- **Faculty Assignment Filtering**: Only sections with faculty assigned are shown as available for enrollment

## API Endpoints

### 1. Student Section Assignment

**Endpoint**: `POST /students/assign-section`

**Headers**:

```
X-User-ID: {student_id}
Content-Type: application/json
```

**Request Body**:

```json
{
  "course_code": "CSE101",
  "sec_number": 1
}
```

**Response**:

```json
{
  "student_id": 2024001,
  "course_code": "CSE101",
  "sec_number": 1
}
```

**Error Responses**:

- `400`: Student is already enrolled in this section
- `404`: The specified course or section does not exist
- `403`: This action requires a student role
- `404`: User with ID {student_id} not found

### 2. Get Student Sections

**Endpoint**: `GET /students/{student_id}/sections`

**Headers**:

```
Content-Type: application/json
```

**Response**:

```json
[
  {
    "student_id": 2024001,
    "course_code": "CSE101",
    "sec_number": 1
  },
  {
    "student_id": 2024001,
    "course_code": "CSE201",
    "sec_number": 2
  }
]
```

### 3. Get All Faculty Sections

**Endpoint**: `GET /faculty/all-sections`

**Headers**:

```
Content-Type: application/json
```

**Response**:

```json
[
  {
    "faculty_id": 0,
    "course_code": "string",
    "sec_number": 0
  }
]
```

**Purpose**: This endpoint returns all sections that have faculty assigned to them, which is used to determine which sections are available for student enrollment.

## File Structure

### New Files Created

- `app/student/select-courses/page.tsx` - Main student course selection page
- `app/student/select-courses/loading.tsx` - Loading component for the page

### Modified Files

- `lib/api/courses.ts` - Added student course assignment API functions
- `components/student-sidebar.tsx` - Added "Course Registration" navigation item

## Usage

### For Students

1. Navigate to `/student/select-courses`
2. Select a course from the dropdown
3. Select a section from the available sections
4. Click "Enroll in Section" to register
5. View current enrollments and available sections overview

### For Developers

1. Ensure the backend implements the required API endpoints
2. The system automatically handles authentication and role verification
3. Error handling is implemented for all common scenarios
4. The UI provides real-time feedback for all operations

## Dependencies

- React hooks (useState, useEffect)
- Next.js routing and components
- UI components from the design system
- Toast notifications for user feedback
- Authentication system integration

## Notes

- Students can only enroll in sections that have faculty assigned to them
- The system uses the faculty sections data to filter available sections for enrollment
- All API calls include proper error handling and user feedback
- The interface is responsive and follows the existing design patterns
