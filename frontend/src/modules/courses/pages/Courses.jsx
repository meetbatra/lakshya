import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faClock, faUsers, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useCoursesStore } from '../store/coursesStore';

const Courses = () => {
  const navigate = useNavigate();
  const {
    courses,
    loading,
    error,
    searchQuery,
    fetchAllCourses,
    setSearchQuery,
    getFilteredCourses,
    clearError
  } = useCoursesStore();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchAllCourses();
  }, []);

  const filteredCourses = getFilteredCourses();

  // Helper function to format duration
  const formatDuration = (duration) => {
    if (!duration) return 'N/A';
    
    // If it's already a string, return it
    if (typeof duration === 'string') return duration;
    
    // If it's an object with years/months
    if (typeof duration === 'object' && (duration.years || duration.months)) {
      const years = duration.years || 0;
      const months = duration.months || 0;
      
      if (years && months) {
        return `${years} years ${months} months`;
      } else if (years) {
        return `${years} year${years > 1 ? 's' : ''}`;
      } else if (months) {
        return `${months} month${months > 1 ? 's' : ''}`;
      }
    }
    
    return 'N/A';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent mb-4">
              Course Catalog
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Explore our comprehensive course offerings and find the perfect program for your career goals.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative">
              <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search courses, careers, skills, or colleges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 py-3 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <FontAwesomeIcon icon={faSpinner} className="h-6 w-6 text-blue-600 animate-spin mr-3" />
            <span className="text-base text-gray-600">Loading courses...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Alert className="mb-8">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!loading && !error && (
          <>
            {/* Results Header */}
            <div className="mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {filteredCourses?.length || 0} Courses
                </h2>
                <p className="text-gray-600">
                  Explore our comprehensive course catalog
                </p>
              </div>
            </div>        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(filteredCourses || []).map((course, index) => (
            <Card key={course?.id || index} className="hover:shadow-md transition-shadow duration-200 border border-gray-200 flex flex-col h-full">
              <CardContent className="p-6 flex flex-col flex-1">
                <div className="flex-1">
                  {/* Header */}
                  <div className="mb-4">
                    <div className="mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 leading-tight mb-3">
                        {course?.name || 'Course Name'}
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">
                        {course?.shortName || 'N/A'}
                      </Badge>
                      <Badge variant="outline" className="text-xs border-green-200 text-green-700">
                        {course?.stream?.replace('_', ' ').toUpperCase() || 'Unknown'}
                      </Badge>
                    </div>
                  </div>

                  {/* Course Description */}
                  <div className="mb-4">
                    <p className="text-gray-600 text-sm leading-relaxed" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {course?.description || 'No description available'}
                    </p>
                  </div>

                  {/* Course Details */}
                  <div className="space-y-3 mb-4">
                    {/* Duration & Eligibility */}
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faClock} className="h-3 w-3" />
                        <span>{formatDuration(course?.duration)}</span>
                      </div>
                      <div className="text-xs bg-gray-50 px-2 py-1 rounded">
                        After {course?.eligibility?.minimumClass === '10' ? 'Class 10' : 
                              course?.eligibility?.minimumClass === '12' ? 'Class 12' : 'Graduation'}
                      </div>
                    </div>

                    {/* Career Options Count */}
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <FontAwesomeIcon icon={faUsers} className="h-3 w-3" />
                      <span>{(course?.careerOptions?.length || 0)} career paths available</span>
                    </div>
                  </div>

                  {/* Skills Preview */}
                  {(course?.skills?.technical?.length > 0 || course?.skills?.soft?.length > 0) && (
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">Key Skills</div>
                      <div className="flex flex-wrap gap-1">
                        {/* Technical Skills */}
                        {(course?.skills?.technical || []).slice(0, 2).map((skill, skillIndex) => (
                          <span key={`tech-${skillIndex}`} className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                            {skill}
                          </span>
                        ))}
                        {/* Soft Skills */}
                        {(course?.skills?.soft || []).slice(0, 1).map((skill, skillIndex) => (
                          <span key={`soft-${skillIndex}`} className="inline-block bg-green-50 text-green-700 text-xs px-2 py-1 rounded">
                            {skill}
                          </span>
                        ))}
                        {/* More indicator */}
                        {((course?.skills?.technical?.length || 0) + (course?.skills?.soft?.length || 0)) > 3 && (
                          <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                            +{((course?.skills?.technical?.length || 0) + (course?.skills?.soft?.length || 0)) - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Top Career Options Preview */}
                  {course?.careerOptions && course.careerOptions.length > 0 && (
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">Popular Careers</div>
                      <div className="space-y-1">
                        {course.careerOptions.slice(0, 2).map((career, careerIndex) => (
                          <div key={careerIndex} className="text-sm">
                            <span className="font-medium text-gray-800">{career?.jobTitle || 'Career'}</span>
                            {career?.growthProspects && (
                              <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${
                                career.growthProspects === 'excellent' ? 'bg-green-100 text-green-700' :
                                career.growthProspects === 'good' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {career.growthProspects}
                              </span>
                            )}
                          </div>
                        ))}
                        {course.careerOptions.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{course.careerOptions.length - 2} more career options
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Button - Fixed at bottom */}
                <Button 
                  className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white mt-auto"
                  variant="outline"
                  onClick={() => navigate(`/courses/${course.id}`)}
                >
                  View Full Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {(filteredCourses?.length || 0) === 0 && !loading && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <FontAwesomeIcon icon={faSearch} className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or selecting a different category</p>
            <Button 
              className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              variant="outline"
              onClick={() => {
                setSearchQuery('');
              }}
            >
              Clear Search
            </Button>
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
};

export default Courses;