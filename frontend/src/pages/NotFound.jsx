import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-8">
            <FontAwesomeIcon icon={faSearch} className="text-9xl text-gray-400" />
          </div>
          <CardTitle className="text-4xl font-extrabold text-gray-900">
            404 - Page Not Found
          </CardTitle>
          <CardDescription className="text-xl">
            Oops! The page you're looking for doesn't exist.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link to="/" className="block">
            <Button className="w-full cursor-pointer" size="lg">
              Go Back Home
            </Button>
          </Link>
          <Link to="/quiz" className="block">
            <Button variant="outline" className="w-full cursor-pointer" size="lg">
              Take a Quiz
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
