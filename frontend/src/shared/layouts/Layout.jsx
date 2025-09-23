import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

/**
 * Main Layout component that includes Navbar for all routes
 */
const Layout = () => {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className='flex-1 flex flex-col'>
        <div className="flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;