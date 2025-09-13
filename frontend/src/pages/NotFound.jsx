import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../shared/components/Navbar';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Home, ArrowLeft, Search, BookOpen, Target } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const quickLinks = [
    { 
      name: 'Take Career Quiz', 
      path: '/quiz', 
      icon: Target,
      description: 'Discover your perfect career path'
    },
    { 
      name: 'Browse Courses', 
      path: '/courses', 
      icon: BookOpen,
      description: 'Explore available courses'
    },
    { 
      name: 'Search Colleges', 
      path: '/colleges', 
      icon: Search,
      description: 'Find the best colleges'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
        {/* 404 Illustration */}
        <div className="mb-12">
          <div className="relative">
            <div className="text-9xl font-bold text-gray-200 mb-4">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Search className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            It looks like the page you're looking for doesn't exist or has been moved. 
            Don't worry, we're here to help you get back on track!
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              onClick={handleGoBack}
              variant="outline"
              size="lg"
              className="px-6 py-3"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            <Button 
              asChild
              size="lg"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Popular Destinations
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {quickLinks.map((link, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-0 shadow-md"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <link.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {link.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {link.description}
                  </p>
                  <Button 
                    asChild
                    variant="outline"
                    className="group-hover:bg-blue-50 group-hover:border-blue-300"
                  >
                    <Link to={link.path}>
                      Explore
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Still need help?
          </h3>
          <p className="text-gray-600 mb-6">
            If you're looking for something specific, try searching for it or contact our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline">
              Search Our Site
            </Button>
            <Button variant="outline">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;