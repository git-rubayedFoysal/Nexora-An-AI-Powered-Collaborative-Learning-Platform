# Nexora

AI-powered collaborative learning platform built with React 19, Vite 8, Tailwind v4, Redux Toolkit, and Supabase.

**Live:** [nexora-learning.vercel.app](https://nexora-learning.vercel.app)

## Features

### Student Dashboard
- **My Learning** — enrolled courses grid with progress tracking
- **Assignments** — view all assignments with submission status, submit responses and files
- **Profile** — view and edit display name

### Teacher Dashboard
- **My Courses** — course management with search, create, edit, delete
- **Assignments** — create/edit/delete assignments with course/module selection, due dates, max scores, file attachments
- **Grade Center** — grade submissions with scores and feedback, filter by assignment/status, search by student
- **Profile** — view and edit display name

### Admin Dashboard
- **Manage Courses** — view/edit/delete all courses across the platform
- **Platform Overview** — user stats by role, course status breakdown
- **Users** — search and paginate all users, change roles inline
- **Enrollment** — view all enrollments with search, course filter, and progress
- **Roles & Access** — user distribution stats and role permission matrix
- **Profile** — view and edit display name

### Shared
- **Course Catalog** — browse published courses, enroll, checkout
- **Learning Page** — sidebar curriculum, video/PDF content, lesson progress, mark-complete
- **Auth** — sign up, sign in, email verification, role-based access (student/teacher/admin)
- **Assignment Deadlines** — late submission tracking with timing labels ("2h late", "1d 3h late")

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, React Router v8 |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| State | Redux Toolkit |
| Forms | React Hook Form |
| Backend | Supabase (Auth, PostgREST, Storage) |
| Linting | ESLint (flat config) |

## Getting Started

### Prerequisites
- Node.js 18+
- A Supabase project (URL + anon key)

### Setup

```bash
# Install dependencies
npm install

# Create .env file with your Supabase credentials
cat > .env << EOF
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
EOF

# Start dev server
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Serve production build locally |

## Project Structure

```
src/
├── config/conf.js                  # Environment variables
├── store/store.js                  # Redux store
├── services/supabase/
│   ├── supabaseClient.js           # Supabase client
│   ├── auth/auth.service.js        # Sign up, sign in, sign out, profile, admin: user list + role updates
│   ├── course/course.service.js     # Course CRUD
│   ├── course/enroll.service.js     # Enrollment operations (incl. admin: all enrollments)
│   ├── module/module.service.js     # Module CRUD
│   ├── lesson/lesson.service.js     # Lesson CRUD
│   ├── lessonProgress/lessonProgress.service.js  # Progress tracking
│   ├── assignment/assignment.service.js          # Assignment CRUD
│   ├── assignment/assignment.storage.js          # Assignment file storage
│   ├── assignment/submission.service.js          # Submission CRUD
│   └── assignment/submission.storage.js          # Submission file storage
├── features/
│   ├── auth/authSlice.js           # Auth state + user stats
│   ├── course/courseSlice.js       # Course state + CRUD thunks
│   ├── enroll/enrollSlice.js       # Enrollment state + thunks
│   ├── module/moduleSlice.js       # Module state
│   ├── lesson/lessonSlice.js       # Lesson state
│   ├── lessonProgress/lessonProgressSlice.js  # Progress state
│   ├── assignment/assignmentSlice.js           # Assignment state
│   └── assignment/assignmentSubmissionSlice.js # Submission state
├── pages/
│   ├── Home.jsx                    # Landing page
│   ├── Login.jsx / Signup.jsx      # Auth pages
│   ├── Profile.jsx                 # User profile (editable name)
│   ├── AdminUsers.jsx              # Admin: user management
│   ├── AdminEnrollments.jsx        # Admin: enrollment list
│   ├── AdminRolesAccess.jsx        # Admin: roles/permissions
│   ├── DashboardLayout.jsx         # Dashboard shell (sidebar + header)
│   ├── LearningPage.jsx            # Course learning view
│   ├── Course/                     # Course catalog, details, checkout
│   ├── Assignment/                 # Assignment list, detail (role-aware)
│   └── Grade/                      # Grade center + grading modal
├── components/
│   ├── Dashboard/
│   │   ├── Sidebar.jsx             # Role-based sidebar nav
│   │   ├── DashboardHeader.jsx     # Top bar
│   │   ├── DashboardHome.jsx       # Role-switching home
│   │   ├── content/                # StudentContent, TeacherContent, AdminContent (real data)
│   │   ├── Student/MyLearning.jsx  # Enrolled courses
│   │   ├── Teacher/                # MyCourses, assignment components
│   │   └── Admin/ManageCourses.jsx
│   ├── Course/                     # CourseCard, CourseForm, CourseCurriculum
│   ├── Select.jsx                  # Reusable labeled dropdown (dark options)
│   ├── StudentLearning/            # Learning sidebar, modules, lessons
│   └── Header/                     # Public header, AvatarDropdown
├── utils/
│   ├── formatDate.js               # Date formatter
│   ├── formatDuration.js           # Duration formatter
│   ├── greeting.js                 # Time-based greeting
│   ├── toDatetimeLocal.js          # ISO → datetime-local converter
│   └── submissionTiming.js         # Late submission calculator
└── constants/
    └── pagination.js               # COURSE_PAGE_SIZE = 6
```

## Routes

### Public
| Path | Page |
|------|------|
| `/` | Home |
| `/login` | Login |
| `/signup` | Signup |
| `/verify-email` | Email verification |
| `/courses` | Course catalog |
| `/courses/:courseId` | Course details |
| `/courses/:courseId/checkout` | Checkout |
| `/enrollment-success` | Enrollment success |
| `/my-learning/:courseId` | Learning page |

### Dashboard (authenticated)
| Path | Page | Roles |
|------|------|-------|
| `/dashboard` | Dashboard home | All |
| `/dashboard/profile` | Profile | All |
| `/dashboard/my-courses` | Teacher courses | Teacher |
| `/dashboard/create-course` | Create course | Teacher |
| `/dashboard/edit-course/:courseId` | Edit course | Teacher, Admin |
| `/dashboard/my-learning` | Enrolled courses | Student |
| `/dashboard/assignments` | Assignments | All |
| `/dashboard/assignments/:assignmentId` | Assignment detail | All |
| `/dashboard/grade` | Grade center | Teacher |
| `/dashboard/manage-courses` | Manage courses | Admin |
| `/dashboard/users` | User management | Admin |
| `/dashboard/enrollment` | Enrollments | Admin |
| `/dashboard/role-access` | Roles & access | Admin |

## Styling

- **Tailwind v4** via `@tailwindcss/vite` plugin (no PostCSS config)
- Custom theme tokens in `src/index.css` under `@theme` (navy/violet/teal/amber/coral palette)
- Glass-morphism components: `.glass`, `.glass2`
- Gradient text: `.gradient-text`
- Font stack: Outfit (display), Inter (body), JetBrains Mono (mono)

## Database Tables

| Table | Key Columns |
|-------|-------------|
| `users` | `id`, `full_name`, `email`, `role` |
| `courses` | `id`, `title`, `description`, `category`, `status`, `teacher_id`, `lesson_count`, `duration` |
| `enrollments` | `id`, `student_id`, `course_id`, `progress`, `status` |
| `modules` | `id`, `course_id`, `title`, `position` |
| `lessons` | `id`, `module_id`, `title`, `content_url`, `content_type`, `position` |
| `lesson_progress` | `lesson_id`, `student_id`, `completed` |
| `assignments` | `id`, `module_id`, `title`, `description`, `instructions`, `due_date`, `max_score`, `position` |
| `assignment_submissions` | `id`, `assignment_id`, `student_id`, `submission_text`, `file_name`, `file_path`, `score`, `feedback`, `status`, `submitted_at`, `graded_at` |

---

For detailed architecture, database design, feature workflows, and engineering decisions → [docs/DOCUMENTATION.md](docs/DOCUMENTATION.md)
