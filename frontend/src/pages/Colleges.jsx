import React from 'react';
import Navbar from '../shared/components/Navbar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUniversity, faHospital, faGraduationCap, faBook, faMapMarkerAlt, faStar } from '@fortawesome/free-solid-svg-icons';

const Colleges = () => {
  const sampleColleges = [
    {
      id: 1,
      name: 'IIT Mumbai',
      location: 'Mumbai, Maharashtra',
      type: 'Government',
      rating: '9.2/10',
      specialization: 'Engineering & Technology',
      icon: faUniversity
    },
    {
      id: 2,
      name: 'AIIMS Delhi',
      location: 'New Delhi',
      type: 'Government',
      rating: '9.5/10',
      specialization: 'Medical Sciences',
      icon: faHospital
    },
    {
      id: 3,
      name: 'SRCC',
      location: 'Delhi University',
      type: 'Government',
      rating: '8.8/10',
      specialization: 'Commerce',
      icon: faGraduationCap
    },
    {
      id: 4,
      name: 'St. Xavier\'s College',
      location: 'Mumbai, Maharashtra',
      type: 'Private',
      rating: '8.5/10',
      specialization: 'Arts & Sciences',
      icon: faBook
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Top Colleges
          </h1>
          <p className="text-xl text-gray-600">
            Find the best colleges for your chosen field
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleColleges.map((college) => (
            <Card key={college.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <FontAwesomeIcon icon={college.icon} className="text-3xl text-blue-600" />
                  <Badge variant={college.type === 'Government' ? 'default' : 'secondary'}>
                    {college.type}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{college.name}</CardTitle>
                <CardDescription>
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" /> {college.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <p className="text-blue-600 font-medium">
                    <FontAwesomeIcon icon={faStar} className="mr-1" /> {college.rating}
                  </p>
                  <p className="text-sm text-gray-700">{college.specialization}</p>
                </div>
                <Button className="w-full cursor-pointer">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">More colleges from different locations coming soon...</p>
          <Button size="lg" className="cursor-pointer">
            Search Colleges
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Colleges;
