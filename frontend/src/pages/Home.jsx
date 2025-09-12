import React from 'react';
import Navbar from '../shared/components/Navbar';
import HeroSection from '../shared/components/HeroSection';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <HeroSection />
      </main>
    </div>
  );
};

export default Home;
