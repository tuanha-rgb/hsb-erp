// DocumentListExample.tsx
// Example usage of the DocumentList component

import { useState } from 'react';
import DocumentList from './DocumentList';
import DocumentUpload from './DocumentUpload';

export default function DocumentListExample() {
  const [view, setView] = useState<'list' | 'upload'>('list');

  // Example user data - replace with actual auth context
  const currentUser = {
    id: 'student-001', // Or staff-001, etc.
    name: 'Nguyen Van A',
    type: 'student' as const
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Upload Button */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">
            Document Management System
          </h1>
          <button
            onClick={() => setView(view === 'list' ? 'upload' : 'list')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            {view === 'list' ? 'Upload Document' : 'View Documents'}
          </button>
        </div>

        {/* Content */}
        {view === 'list' ? (
          <DocumentList
            userId={currentUser.id}
            userName={currentUser.name}
            userType={currentUser.type}
          />
        ) : (
          <DocumentUpload
            uploaderId={currentUser.id}
            uploaderName={currentUser.name}
            onSuccess={(docId) => {
              console.log('Document uploaded:', docId);
              setView('list');
            }}
            onClose={() => setView('list')}
          />
        )}
      </div>
    </div>
  );
}

/*
===========================================
DOCUMENTLIST COMPONENT - USAGE GUIDE
===========================================

## IMPORT
```tsx
import DocumentList from './documents/DocumentList';
```

## BASIC USAGE
```tsx
<DocumentList
  userId="student-001"
  userName="Nguyen Van A"
  userType="student"
/>
```

## PROPS
- userId (string, required): Current user's ID (Student_Code or Staff ID)
  - Used to filter documents where user is recipient or uploader
- userName (string, optional): Display name shown in header
- userType ('student' | 'staff' | 'lecturer', optional): User role type
  - Default: 'student'

===========================================
FEATURES
===========================================

### THREE TABS

1. **Văn bản đến (Incoming Documents)**
   - Filter: type='incoming' AND recipientId=currentUser
   - Shows documents sent TO the current user
   - Displays unread count badge (red)
   - Real-time sync via Firestore listeners

2. **Văn bản đi (Outgoing Documents)**
   - Filter: type='outgoing' AND uploaderId=currentUser
   - Shows documents sent BY the current user
   - No read/unread status (always "sent")

3. **Văn bản chờ xử lý (Pending Documents)**
   - Filter: type='pending' AND recipientId=currentUser AND readStatus=false
   - Shows UNREAD pending documents only
   - Displays count badge (orange)
   - Auto-removes from list when marked as read

### SEARCH & FILTER

- **Search**: Filter by document title or description (case-insensitive)
- **Category Filter**: Dropdown to filter by document category
  - Academic, Administrative, Financial, Research, HR, Legal, General

### DOCUMENT ROWS

Each row displays:
- ✅ **Icon**: Red PDF file icon
- ✅ **Title**: Document title (clickable)
- ✅ **Description**: Truncated description (if available)
- ✅ **Category Badge**: Color-coded with category icon
- ✅ **Date**: Upload date and time (Vietnamese format)
- ✅ **Priority Indicator**:
  - Red pulsing dot + "Urgent" (urgent priority)
  - Gray dot + "Normal" (normal priority)
- ✅ **Read Status** (incoming/pending only):
  - Green checkmark (read)
  - Orange alert icon (unread)

### PDF VIEWER MODAL

Click any document row to:
1. Open full-screen PDF viewer modal
2. **Auto-mark as read** (for incoming/pending documents)
3. Features:
   - Page navigation (prev/next, jump to page)
   - Zoom controls (50% - 300%)
   - Download button
   - Print button
   - Keyboard shortcuts (arrows, Esc)

===========================================
REAL-TIME SYNC
===========================================

Uses Firestore `onSnapshot` listeners for:
- **Live updates**: New documents appear automatically
- **Read status sync**: Changes reflect across all devices
- **Badge counters**: Unread counts update in real-time

### Data Flow (Incoming/Pending)
1. Query `document_recipients` collection WHERE recipientId = currentUser
2. Extract document IDs from recipient records
3. Fetch documents in batches (10 per query due to Firestore 'in' limit)
4. Filter by document type (incoming/pending)
5. Enrich with category data
6. Sort by uploadDate (descending)

### Data Flow (Outgoing)
1. Query `documents` collection WHERE uploaderId = currentUser AND type = 'outgoing'
2. Enrich with category data
3. Sort by uploadDate (descending)

===========================================
MARK AS READ FUNCTIONALITY
===========================================

Automatically triggered when user clicks document:
```typescript
await documentService.markAsRead(docId, userId);
```

Updates:
- `document_recipients.readStatus = true`
- `document_recipients.readAt = serverTimestamp()`
- UI shows success toast
- Badge counters decrement
- Pending documents removed from list

===========================================
INTEGRATION EXAMPLE
===========================================

### With Authentication Context
```tsx
import { useAuth } from '../authContext';
import DocumentList from './documents/DocumentList';

function DocumentsPage() {
  const { currentUser } = useAuth();

  return (
    <DocumentList
      userId={currentUser.studentCode || currentUser.id}
      userName={currentUser.name}
      userType={currentUser.role}
    />
  );
}
```

### In ERPLayout.tsx
```tsx
// Add to navigation.ts
{
  key: 'documents',
  label: 'Documents',
  icon: 'FileText',
  submenu: [
    { key: 'my-documents', label: 'My Documents' },
    { key: 'upload-document', label: 'Upload Document' }
  ]
}

// In ERPLayout.tsx
import DocumentList from './documents/DocumentList';
import DocumentUpload from './documents/DocumentUpload';

// In render logic
{submenuItem === 'my-documents' && (
  <DocumentList
    userId={userId}
    userName={userName}
    userType={userType}
  />
)}

{submenuItem === 'upload-document' && (
  <DocumentUpload
    uploaderId={userId}
    uploaderName={userName}
    onSuccess={(docId) => {
      setSubmenuItem('my-documents');
      showToast('Document uploaded successfully!');
    }}
    onClose={() => setSubmenuItem('my-documents')}
  />
)}
```

===========================================
STYLING
===========================================

Uses Tailwind CSS with:
- **Responsive grid layout**: 12-column system
- **Hover states**: Gray background on row hover
- **Color coding**:
  - Blue: Tab active state, links
  - Red: Urgent priority, PDF icon, unread badge
  - Orange: Pending badge, unread icon
  - Green: Read status checkmark
- **Animations**:
  - Toast slide-in (from project.css)
  - Pulsing dot for urgent priority
  - Spinner for loading states

===========================================
PERFORMANCE OPTIMIZATIONS
===========================================

1. **Batch Queries**: Documents fetched in batches of 10 (Firestore 'in' limit)
2. **Real-time Filtering**: Tab changes trigger new listeners (cleanup old ones)
3. **Lazy Enrichment**: Category data loaded separately to avoid N+1 queries
4. **Conditional Rendering**: PDF viewer only renders when document selected
5. **Canvas Rendering**: PDF.js renders pages on-demand (not all at once)

===========================================
KNOWN LIMITATIONS
===========================================

1. **Firestore 'in' Query Limit**: Maximum 10 document IDs per query
   - Solution: Batching implemented (handles unlimited documents)

2. **No Pagination**: All documents loaded at once
   - Recommendation: Add pagination for users with 100+ documents

3. **No Sorting Options**: Fixed sort by uploadDate (descending)
   - Recommendation: Add sort dropdown (date, title, priority)

4. **No Bulk Actions**: Can't mark multiple documents as read
   - Recommendation: Add checkbox selection + bulk actions

5. **No Document Preview**: Must click to view full PDF
   - Recommendation: Add thumbnail preview on hover

===========================================
TROUBLESHOOTING
===========================================

### Issue: Documents not loading
**Check:**
1. Firestore security rules allow read access
2. userId matches recipientId in document_recipients
3. Browser console for errors
4. Network tab for Firestore requests

### Issue: Mark as read not working
**Check:**
1. documentService.markAsRead() not throwing errors
2. Firestore rules allow write to document_recipients
3. recipientId matches userId exactly

### Issue: PDF viewer blank screen
**Check:**
1. document.fileUrl is valid Firebase Storage URL
2. PDF.js worker loaded correctly (check network tab)
3. CORS headers on Firebase Storage

### Issue: Real-time sync not updating
**Check:**
1. onSnapshot listeners not being unsubscribed prematurely
2. Firestore offline persistence settings
3. Network connectivity

===========================================
NEXT STEPS
===========================================

Recommended enhancements:
1. **Notifications**: Browser push notifications for urgent documents
2. **Comments**: Add comment thread to each document
3. **Versions**: Track document revisions
4. **Workflow**: Approval workflow for pending documents
5. **Analytics**: Track view time, downloads per document
6. **Export**: Bulk download multiple documents as ZIP
7. **Tags**: Custom tags beyond categories
8. **Archive**: Move old documents to archive tab

*/
