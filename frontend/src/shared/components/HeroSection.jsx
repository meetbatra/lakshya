import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ArrowRight, Target, BookOpen, Users, Star } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();

  const stats = [
    { label: 'Students Guided', value: '10K+', icon: Users },
    { label: 'Courses Available', value: '500+', icon: BookOpen },
    { label: 'Success Rate', value: '95%', icon: Star },
    { label: 'Career Paths', value: '50+', icon: Target }
  ];

  const handleQuizStart = () => {
    navigate('/quiz');
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-28">
          {/* Main Hero Content */}
          <div className="text-center lg:text-left lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-1/2">
              <div className="mb-6">
                <Badge variant="secondary" className="mb-4 px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800">
                  🎯 Career Guidance Platform
                </Badge>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Find Your Perfect
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block">
                  Career Path
                </span>
              </h1>
              
              <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
                Discover the ideal stream and courses that align with your interests, 
                strengths, and career aspirations. Make informed decisions for your future.
              </p>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  size="lg" 
                  onClick={handleQuizStart}
                  className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 group"
                >
                  Take Career Quiz
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  asChild
                  className="text-lg px-8 py-6 border-gray-300 hover:border-blue-300"
                >
                  <Link to="/courses">
                    Explore Courses
                  </Link>
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="mt-8 flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-500">
                <span className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  4.9/5 Rating
                </span>
                <span>✓ Free Assessment</span>
                <span>✓ Expert Guidance</span>
              </div>
            </div>

            {/* Hero Image/Visual */}
            <div className="mt-12 lg:mt-0 lg:w-1/2 lg:pl-12">
              <div className="relative">
                <Card className="p-8 shadow-2xl bg-white/80 backdrop-blur border-0">
                  <CardContent className="p-0">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                        <Target className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Smart Career Matching
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Our AI-powered assessment analyzes your preferences and suggests the best career paths.
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium">Engineering</span>
                          <Badge variant="secondary">95% Match</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium">Medicine</span>
                          <Badge variant="secondary">87% Match</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium">Business</span>
                          <Badge variant="secondary">78% Match</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center p-6 border-0 shadow-lg bg-white/60 backdrop-blur">
                  <CardContent className="p-0">
                    <stat.icon className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;