import React from 'react';
import AppRouter from './shared/routes/AppRouter';
import { useAuthInit } from './modules/user';

function App() {
  // Initialize authentication state on app load
  useAuthInit();

  return (
    <div className="App">
      <AppRouter />
    </div>
  );
}

export default App
