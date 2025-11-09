# Document Category Migration Guide

## Issue: Duplicate Categories

If you're seeing duplicate categories (e.g., 2 Academic, 2 Administrative), this is because the old system created single-language categories and the new system uses bilingual names.

---

## New Bilingual Categories

The updated system uses **English / Vietnamese** format for all categories:

1. 📚 **Academic / ĐT&CTSV** - Đào tạo và Công tác sinh viên
2. 💰 **Financial / KHTC** - Kế hoạch tài chính
3. 👥 **HR / TCCB** - Tổ chức cán bộ
4. 🔬 **Research / NCKH** - Nghiên cứu khoa học
5. 🌐 **International / HTQT** - Hợp tác quốc tế
6. 📋 **Administrative / HTPT** - Hành chính phòng ban
7. 📄 **General / Chung** - Văn bản chung

---

## How to Fix Duplicates

### Option 1: Using Category Manager (Recommended)

**Step 1**: Navigate to Documents menu
```
Documents → Category Manager
```

**Step 2**: Click "Load Categories"
- This shows all current categories in your database
- You'll see duplicates if they exist

**Step 3**: Click "Re-initialize"
- **Warning**: This will DELETE all existing categories!
- Creates new bilingual categories
- Fixes all duplicates

**Step 4**: Verify
- Click "Load Categories" again
- You should see exactly 7 bilingual categories

### Option 2: Manual via Browser Console

If you prefer to run commands directly:

```javascript
// Import the service
import { documentService } from './firebase/document.service';

// Re-initialize categories (deletes old, creates new)
await documentService.reinitializeCategories();

// Verify
const categories = await documentService.getAllCategories();
console.log('Categories:', categories);
```

---

## Migration Impact

### ⚠️ Important Notes

1. **Existing Documents**: Documents will NOT be deleted
   - However, their `category` field will reference old category IDs
   - You may need to update documents to use new category IDs

2. **Category References**: If you have documents referencing old categories:
   - Option A: Manually reassign documents to new categories
   - Option B: Update category IDs in documents collection

### Update Document Categories (If Needed)

```javascript
// Get all documents
const documents = await documentService.getAllDocuments();

// Get new categories
const categories = await documentService.getAllCategories();

// Map old names to new categories
const categoryMap = {
  'Academic': 'Academic / ĐT&CTSV',
  'Financial': 'Financial / KHTC',
  'HR': 'HR / TCCB',
  'Research': 'Research / NCKH',
  'Administrative': 'Administrative / HTPT',
  'General': 'General / Chung'
};

// Update each document
for (const doc of documents) {
  const oldCategoryName = doc.categoryName; // if you stored name
  const newCategory = categories.find(c => c.name === categoryMap[oldCategoryName]);

  if (newCategory) {
    await documentService.updateDocument(doc.id, {
      category: newCategory.id
    });
  }
}
```

---

## Verification Checklist

After migration, verify:

- [ ] Exactly 7 categories exist
- [ ] All categories have bilingual names (English / Vietnamese)
- [ ] No duplicate categories
- [ ] Category icons display correctly
- [ ] Category colors match specification
- [ ] Documents can be uploaded with new categories
- [ ] Category dropdown shows bilingual names

---

## Category Specifications

### Icons
- Academic: 📚
- Financial: 💰
- HR: 👥
- Research: 🔬
- International: 🌐 (not 🌍)
- Administrative: 📋
- General: 📄

### Colors
- Academic: `#3B82F6` (Blue)
- Financial: `#F59E0B` (Orange)
- HR: `#EC4899` (Pink)
- Research: `#8B5CF6` (Purple)
- International: `#10B981` (Green)
- Administrative: `#06B6D4` (Cyan)
- General: `#6B7280` (Gray)

---

## Rollback (If Needed)

If something goes wrong, you can restore old categories:

1. Go to Firebase Console → Firestore
2. Navigate to `document_categories` collection
3. Manually add back old categories, OR
4. Use the CategoryManager "Initialize" button (only if collection is empty)

---

## Support

If you encounter issues:

1. Check browser console for errors
2. Verify Firebase Firestore rules allow writes
3. Ensure you have admin permissions
4. Check network connectivity to Firebase

For questions, refer to:
- `src/documents/README.md` - Full documentation
- `src/firebase/document.service.ts` - Service implementation
- `src/documents/CategoryManager.tsx` - UI tool

---

**Last Updated**: 2025-01-09
**Version**: 2.0 (Bilingual Categories)
