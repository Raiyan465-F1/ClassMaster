# Faculty Announcement System

## Overview

This system allows faculty members to create and manage announcements for their course sections. Faculty can create three types of announcements: quiz, assignment, and general. When quiz or assignment announcements are created, they automatically get added to the todo table for students in that section.

## Features

- **Three Announcement Types**: Quiz, Assignment, and General
- **Deadline Management**: Quiz and Assignment announcements require deadlines
- **Course Section Targeting**: Announcements are posted to specific course sections
- **Real-time Creation**: Announcements are immediately posted and visible
- **Faculty Authentication**: Only authenticated faculty can create announcements
- **Automatic Todo Integration**: Quiz/Assignment announcements create student todos

## API Endpoints

### Create Announcement

**Endpoint**: `POST /create-announcement`

**Headers**:

```
X-User_ID: {faculty_id}
Content-Type: application/json
```

**Request Body**:

```json
{
  "title": "Midterm Exam",
  "content": "Midterm exam covering chapters 1-5. Bring calculator and ID.",
  "type": "quiz",
  "course_code": "CSE560",
  "sec_number": 20,
  "deadline": "2025-01-15T23:59:00Z"
}
```

**Response**:

```json
{
  "announcement_id": 5,
  "title": "Midterm Exam",
  "content": "Midterm exam covering chapters 1-5. Bring calculator and ID.",
  "created_at": "2025-01-01T10:00:00Z",
  "type": "quiz",
  "section_course_code": "CSE560",
  "section_sec_number": 20,
  "faculty_id": 202420031,
  "deadline": "2025-01-15T23:59:00Z"
}
```

**Error Responses**:

- `400`: Deadline is required for quiz announcements
- `400`: Deadline is required for assignment announcements
- `403`: This action requires a faculty role
- `400`: Invalid announcement data

## Announcement Types

### 1. Quiz Announcements

- **Purpose**: Inform students about upcoming quizzes/exams
- **Requirements**: Title, content, course, section, deadline
- **Todo Integration**: Automatically creates student todos
- **Deadline**: Required and enforced

### 2. Assignment Announcements

- **Purpose**: Inform students about new assignments
- **Requirements**: Title, content, course, section, deadline
- **Todo Integration**: Automatically creates student todos
- **Deadline**: Required and enforced

### 3. General Announcements

- **Purpose**: General course information, schedule changes, etc.
- **Requirements**: Title, content, course, section
- **Todo Integration**: No automatic todo creation
- **Deadline**: Optional

## File Structure

### New Files Created

- `lib/api/announcements.ts` - Announcement API functions
- `app/faculty/announcements/loading.tsx` - Loading component

### Modified Files

- `components/announcement-form.tsx` - Added deadline field and API integration
- `components/announcement-card.tsx` - Added deadline display
- `app/faculty/announcements/page.tsx` - Integrated with real API and faculty data

## Data Flow

1. **Faculty Authentication**: User must be logged in as faculty
2. **Course Loading**: System loads faculty's assigned course sections
3. **Announcement Creation**: Faculty fills form and submits
4. **API Validation**: Backend validates deadline requirements
5. **Database Storage**: Announcement is stored in database
6. **Todo Creation**: If quiz/assignment, todos are created for students
7. **UI Update**: Announcement appears in faculty's announcement list

## Form Validation

- **Title**: Required, non-empty string
- **Content**: Required, non-empty string
- **Course**: Required, must be faculty's assigned course
- **Section**: Required, must be faculty's assigned section
- **Type**: Required, one of: quiz, assignment, general
- **Deadline**: Required for quiz/assignment, optional for general

## User Experience

- **Loading States**: Shows loading indicators during API calls
- **Error Handling**: Displays user-friendly error messages
- **Success Feedback**: Toast notifications for successful operations
- **Form Reset**: Form clears after successful submission
- **Real-time Updates**: Announcements appear immediately after creation

## Integration Points

- **Authentication System**: Uses existing faculty authentication
- **Course Management**: Integrates with faculty course assignment system
- **Student Todo System**: Automatically creates student todos for quiz/assignments
- **UI Components**: Uses existing design system components

## Security Features

- **Role Verification**: Only faculty users can create announcements
- **Course Access Control**: Faculty can only post to their assigned sections
- **Input Validation**: Client and server-side validation
- **Authentication Required**: All operations require valid faculty session

## Notes

- Quiz and Assignment announcements require deadlines and automatically create student todos
- General announcements are informational only and don't create todos
- The system uses the faculty's actual assigned course sections from the database
- All announcements are immediately visible to faculty after creation
- Error handling provides clear feedback for validation failures
