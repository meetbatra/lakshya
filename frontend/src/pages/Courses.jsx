import React from 'react';
import Navbar from '../shared/components/Navbar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaptopCode, faStethoscope, faChartLine, faBrain } from '@fortawesome/free-solid-svg-icons';

const Courses = () => {
  const sampleCourses = [
    {
      id: 1,
      name: 'B.Tech Computer Science',
      category: 'Engineering',
      duration: '4 years',
      description: 'Learn programming, algorithms, and software development',
      icon: faLaptopCode
    },
    {
      id: 2,
      name: 'MBBS',
      category: 'Medical',
      duration: '5.5 years',
      description: 'Become a medical doctor and serve humanity',
      icon: faStethoscope
    },
    {
      id: 3,
      name: 'B.Com',
      category: 'Commerce',
      duration: '3 years',
      description: 'Master business, accounting, and finance',
      icon: faChartLine
    },
    {
      id: 4,
      name: 'BA Psychology',
      category: 'Arts',
      duration: '3 years',
      description: 'Understand human behavior and mental processes',
      icon: faBrain
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Explore Courses
          </h1>
          <p className="text-xl text-gray-600">
            Discover various courses and their career paths
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sampleCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <FontAwesomeIcon icon={course.icon} className="text-4xl mb-4 text-blue-600" />
                <CardTitle className="text-xl">{course.name}</CardTitle>
                <Badge variant="secondary" className="mx-auto w-fit">
                  {course.category}
                </Badge>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="mb-3">
                  {course.description}
                </CardDescription>
                <p className="text-sm font-medium text-blue-600">
                  Duration: {course.duration}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">More courses coming soon...</p>
          <Button size="lg" className="cursor-pointer">
            View All Courses
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Courses;
