import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullseye, faBrain, faUniversity, faStar, faArrowRight, faUsers, faAward, faChartLine, faRocket } from '@fortawesome/free-solid-svg-icons';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleStartJourney = () => {
    navigate('/quiz');
  };

  const handleLearnMore = () => {
    navigate('/courses');
  };

  const features = [
    { icon: faBrain, title: 'Smart Assessments', description: 'AI-powered career analysis' },
    { icon: faBullseye, title: 'Personalized Guidance', description: 'Tailored recommendations' },
    { icon: faUniversity, title: 'College Recommendations', description: 'Find the perfect fit' }
  ];

  const stats = [
    { icon: faUsers, value: '10,000+', label: 'Students Guided' },
    { icon: faAward, value: '500+', label: 'Top Colleges' },
    { icon: faChartLine, value: '95%', label: 'Success Rate' }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="py-15 min-h-[80vh] flex items-center">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left Content */}
            <div className="max-w-2xl">
              <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-gray-900">
                Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Career Journey</span> Starts Here
              </h1>
              
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                Discover your perfect stream, explore career paths, and find the right colleges 
                with AI-powered recommendations tailored just for you.
              </p>
              
              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon icon={feature.icon} className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  onClick={handleStartJourney}
                  className="px-8 py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 group"
                >
                  Start Your Journey
                  <FontAwesomeIcon icon={faArrowRight} className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={handleLearnMore}
                  className="px-8 py-6 text-lg font-semibold border-gray-300 hover:bg-gray-50"
                >
                  Learn More
                </Button>
              </div>
            </div>

            {/* Right Visual */}
            <div className="hidden lg:flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-80 h-80 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex flex-col items-center justify-center text-white shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-500">
                  <FontAwesomeIcon icon={faRocket} className="h-20 w-20 mb-4" />
                  <p className="text-2xl font-bold">Your Future Awaits</p>
                </div>
                {/* Floating elements */}
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center animate-bounce">
                  <FontAwesomeIcon icon={faStar} className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-green-500 rounded-2xl flex items-center justify-center animate-pulse">
                  <FontAwesomeIcon icon={faAward} className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
