// DocumentUploadExample.tsx
// Example usage of the DocumentUpload component

import { useState } from 'react';
import DocumentUpload from './DocumentUpload';

export default function DocumentUploadExample() {
  const [showUpload, setShowUpload] = useState(false);

  const handleSuccess = (docId: string) => {
    console.log('Document uploaded successfully:', docId);
    // You can navigate to the document view or refresh the document list here
    setShowUpload(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Document Management System
        </h1>

        {!showUpload ? (
          <div className="bg-white rounded-lg shadow p-6">
            <button
              onClick={() => setShowUpload(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Upload New Document
            </button>
          </div>
        ) : (
          <DocumentUpload
            uploaderId="admin-001"
            uploaderName="Admin User"
            onSuccess={handleSuccess}
            onClose={() => setShowUpload(false)}
          />
        )}
      </div>
    </div>
  );
}

/*
===========================================
USAGE INSTRUCTIONS
===========================================

1. Import the component:
   import DocumentUpload from './documents/DocumentUpload';

2. Basic usage with required props:
   <DocumentUpload
     uploaderId="user-123"
     uploaderName="John Doe"
   />

3. With callbacks:
   <DocumentUpload
     uploaderId="user-123"
     uploaderName="John Doe"
     onSuccess={(docId) => {
       console.log('Document uploaded:', docId);
       // Navigate or refresh list
     }}
     onClose={() => {
       console.log('Upload cancelled');
       // Close modal or navigate back
     }}
   />

===========================================
PROPS
===========================================

- uploaderId (string, required): The ID of the user uploading the document
- uploaderName (string, required): The name of the user uploading the document
- onSuccess (function, optional): Callback fired when document is successfully uploaded
  - Receives: docId (string) - The Firestore document ID
- onClose (function, optional): Callback fired when user clicks close/cancel
  - If provided, shows a close button and cancel button

===========================================
FEATURES
===========================================

✅ Form Fields:
   - Title (text input)
   - Document Type (dropdown): Văn bản đến, Văn bản đi, Văn bản chờ xử lý
   - Category (dropdown): Auto-loaded from Firestore, with default categories
   - Priority (toggle): Normal or Urgent
   - Description (textarea, optional)
   - File upload (PDF only, max 10MB)

✅ Recipient Selection:
   - Search by name, ID, or email
   - Filter by recipient type: Student, Lecturer, Staff
   - Multi-select recipients
   - "Select All [Type]" button for bulk selection
   - Visual tags showing recipient type

✅ Upload Progress:
   - Real-time progress bar during file upload
   - Firebase Storage integration
   - Automatic file URL generation

✅ Data Flow:
   1. Upload PDF to Firebase Storage (/documents folder)
   2. Create document record in Firestore (documents collection)
   3. Create recipient records in Firestore (document_recipients collection)
   4. Show success notification with recipient count

✅ Validation:
   - Title required
   - Category required
   - PDF file required (type and size validation)
   - At least one recipient required

✅ Toast Notifications:
   - Success messages (green)
   - Error messages (red)
   - Info messages (blue)
   - Auto-dismiss after 4 seconds

===========================================
FIRESTORE STRUCTURE
===========================================

Documents Collection (documents):
{
  id: "auto-generated",
  title: "Document Title",
  type: "incoming" | "outgoing" | "pending",
  category: "category-id",
  fileUrl: "https://firebase-storage-url",
  uploaderId: "user-123",
  uploadDate: Timestamp,
  priority: "normal" | "urgent",
  status: "approved",
  description: "Optional description",
  tags: [],
  createdAt: Timestamp,
  updatedAt: Timestamp
}

Document Recipients Collection (document_recipients):
{
  id: "auto-generated",
  docId: "document-id",
  recipientId: "student-id or staff-id",
  recipientType: "student" | "staff" | "lecturer",
  recipientName: "John Doe",
  recipientEmail: "john@example.com",
  readStatus: false,
  readAt: null,
  createdAt: Timestamp,
  updatedAt: Timestamp
}

===========================================
INTEGRATION WITH ERPLAYOUT
===========================================

To integrate into ERPLayout.tsx:

1. Import the component:
   import DocumentUpload from './documents/DocumentUpload';

2. Add state for showing upload form:
   const [showDocUpload, setShowDocUpload] = useState(false);

3. Add menu item in navigation.ts:
   {
     key: 'upload-document',
     label: 'Upload Document',
     icon: 'Upload'
   }

4. Add conditional rendering in ERPLayout:
   {submenuItem === 'upload-document' && (
     <DocumentUpload
       uploaderId={userId}
       uploaderName={userName}
       onSuccess={(docId) => {
         console.log('Uploaded:', docId);
         setSubmenuItem('documents-list');
       }}
       onClose={() => setSubmenuItem('documents-list')}
     />
   )}

===========================================
DEPENDENCIES
===========================================

Required packages (already in package.json):
- firebase: For Storage and Firestore
- lucide-react: For icons
- react: Core React library

Required services:
- Firebase Storage: Enabled in Firebase Console
- Firestore: documents, document_recipients, document_categories collections
- Zoho API: For fetching students/lecturers (requires backend proxy running)

Backend Server:
- Start: cd server && node zoho-proxy.js
- Port: 3001
- Endpoints: /api/zoho/users?type=students|lecturers

===========================================
TROUBLESHOOTING
===========================================

Issue: "Failed to load recipients"
Solution: Ensure Zoho proxy server is running on port 3001

Issue: "File upload failed"
Solution: Check Firebase Storage rules allow writes

Issue: "Categories not loading"
Solution: Will auto-initialize default categories on first load

Issue: PDF validation error
Solution: Ensure file is PDF type and under 10MB

===========================================
NEXT STEPS
===========================================

Recommended components to build next:
1. DocumentList.tsx - List all documents with filters
2. DocumentViewer.tsx - View PDF with pdfjs (like LibraryViewer)
3. DocumentDashboard.tsx - Tabs for incoming/outgoing/pending
4. DocumentNotifications.tsx - Unread document badge

*/
