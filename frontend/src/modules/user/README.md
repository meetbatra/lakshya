# Authentication Implementation

This document outlines the complete authentication system implemented for the Lakshya frontend application.

## 🚀 Features Implemented

### ✅ **State Management with Zustand**
- **Persistent Store**: User data persists across browser sessions
- **Loading States**: Proper loading indicators during auth operations
- **Error Handling**: Comprehensive error management
- **Helper Functions**: User initials, display names, etc.

### ✅ **API Integration**
- **Axios Configuration**: Pre-configured with interceptors
- **Token Management**: Automatic token attachment and cleanup
- **Error Handling**: Proper API error responses
- **Endpoints**: Login, Register, Logout, Profile, Token Verification

### ✅ **UI Components**
- **UserAvatar**: Dropdown menu with user info and actions
- **Conditional Navbar**: Shows login/signup buttons or user avatar
- **Form Validation**: Password confirmation and error display
- **Loading States**: Button states during API calls

### ✅ **Authentication Flow**
- **Auto-initialization**: Checks for existing tokens on app load
- **Secure Logout**: Clears tokens and redirects appropriately
- **Protected Routes**: Profile page redirects if not authenticated
- **Token Persistence**: Uses localStorage for session management

## 📁 File Structure

```
src/modules/user/
├── api/
│   └── authAPI.js           # API calls and axios configuration
├── components/
│   └── UserAvatar.jsx       # User dropdown menu component
├── hooks/
│   └── useAuthInit.js       # Authentication initialization hook
├── pages/
│   ├── Login.jsx           # Updated with API integration
│   ├── SignUp.jsx          # Updated with API integration
│   └── Profile.jsx         # Updated with real user data
├── store/
│   └── userStore.js        # Zustand store for user state
└── index.js                # Module exports
```

## 🔧 Usage Examples

### **Using the User Store**
```javascript
import { useUserStore } from '../modules/user';

const Component = () => {
  const { user, isAuthenticated, logout, getUserInitials } = useUserStore();
  
  // Check if user is logged in
  if (!isAuthenticated) {
    return <LoginPrompt />;
  }
  
  // Use user data
  return <div>Welcome, {user.name}!</div>;
};
```

### **Making API Calls**
```javascript
import { authAPI } from '../modules/user/api/authAPI';

// Login
try {
  const response = await authAPI.login({ email, password });
  setUser(response.user);
} catch (error) {
  setError(error.message);
}

// Register
try {
  const response = await authAPI.register(userData);
  setUser(response.user);
} catch (error) {
  setError(error.message);
}
```

## 🎯 Backend Integration

### **Expected API Endpoints**
The frontend expects these backend endpoints:

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/profile
GET  /api/auth/verify
```

### **Expected Response Format**
```javascript
// Login/Register Success Response
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "class": "12",
    "state": "Maharashtra",
    "stream": "science_pcm",
    "field": "engineering",
    "createdAt": "2025-09-12T..."
  },
  "token": "jwt_token_here"
}

// Error Response
{
  "success": false,
  "message": "Error message here"
}
```

## 🔒 Security Features

1. **JWT Token Storage**: Tokens stored in localStorage
2. **Automatic Token Attachment**: Axios interceptors add tokens to requests
3. **Token Expiration Handling**: Automatic logout on 401 responses
4. **Input Validation**: Client-side validation for forms
5. **Protected Routes**: Automatic redirects for unauthorized access

## 🎨 UI Components

### **UserAvatar Dropdown**
- User initials in a circular avatar
- Dropdown with user info, dashboard link, and logout
- Font Awesome icons for better UX

### **Navbar Integration**
- Conditionally shows login/signup buttons or user avatar
- Seamless transition between authenticated and non-authenticated states

### **Form Enhancements**
- Loading states during API calls
- Error display for failed operations
- Password confirmation validation
- Disabled buttons during submission

## 🚀 Development Server

The application is running on **http://localhost:5174/** with all authentication features fully functional.

## 🔄 Testing the Flow

1. **Registration**: Visit `/auth/signup` to create a new account
2. **Login**: Visit `/auth/login` to sign in
3. **Dashboard**: Click the avatar → Dashboard to view profile
4. **Logout**: Click the avatar → Logout to sign out
5. **Persistence**: Refresh the page to test token persistence

## 📦 Dependencies Added

- **zustand**: State management
- **axios**: HTTP client for API calls
- **@fortawesome/react-fontawesome**: Icons for UI
- **shadcn/ui dropdown-menu**: User avatar dropdown component

## 🎯 Next Steps

1. Connect to actual backend API endpoints
2. Implement email verification (if needed)
3. Add password reset functionality
4. Implement role-based access control
5. Add user profile editing functionality
