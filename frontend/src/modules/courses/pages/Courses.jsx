import React, { useState } from 'react';
import Navbar from '../../../shared/components/Navbar';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faClock, faUsers, faStar, faExternalLinkAlt, faBook, faBullseye, faStethoscope, faCalculator, faAtom } from '@fortawesome/free-solid-svg-icons';

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Dummy course data
  const coursesData = [
    {
      id: 1,
      name: 'Bachelor of Technology - Computer Science',
      shortName: 'B.Tech-CSE',
      description: 'Learn programming, algorithms, software development, and cutting-edge technologies like AI and machine learning.',
      stream: 'science_pcm',
      field: 'engineering',
      duration: '4 years',
      skills: ['Programming', 'Data Structures', 'Web Development', 'Machine Learning', 'Database Design'],
      careerOptions: ['Software Engineer', 'Data Scientist', 'Product Manager', 'Tech Entrepreneur']
    },
    {
      id: 2,
      name: 'Bachelor of Science - Physics',
      shortName: 'B.Sc-Physics',
      description: 'Explore the fundamental laws of nature, quantum mechanics, and modern physics applications.',
      stream: 'science_pcm',
      field: 'pure_sciences',
      duration: '3 years',
      skills: ['Mathematical Modeling', 'Research Methods', 'Laboratory Techniques', 'Data Analysis'],
      careerOptions: ['Research Scientist', 'Physics Teacher', 'Lab Technician', 'Technical Writer']
    },
    {
      id: 3,
      name: 'Bachelor of Medicine and Surgery',
      shortName: 'MBBS',
      description: 'Comprehensive medical education covering anatomy, physiology, pathology, and clinical practice.',
      stream: 'science_pcb',
      field: 'medical',
      duration: '5.5 years',
      skills: ['Clinical Diagnosis', 'Patient Care', 'Medical Ethics', 'Emergency Medicine'],
      careerOptions: ['Doctor', 'Surgeon', 'Medical Researcher', 'Public Health Officer']
    },
    {
      id: 4,
      name: 'Bachelor of Science - Mathematics',
      shortName: 'B.Sc-Math',
      description: 'Advanced mathematical concepts, statistics, and their applications in various fields.',
      stream: 'science_pcm',
      field: 'pure_sciences',
      duration: '3 years',
      skills: ['Abstract Thinking', 'Problem Solving', 'Statistical Analysis', 'Mathematical Modeling'],
      careerOptions: ['Data Analyst', 'Actuary', 'Math Teacher', 'Statistician']
    },
    {
      id: 5,
      name: 'Bachelor of Science - Biology',
      shortName: 'B.Sc-Bio',
      description: 'Study of living organisms, genetics, ecology, and biotechnology applications.',
      stream: 'science_pcb',
      field: 'pure_sciences',
      duration: '3 years',
      skills: ['Laboratory Research', 'Microscopy', 'Genetic Analysis', 'Environmental Science'],
      careerOptions: ['Biologist', 'Research Assistant', 'Environmental Consultant', 'Biotech Specialist']
    },
    {
      id: 6,
      name: 'Bachelor of Engineering - Mechanical',
      shortName: 'B.E-Mech',
      description: 'Design and manufacture of machines, engines, and mechanical systems.',
      stream: 'science_pcm',
      field: 'engineering',
      duration: '4 years',
      skills: ['CAD Design', 'Thermodynamics', 'Manufacturing', 'Project Management'],
      careerOptions: ['Mechanical Engineer', 'Design Engineer', 'Manufacturing Manager', 'Consultant']
    }
  ];

  const categories = [
    { id: 'all', name: 'All Courses', count: coursesData.length },
    { id: 'science_pcm', name: 'Science PCM', count: coursesData.filter(course => course.stream === 'science_pcm').length },
    { id: 'science_pcb', name: 'Science PCB', count: coursesData.filter(course => course.stream === 'science_pcb').length }
  ];

  const filteredCourses = coursesData.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.stream === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getFieldIcon = (field) => {
    switch (field) {
      case 'engineering': return faBullseye;
      case 'medical': return faStethoscope;
      case 'pure_sciences': return faAtom;
      case 'applied_sciences': return faCalculator;
      default: return faBook;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Explore Courses & Build Your Future
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Discover comprehensive course information, career prospects, and find the perfect program that aligns with your interests and goals.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search courses, careers, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 text-lg border-0 bg-white/95 backdrop-blur-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="text-center">
                <div>
                  <div className="font-semibold">{category.name}</div>
                  <div className="text-xs text-gray-500">{category.count} courses</div>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredCourses.length} Courses Found
            </h2>
            <p className="text-gray-600">
              {selectedCategory === 'all' ? 'All categories' : categories.find(c => c.id === selectedCategory)?.name}
            </p>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course, index) => {
            const fieldIcon = getFieldIcon(course.field);
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <FontAwesomeIcon icon={fieldIcon} className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {course.stream.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>

                  {/* Course Info */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {course.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="text-sm font-medium text-blue-600 mb-3">
                      {course.shortName}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faClock} className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faUsers} className="h-4 w-4" />
                      <span>{course.careerOptions.length} careers</span>
                    </div>
                  </div>

                  {/* Skills Preview */}
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">Key Skills:</div>
                    <div className="flex flex-wrap gap-1">
                      {course.skills.slice(0, 3).map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {course.skills.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{course.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button 
                    className="w-full group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all"
                    variant="outline"
                  >
                    View Details
                    <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* No Results */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <FontAwesomeIcon icon={faSearch} className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
            <Button 
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;