# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**HSB-ERP** is a comprehensive university Enterprise Resource Planning system built with React 18.3.1, TypeScript, Vite 7.1.10, Firebase, and Zoho Creator integration. It manages academic programs, student services, research, library, attendance, polling, and administrative operations for a Vietnamese university.

## Development Commands

### Frontend (Vite + React)
```bash
npm run dev      # Start Vite dev server (default: http://localhost:5173)
npm run build    # Build production bundle (TypeScript check + Vite build)
npm run preview  # Preview production build locally
```

### Backend (Zoho Proxy Server)
```bash
cd server && node zoho-proxy.js  # Start Express proxy server on port 3001
```

**Important**: The Zoho proxy server must be running when testing Zoho integration features (Account Management, student/lecturer data fetching).

## Architecture

### Core Structure

The application uses a **single-page monolithic architecture** with role-based views rendered through the central `ERPLayout.tsx` file:

```
src/
├── ERPLayout.tsx          # Main layout & routing hub (680KB - controls all views)
├── App.tsx                # Auth wrapper (wraps ERPLayout with AuthContext)
├── main.tsx               # Entry point
├── navigation.ts          # Role-based navigation config (admin/student/lecturer/dept/faculty)
├── RoleDropdown.tsx       # User role switcher component
│
├── acad/                  # Academic data (faculties, programs, courses, thesis)
├── account/               # Account Management with Zoho integration
├── attendance/            # Attendance tracking with AI camera integration
├── documents/             # Document management & digital signatures
├── firebase/              # Firebase services (auth, firestore, storage)
│   ├── firebase.config.ts
│   ├── publication.service.ts
│   └── book.service.ts
├── library/               # Book management, thesis storage, online viewer
├── research/              # Research projects, publications, patents
├── services/              # Shared service utilities
├── shop/                  # HSB-Shop e-commerce module
├── student/               # Student services (scholarships, feedback, grades)
├── zoho/                  # Zoho Creator integration
│   └── zoho-api.ts        # Frontend API client
│
├── PollSystem.tsx         # Real-time polling/voting with Firebase
├── student.tsx            # Student view component (311KB)
└── lecturer.tsx           # Lecturer view component (142KB)
```

### State Management

**No Redux/Zustand** - Uses React hooks (useState, useEffect, useMemo) with component-level state and prop drilling through ERPLayout.tsx. Firebase real-time listeners manage server state for polls, documents, and library items.

### Database Architecture

**Dual Database System:**

1. **Firebase Firestore** (Real-time features)
   - Polls & voting (`polls` collection with nested `votes` and `views` subcollections)
   - Publications (`publications` collection)
   - Books (`books` collection)
   - Thesis storage metadata

2. **Zoho Creator** (Student/Staff data via REST API)
   - Student profiles (via custom function `getAllStudents`)
   - Lecturer profiles (via custom function `getAllLecturers`)
   - Accessed through backend proxy (`server/zoho-proxy.js`) to avoid CORS

**Backend Proxy Configuration**:
- The Zoho API requires a backend proxy server (`server/zoho-proxy.js`) running on port 3001
- Frontend calls `http://localhost:3001/api/zoho/*` endpoints
- Proxy forwards requests to Zoho Creator with Public Key authentication
- Environment variables (`.env`): `VITE_ZOHO_STUDENTS_PUBLIC_KEY`, `VITE_ZOHO_LECTURERS_PUBLIC_KEY`, `VITE_API_BASE_URL`

### Navigation System

**Role-Based Access Control** defined in `src/navigation.ts`:

- `admin`: Full access to all modules (students, lecturers, departments, library, finance, documents, polls, etc.)
- `student`: Profile, academic, finance, activities, Canvas/LMS, events
- `lecturer`: Profile, teaching, schedule, research, Canvas/LMS, messages
- `department`: Operations, work schedule, HR, KPIs, facility management
- `faculty`: Faculty/department overview, research output, student stats, curriculum

The `ERPLayout.tsx` component switches between views based on:
1. Selected `userType` (from RoleDropdown)
2. Active `menuItem` and `submenuItem` from navigation config

### Poll System Architecture

**Draft → Publish Workflow with Real-time Firebase Integration:**

1. **Draft Mode**: Polls created with `status: 'draft'` and `isLocked: false`
   - Only creator can see draft polls
   - Edit button available for unlocked drafts
   - Publish button locks and activates poll

2. **Active Polls**: `status: 'active'` and `isLocked: true`
   - Real-time view tracking (Firestore subcollection `polls/{id}/views/{userId}`)
   - Atomic vote counting with `increment(1)`
   - Vote validation (prevents duplicate votes via `polls/{id}/votes/{userId}`)

3. **Targeting & Distribution**:
   - Level-based: `targetLevel` (student/staff/management/all)
   - Cohort/Department/Program-based (fields: `targetCohorts[]`, `targetDepartments[]`, `targetPrograms[]`)
   - View analytics: `viewCount`, `expectedRecipients`

