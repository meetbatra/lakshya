import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faMapMarkerAlt, faStar, faUsers, faExternalLinkAlt, faBook, faBuilding, faHospital, faGraduationCap } from '@fortawesome/free-solid-svg-icons';

const Colleges = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  // Dummy college data
  const collegesData = [
    {
      id: 1,
      name: 'Indian Institute of Technology Mumbai',
      shortName: 'IIT Mumbai',
      location: 'Mumbai, Maharashtra',
      type: 'government',
      rating: 9.2,
      specialization: 'Engineering & Technology',
      courses: ['Computer Science', 'Mechanical Engineering', 'Electrical Engineering'],
      fees: '₹2.5L per year',
      icon: 'engineering'
    },
    {
      id: 2,
      name: 'All India Institute of Medical Sciences',
      shortName: 'AIIMS Delhi',
      location: 'New Delhi',
      type: 'government',
      rating: 9.5,
      specialization: 'Medical Sciences',
      courses: ['MBBS', 'MD', 'MS', 'Nursing'],
      fees: '₹1.5L per year',
      icon: 'medical'
    },
    {
      id: 3,
      name: 'Delhi University',
      shortName: 'DU',
      location: 'New Delhi',
      type: 'government',
      rating: 8.8,
      specialization: 'Liberal Arts & Sciences',
      courses: ['BA', 'BSc', 'BCom', 'MA'],
      fees: '₹50K per year',
      icon: 'general'
    },
    {
      id: 4,
      name: 'Birla Institute of Technology and Science',
      shortName: 'BITS Pilani',
      location: 'Pilani, Rajasthan',
      type: 'private',
      rating: 9.0,
      specialization: 'Engineering & Sciences',
      courses: ['Computer Science', 'Electronics', 'Mechanical', 'Chemical'],
      fees: '₹4.5L per year',
      icon: 'engineering'
    },
    {
      id: 5,
      name: 'Christian Medical College',
      shortName: 'CMC Vellore',
      location: 'Vellore, Tamil Nadu',
      type: 'private',
      rating: 9.3,
      specialization: 'Medical Sciences',
      courses: ['MBBS', 'BDS', 'Nursing', 'Pharmacy'],
      fees: '₹3L per year',
      icon: 'medical'
    },
    {
      id: 6,
      name: 'St. Stephens College',
      shortName: 'St. Stephens',
      location: 'New Delhi',
      type: 'private',
      rating: 8.9,
      specialization: 'Liberal Arts',
      courses: ['BA Economics', 'BA English', 'BSc Mathematics'],
      fees: '₹80K per year',
      icon: 'general'
    }
  ];

  const collegeTypes = [
    { id: 'all', name: 'All Types', count: collegesData.length },
    { id: 'government', name: 'Government', count: collegesData.filter(college => college.type === 'government').length },
    { id: 'private', name: 'Private', count: collegesData.filter(college => college.type === 'private').length }
  ];

  const filteredColleges = collegesData.filter(college => {
    const matchesSearch = college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         college.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         college.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || college.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getCollegeIcon = (iconType) => {
    switch (iconType) {
      case 'engineering': return faBuilding;
      case 'medical': return faHospital;
      case 'general': return faGraduationCap;
      default: return faBook;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Top <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Colleges</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the best colleges and universities that align with your academic goals and career aspirations
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 relative">
              <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search colleges, locations, or specializations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg"
              />
            </div>
          </div>

          {/* Type Filters */}
          <Tabs value={selectedType} onValueChange={setSelectedType} className="mt-8">
            <TabsList className="grid w-full grid-cols-3">
              {collegeTypes.map((type) => (
                <TabsTrigger 
                  key={type.id} 
                  value={type.id}
                  className="text-center"
                >
                  {type.name} ({type.count})
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Results */}
        <div className="mb-8">
          <p className="text-gray-600">
            Showing {filteredColleges.length} college{filteredColleges.length !== 1 ? 's' : ''}
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* College Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredColleges.map((college) => (
            <Card key={college.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow group cursor-pointer">
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <FontAwesomeIcon icon={getCollegeIcon(college.icon)} className="h-8 w-8 text-white" />
                  </div>
                  <Badge variant={college.type === 'government' ? 'default' : 'secondary'}>
                    {college.type === 'government' ? 'Government' : 'Private'}
                  </Badge>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {college.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">{college.shortName}</p>

                <div className="flex items-center text-gray-600 mb-4">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="h-4 w-4 mr-2" />
                  <span className="text-sm">{college.location}</span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center text-yellow-500">
                    <FontAwesomeIcon icon={faStar} className="h-4 w-4 mr-1" />
                    <span className="font-semibold">{college.rating}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FontAwesomeIcon icon={faUsers} className="h-4 w-4 mr-1" />
                    <span className="text-sm">{college.fees}</span>
                  </div>
                </div>

                <p className="text-blue-600 font-medium mb-4">{college.specialization}</p>

                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">Popular Courses:</p>
                  <div className="flex flex-wrap gap-2">
                    {college.courses.slice(0, 3).map((course, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {course}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="w-full group-hover:bg-blue-700 transition-colors">
                  View Details
                  <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredColleges.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <FontAwesomeIcon icon={faSearch} className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No colleges found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or browse all colleges</p>
            <Button onClick={() => { setSearchQuery(''); setSelectedType('all'); }}>
              Clear Filters
            </Button>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Can't find your ideal college?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Get personalized college recommendations based on your interests and goals
          </p>
          <Button size="lg" variant="secondary" className="text-blue-600 hover:text-blue-700">
            Get Personalized Recommendations
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Colleges;
