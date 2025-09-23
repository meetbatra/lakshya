import React, { useEffect } from 'react';
import HeroSection from '../components/HeroSection';

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="h-full bg-white">
      <HeroSection />
    </div>
  );
};

export default Home;