4. **Real-time Updates**: Uses `onSnapshot` listener for live vote count updates

### Styling

**TailwindCSS 3.4.18** with custom styles in `project.css` (19KB). Components use inline Tailwind classes. No CSS modules or styled-components.

## Key Patterns

### Firestore Real-time Listeners

```typescript
// Pattern used throughout (PollSystem, LibraryDashboard, etc.)
useEffect(() => {
  const unsub = onSnapshot(
    collection(db, 'polls'),
    (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setState(data);
    },
    (error) => {
      console.error('Firestore error:', error);
      showToast('Connection error', 'error');
    }
  );
  return unsub; // Cleanup
}, [dependencies]);
```

### Zoho API Integration Pattern

```typescript
// Frontend (src/zoho/zoho-api.ts)
export async function getZohoUsers(options?: { type: 'students' | 'lecturers' }) {
  const response = await fetch(`${API_BASE_URL}/zoho/users?type=${options.type}`);
  const data = await response.json();
  return data.data || [];
}

// Backend proxy translates to:
// https://www.zohoapis.com/creator/custom/hsbvnu/getAllStudents?zc_PublicKey=...
```

### Toast Notifications

Reusable toast notification pattern (implemented in PollSystem):

```typescript
const [toasts, setToasts] = useState<Toast[]>([]);

const showToast = (message: string, type: 'success' | 'error' | 'info') => {
  const id = Date.now().toString();
  setToasts(prev => [...prev, { id, message, type }]);
  setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
};
```

## Environment Variables

Required in `.env`:

```env
# Firebase
VITE_FIREBASE_API=<firebase-api-key>
VITE_FIREBASE_AUTH_DOMAIN=<project>.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=<project-id>
VITE_FIREBASE_STORAGE_BUCKET=<project>.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=<sender-id>
VITE_FIREBASE_APP_ID=<app-id>
VITE_FIREBASE_LOGGING=false  # Set to 'false' to disable Firebase logs

# Zoho Creator (Public Key Auth)
VITE_ZOHO_STUDENTS_PUBLIC_KEY=<public-key>
VITE_ZOHO_LECTURERS_PUBLIC_KEY=<public-key>

# Backend API
VITE_API_BASE_URL=http://localhost:3001/api
```

## Important Constraints

1. **Large Component Files**: `ERPLayout.tsx` (680KB), `student.tsx` (311KB), `lecturer.tsx` (142KB) are intentionally monolithic. Do NOT attempt to break them apart unless explicitly requested.

2. **No Test Suite**: Project has no test configuration. Do not add testing libraries or write tests unless specifically asked.

3. **TypeScript Strict Mode**: Enabled in `tsconfig.json`. All new code must type-check with `tsc -b` before committing.

4. **Import Paths**: Use relative imports (`./`, `../`). No path aliases configured.

5. **Firebase Rules**: Assume permissive rules for development. Production deployment requires securing Firestore rules for `polls`, `publications`, and `books` collections.

6. **Zoho API Limitations**:
   - Public Key authentication (not OAuth)
   - Custom functions must be published in Zoho Creator interface
   - CORS restrictions require backend proxy

## Module Interdependencies

### Critical Dependencies

- **ERPLayout ← All Modules**: ERPLayout imports and renders all major components
- **PollSystem → Firebase**: Direct Firestore integration for real-time polls
- **AccountManagement → Zoho API → Backend Proxy**: Account management depends on running Zoho proxy server
- **LibraryViewer → Firebase Storage**: PDF/EPUB rendering requires Firebase storage URLs
- **AttendanceLive → AttendanceModel**: Attendance components depend on shared data model
- **ResearchManagement → Firebase**: Publications service for research output tracking

### Data Flow

```
User Role Selection (RoleDropdown)
    ↓
ERPLayout.tsx (central router)
    ↓
Navigation Config (navigation.ts)
    ↓
Component Rendering (based on menuItem/submenuItem)
    ↓
Data Fetching (Firebase onSnapshot / Zoho API)
    ↓
State Updates (useState hooks)
    ↓
UI Rendering (Tailwind CSS)
```

## Performance Considerations

1. **Large Bundle Size**: ~2.3MB production bundle (warnings expected)
   - Consider code-splitting if adding more large modules
   - PDF.js worker (1MB) contributes significantly

2. **Real-time Listeners**: Clean up Firestore listeners in useEffect cleanup to prevent memory leaks

3. **Prop Drilling**: Deep prop chains in ERPLayout may impact performance. Consider React Context for deeply nested state.

## Development Workflow

1. Start backend proxy: `cd server && node zoho-proxy.js`
2. Start frontend: `npm run dev` (separate terminal)
3. Test Zoho features: Ensure `.env` has correct public keys
4. Test Firebase features: Ensure Firebase config is correct
5. Build before committing: `npm run build`

The claude.md file was missing because this is a development repository focused on rapid iteration rather than documentation-first development.
