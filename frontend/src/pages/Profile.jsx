import React from 'react';
import Navbar from '../shared/components/Navbar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const Profile = () => {
  // Mock user data - in real app this would come from auth context
  const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    class: '12',
    state: 'Maharashtra',
    recommendedStream: 'Science PCM',
    quizzesTaken: 2,
    lastQuizDate: '2025-09-10'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-3xl font-bold">
                  {userData.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <CardTitle className="text-3xl">{userData.name}</CardTitle>
                <p className="text-gray-600 mt-1">{userData.email}</p>
                <Badge className="mt-2">
                  Class {userData.class}
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="border-t pt-6">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500">State</dt>
                  <dd className="mt-1 text-sm text-gray-900">{userData.state}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Recommended Stream</dt>
                  <dd className="mt-1 text-sm text-gray-900">{userData.recommendedStream}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Quizzes Taken</dt>
                  <dd className="mt-1 text-sm text-gray-900">{userData.quizzesTaken}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Quiz</dt>
                  <dd className="mt-1 text-sm text-gray-900">{userData.lastQuizDate}</dd>
                </div>
              </dl>
            </div>

            <div className="border-t pt-6 mt-6">
              <div className="flex space-x-4">
                <Button className="cursor-pointer">
                  Edit Profile
                </Button>
                <Button variant="outline" className="cursor-pointer">
                  Retake Quiz
                </Button>
                <Button variant="destructive" className="cursor-pointer">
                  Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
