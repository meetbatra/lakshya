import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

/**
 * Main Layout component that includes Navbar for all routes
 */
const Layout = () => {
  return (
    <div className="bg-gray-50">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;