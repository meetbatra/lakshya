import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from './components/ui/sonner';
import AppRouter from './shared/routes/AppRouter';
import { useAuthInit } from './modules/user';

function App() {
  // Initialize authentication state on app load
  useAuthInit();

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="App">
        <AppRouter />
        <Toaster />
      </div>
    </GoogleOAuthProvider>
  );
}

export default App
