import React, { useState } from 'react';
import Navbar from '../shared/components/Navbar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  GraduationCap, 
  Stethoscope, 
  Calculator, 
  Palette, 
  Search,
  Clock,
  Users,
  TrendingUp,
  BookOpen,
  Microscope,
  Cpu,
  Building
} from 'lucide-react';

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStream, setSelectedStream] = useState('all');

  const courseCategories = [
    {
      id: 'engineering',
      name: 'Engineering & Technology',
      icon: Cpu,
      color: 'bg-blue-500',
      courses: [
        {
          id: 1,
          name: 'Computer Science Engineering',
          shortName: 'B.Tech CSE',
          duration: '4 years',
          description: 'Learn programming, algorithms, AI, and cutting-edge technology',
          popularity: 95,
          avgSalary: '8-15 LPA',
          topColleges: 'IIT, NIT, BITS',
          skills: ['Programming', 'Problem Solving', 'System Design']
        },
        {
          id: 2,
          name: 'Electronics & Communication',
          shortName: 'B.Tech ECE',
          duration: '4 years',
          description: 'Master electronics, telecommunications, and embedded systems',
          popularity: 88,
          avgSalary: '6-12 LPA',
          topColleges: 'IIT, NIT, DTU',
          skills: ['Circuit Design', 'Signal Processing', 'Embedded Systems']
        }
      ]
    },
    {
      id: 'medical',
      name: 'Medical & Healthcare',
      icon: Stethoscope,
      color: 'bg-red-500',
      courses: [
        {
          id: 3,
          name: 'Bachelor of Medicine',
          shortName: 'MBBS',
          duration: '5.5 years',
          description: 'Become a medical doctor and save lives',
          popularity: 98,
          avgSalary: '10-25 LPA',
          topColleges: 'AIIMS, JIPMER, CMC',
          skills: ['Medical Knowledge', 'Patient Care', 'Critical Thinking']
        }
      ]
    },
    {
      id: 'science',
      name: 'Pure Sciences',
      icon: Microscope,
      color: 'bg-green-500',
      courses: [
        {
          id: 4,
          name: 'Physics',
          shortName: 'B.Sc Physics',
          duration: '3 years',
          description: 'Explore the fundamental laws of nature and universe',
          popularity: 75,
          avgSalary: '4-8 LPA',
          topColleges: 'DU, JNU, IISc',
          skills: ['Analytical Thinking', 'Mathematical Modeling', 'Research']
        },
        {
          id: 5,
          name: 'Mathematics',
          shortName: 'B.Sc Mathematics',
          duration: '3 years',
          description: 'Master logical reasoning and mathematical concepts',
          popularity: 72,
          avgSalary: '5-10 LPA',
          topColleges: 'ISI, CMI, DU',
          skills: ['Logical Reasoning', 'Problem Solving', 'Data Analysis']
        }
      ]
    },
    {
      id: 'commerce',
      name: 'Commerce & Business',
      icon: Building,
      color: 'bg-purple-500',
      courses: [
        {
          id: 6,
          name: 'Commerce',
          shortName: 'B.Com',
          duration: '3 years',
          description: 'Learn business, accounting, and financial management',
          popularity: 82,
          avgSalary: '4-8 LPA',
          topColleges: 'SRCC, LSR, Hansraj',
          skills: ['Financial Analysis', 'Business Strategy', 'Communication']
        }
      ]
    }
  ];

  const allCourses = courseCategories.flatMap(category => 
    category.courses.map(course => ({ ...course, category: category.name, categoryId: category.id }))
  );

  const filteredCourses = allCourses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStream = selectedStream === 'all' || course.categoryId === selectedStream;
    return matchesSearch && matchesStream;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover Your Perfect Course
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Explore hundreds of courses across different streams and find the one that matches your passion and career goals
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for courses, streams, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-6 text-lg bg-white/90 backdrop-blur border-0 text-gray-800"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Filter Tabs */}
        <Tabs value={selectedStream} onValueChange={setSelectedStream} className="mb-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto p-1">
            <TabsTrigger value="all" className="py-3">All Streams</TabsTrigger>
            <TabsTrigger value="engineering" className="py-3">Engineering</TabsTrigger>
            <TabsTrigger value="medical" className="py-3">Medical</TabsTrigger>
            <TabsTrigger value="science" className="py-3">Sciences</TabsTrigger>
            <TabsTrigger value="commerce" className="py-3">Commerce</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Course Categories */}
        {selectedStream === 'all' && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {courseCategories.map((category) => (
                <Card 
                  key={category.id} 
                  className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-0 shadow-md"
                  onClick={() => setSelectedStream(category.id)}
                >
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 ${category.color} rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <category.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <CardDescription>
                      {category.courses.length} course{category.courses.length > 1 ? 's' : ''} available
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Course Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedStream === 'all' ? 'All Courses' : 
               courseCategories.find(c => c.id === selectedStream)?.name || 'Courses'}
            </h2>
            <Badge variant="secondary" className="text-sm">
              {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-xl transition-all duration-300 group border-0 shadow-md overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Badge variant="outline" className="mb-3 text-xs">
                        {course.category}
                      </Badge>
                      <CardTitle className="text-xl mb-2 group-hover:text-blue-600 transition-colors">
                        {course.name}
                      </CardTitle>
                      <p className="text-sm font-medium text-blue-600">{course.shortName}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        {course.popularity}% popular
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <CardDescription className="mb-4 text-gray-600">
                    {course.description}
                  </CardDescription>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      Duration: {course.duration}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Avg. Salary: {course.avgSalary}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      Top Colleges: {course.topColleges}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Key Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {course.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full group-hover:bg-blue-600 transition-colors">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or browse all courses</p>
            <Button onClick={() => { setSearchTerm(''); setSelectedStream('all'); }}>
              View All Courses
            </Button>
          </div>
        )}

        {filteredCourses.length > 0 && (
          <div className="text-center mt-12 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Need Help Choosing?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Take our comprehensive career assessment quiz to get personalized course recommendations based on your interests and strengths.
            </p>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Take Career Quiz
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
