import React from 'react';
import Navbar from '../shared/components/Navbar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const Quiz = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Career Assessment Quiz
          </h1>
          <p className="text-xl text-gray-600">
            Discover your perfect stream or career field with our AI-powered assessment
          </p>
        </div>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <span className="text-6xl mb-4 block">🧩</span>
            <CardTitle className="text-2xl">Quiz Coming Soon</CardTitle>
            <CardDescription className="text-lg">
              We're preparing an intelligent assessment that will help you make informed decisions about your future.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button size="lg" className="mt-4 cursor-pointer">
              Take Quiz (Preview)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Quiz;
