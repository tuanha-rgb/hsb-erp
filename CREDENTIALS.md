# HSB-ERP System Credentials

This file contains the login credentials for the HSB-ERP system.

## Demo Passwords

### Admin Access
- **Password:** `admin123`
- **Access Level:** Full administrative access to ERPLayout
- **Features:** Complete ERP system control, all modules, full permissions

### Staff/Lecturer Access
- **Password:** `staff123` or `lecturer123`
- **Access Level:** Lecturer/Staff view
- **Features:** Teaching, research, schedule, Canvas/LMS access

### Student Access
- **Password:** `student123`
- **Access Level:** Student view
- **Features:** Profile, academic records, courses, activities, events

## Security Notes

⚠️ **IMPORTANT:** These are demo passwords for development purposes only.

- Do **NOT** use these passwords in production
- Change all passwords before deploying to production
- Implement proper authentication (Firebase Auth, OAuth, etc.) for production use
- Store production credentials securely using environment variables

## Implementation Details

The current authentication system is password-based and stored in:
- **File:** `src/Login.tsx`
- **Validation:** Simple string comparison in `handleSubmit` function
- **Storage:** User role persisted in `localStorage`

### To Change Passwords

Edit the password validation in `src/Login.tsx`:

```typescript
if (password === 'admin123') {
  onLogin('admin');
} else if (password === 'staff123' || password === 'lecturer123') {
  onLogin('staff');
} else if (password === 'student123') {
  onLogin('student');
}
```

## Future Improvements

For production deployment, replace the current system with:

1. **Firebase Authentication**
   - Email/password authentication
   - Social login (Google, Microsoft)
   - Multi-factor authentication

2. **Role Management**
   - Store user roles in Firebase Firestore
   - Implement role-based access control (RBAC)
   - User management dashboard

3. **Session Management**
   - Secure session tokens
   - Automatic session expiry
   - Remember me functionality

---

**Last Updated:** 2025-11-11
**System Version:** Development
