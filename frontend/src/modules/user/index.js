// User module exports
export { default as Login } from './pages/Login';
export { default as SignUp } from './pages/SignUp';
export { default as Profile } from './pages/Profile';
export { default as Dashboard } from './pages/Dashboard';
export { default as CompleteProfile } from './pages/CompleteProfile';
export { default as UserAvatar } from './components/UserAvatar';
export { useAuth } from './store/userStore';
export { default as useAuthInit } from './hooks/useAuthInit';

// Export validation schemas
export * from './validation';
