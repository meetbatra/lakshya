import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPuzzlePiece, faBullseye, faSchool, faRocket } from '@fortawesome/free-solid-svg-icons';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleStartJourney = () => {
    navigate('/quiz');
  };

  const handleLearnMore = () => {
    navigate('/courses');
  };

  return (
    <section className="bg-gradient-to-br from-slate-50 to-white py-20 lg:py-32 min-h-[80vh] flex items-center">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left Content */}
          <div className="max-w-2xl">
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-slate-900">
              Your <span className="text-blue-600">Career Journey</span> Starts Here
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
              Discover your perfect stream, explore career paths, and find the right colleges 
              with AI-powered recommendations tailored just for you.
            </p>
            
            {/* Features */}
            <div className="flex flex-wrap gap-8 mb-12">
              <div className="flex items-center gap-3 font-semibold text-slate-800">
                <FontAwesomeIcon icon={faPuzzlePiece} className="text-2xl text-blue-600" />
                <span>Smart Assessments</span>
              </div>
              <div className="flex items-center gap-3 font-semibold text-slate-800">
                <FontAwesomeIcon icon={faBullseye} className="text-2xl text-blue-600" />
                <span>Personalized Guidance</span>
              </div>
              <div className="flex items-center gap-3 font-semibold text-slate-800">
                <FontAwesomeIcon icon={faSchool} className="text-2xl text-blue-600" />
                <span>College Recommendations</span>
              </div>
            </div>
            
            {/* CTA Buttons using shadcn Button */}
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg"
                onClick={handleStartJourney}
                className="px-8 py-4 text-lg font-semibold cursor-pointer"
              >
                Start Your Journey
              </Button>
              <Button 
                variant="outline"
                size="lg"
                onClick={handleLearnMore}
                className="px-8 py-4 text-lg font-semibold cursor-pointer"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Right Visual */}
          <div className="hidden lg:flex justify-center lg:justify-end">
            <div className="w-96 h-96 flex items-center justify-center">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 w-80 h-80 rounded-3xl flex flex-col items-center justify-center text-white shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <FontAwesomeIcon icon={faRocket} className="text-8xl mb-4" />
                <p className="text-2xl font-semibold">Your Future Awaits</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
