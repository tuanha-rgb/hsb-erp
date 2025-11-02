# Firebase Library Integration - Setup Guide

## Quick Start (15 minutes)

### 1. Install Firebase
```bash
npm install firebase
```

### 2. Create Firebase Project
1. Go to https://console.firebase.google.com
2. Click "Add project"
3. Name it (e.g., "university-erp")
4. Disable Google Analytics (optional)
5. Click "Create project"

### 3. Get Firebase Config
1. In Firebase Console → Project Settings (gear icon)
2. Scroll to "Your apps" → Click Web icon (</>)
3. Register app (name: "university-web")
4. Copy the firebaseConfig object

### 4. Configure Your App
**Replace** the config in `firebase.config.ts`:
```typescript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### 5. Enable Firestore Database
1. Firebase Console → Build → Firestore Database
2. Click "Create database"
3. **Start in test mode** (for development)
4. Choose location (asia-southeast1 for Vietnam)
5. Click "Enable"

### 6. Update Your Files

**Copy these files to your project:**
- `firebase.config.ts` → `/src/firebase.config.ts`
- `book.service.ts` → `/src/library/book.service.ts`
- `BookManagement.updated.tsx` → **Replace** `/src/library/BookManagement.tsx`

**Update libraryviewer.tsx:**
Add this at the top:
```typescript
import { bookService } from './book.service';
```

Replace static `bookRecords` with:
```typescript
const [books, setBooks] = useState<BookRecord[]>([]);

useEffect(() => {
  bookService.getAllBooks().then(firebaseBooks => {
    // Transform and set books
    setBooks(transformedBooks);
  });
}, []);
```

For carousel, replace `carouselSlides` with:
```typescript
const [carouselSlides, setCarouselSlides] = useState<CarouselSlide[]>([]);

useEffect(() => {
  bookService.getFeaturedBooks().then(featured => {
    const slides = featured.map(book => ({
      id: book.id,
      title: book.title,
      description: book.description || book.author,
      image: book.coverImage || 'placeholder-url',
      badge: 'FEATURED',
      color: 'from-blue-500 to-blue-600'
    }));
    setCarouselSlides(slides);
  });
}, []);
```

## How It Works

### Adding Books
1. Click "Add Book" in BookManagement
2. Fill form → Submit
3. Book saved to Firebase
4. **Automatically appears** in Library Viewer
5. If "Featured" checked → **Shows in carousel**

### Data Flow
```
BookManagement → bookService.addBook() → Firebase Firestore
                                              ↓
Library Viewer ← bookService.getAllBooks() ←┘
        ↓
Carousel ← bookService.getFeaturedBooks() (featured = true)
```

## Security Rules (Production)

Before deploying, update Firestore rules:

1. Firebase Console → Firestore → Rules
2. Replace with:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /books/{bookId} {
      // Admins can write, everyone can read
      allow read: if true;
      allow write: if request.auth != null && 
                   request.auth.token.role == 'admin';
    }
  }
}
```

## Troubleshooting

**Error: "Firebase not initialized"**
→ Check firebase.config.ts has correct credentials

**Error: "Permission denied"**
→ Firestore rules too strict, use test mode for dev

**Books not appearing**
→ Check browser console, verify Firebase connection

**Carousel empty**
→ No books marked as featured, check database

## Next Steps

1. **Auth**: Add Firebase Authentication for user login
2. **Storage**: Upload book covers with Firebase Storage
3. **Real-time**: Auto-refresh when books added (already supported)
4. **Backup**: Export/import book data

## Cost
- **Free tier**: 50k reads + 20k writes per day
- **Your scale**: ~1000 students × 10 reads/day = 10k reads
- **Verdict**: FREE forever

## Support
Issues? Check:
- Firebase Console → Usage tab
- Browser DevTools → Console
- Network tab for failed requests
