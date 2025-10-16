import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faClock, faUsers, faSpinner, faFilter, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { coursesAPI } from '../api/coursesAPI';
import { useAuth } from '../../user/store/userStore';
import BookmarkButton from '../../../shared/components/BookmarkButton';

const Courses = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  // Local state for component
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStream, setSelectedStream] = useState('all');
  const [selectedField, setSelectedField] = useState('all');
  const [autoFiltersApplied, setAutoFiltersApplied] = useState(false);
  const [manuallyClearedFilters, setManuallyClearedFilters] = useState(false);

  // Fetch courses data when component mounts
  useEffect(() => {
    const loadCourses = async () => {
      window.scrollTo(0, 0);
      setLoading(true);
      setError(null);
      
      try {
        const result = await coursesAPI.getAllCourses();
        if (result.success) {
          setCourses(result.data.courses || []);
        } else {
          setError(result.message || 'Failed to fetch courses');
        }
      } catch (error) {
        setError('Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  // Apply auto-filters based on user preferences when data is loaded
  useEffect(() => {
    if (isAuthenticated && user && courses.length > 0 && !autoFiltersApplied && !manuallyClearedFilters) {
      applyAutoFilters(user);
    }
  }, [isAuthenticated, user, courses, autoFiltersApplied, manuallyClearedFilters]);

  // Apply auto-filters based on user preferences
  const applyAutoFilters = (user) => {
    if (!user) return;
    
    // For Class 10 users - apply stream filter only
    if (user.class === '10' && user.stream) {
      setSelectedStream(user.stream);
      setSelectedField('all');
      setAutoFiltersApplied(true);
    }
    // For Class 12 users - apply both stream and field filters
    else if (user.class === '12' && user.stream) {
      setSelectedStream(user.stream);
      setSelectedField(user.field || 'all');
      setAutoFiltersApplied(true);
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedStream('all');
    setSelectedField('all');
    setSearchQuery('');
    setAutoFiltersApplied(false);
    setManuallyClearedFilters(true);
  };  // Client-side filtering functions
  const filterCourses = (courses, filters) => {
    const { searchQuery, selectedStream, selectedField } = filters;
    
    return courses.filter(course => {
      // Stream filter
      const matchesStream = selectedStream === 'all' || course.stream === selectedStream;
      
      // Field filter
      const matchesField = selectedField === 'all' || course.field === selectedField;
      
      // Search filter - search across multiple fields
      const matchesSearch = !searchQuery || (() => {
        const query = searchQuery.toLowerCase();
        
        // Basic course info
        const basicMatch = course.name?.toLowerCase().includes(query) ||
                          course.shortName?.toLowerCase().includes(query) ||
                          course.description?.toLowerCase().includes(query) ||
                          course.field?.toLowerCase().includes(query);
        
        // Career options search
        const careerMatch = course.careerOptions?.some(career => 
          career.jobTitle?.toLowerCase().includes(query) ||
          career.description?.toLowerCase().includes(query)
        );
        
        // Skills search (both technical and soft skills)
        const skillsMatch = course.skills?.technical?.some(skill => 
          skill?.toLowerCase().includes(query)
        ) || course.skills?.soft?.some(skill => 
          skill?.toLowerCase().includes(query)
        );
        
        // College search
        const collegeMatch = course.topColleges?.some(college =>
          college.name?.toLowerCase().includes(query) ||
          college.location?.toLowerCase().includes(query)
        );
        
        return basicMatch || careerMatch || skillsMatch || collegeMatch;
      })();

      return matchesStream && matchesField && matchesSearch;
    });
  };

  // Get available streams from courses
  const getAvailableStreams = (courses) => {
    const streams = [...new Set(courses.map(course => course.stream))].filter(Boolean);
    return streams;
  };

  // Get available fields from courses
  const getAvailableFields = (courses) => {
    const fields = [...new Set(courses.map(course => course.field))].filter(Boolean);
    return fields;
  };

  // Get filtered courses using utility function
  const filteredCourses = filterCourses(courses, {
    searchQuery,
    selectedStream,
    selectedField
  });

  // Get available options for filters
  const availableStreams = getAvailableStreams(courses);
  const availableFields = getAvailableFields(courses);

  // Helper function to format stream name for display
  const formatStreamName = (stream) => {
    const streamMap = {
      'science_pcm': 'Science (PCM)',
      'science_pcb': 'Science (PCB)', 
      'commerce': 'Commerce',
      'arts': 'Arts'
    };
    return streamMap[stream] || stream;
  };

  // Helper function to format field name for display
  const formatFieldName = (field) => {
    const fieldMap = {
      'engineering_technology': 'Engineering & Technology',
      'architecture_design': 'Architecture & Design',
      'defence_military': 'Defence & Military',
      'computer_it': 'Computer & IT',
      'pure_sciences_research': 'Pure Sciences & Research',
      'medicine': 'Medicine',
      'allied_health': 'Allied Health',
      'biotechnology': 'Biotechnology',
      'veterinary_science': 'Veterinary Science',
      'agriculture_environment': 'Agriculture & Environment',
      'business_management': 'Business & Management',
      'finance_accounting': 'Finance & Accounting',
      'economics_analytics': 'Economics & Analytics',
      'law_commerce': 'Law & Commerce',
      'entrepreneurship': 'Entrepreneurship',
      'social_sciences': 'Social Sciences',
      'psychology': 'Psychology',
      'journalism_media': 'Journalism & Media',
      'fine_arts_design': 'Fine Arts & Design',
      'law_arts': 'Law & Arts',
      'civil_services': 'Civil Services'
    };
    return fieldMap[field] || field;
  };

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
    <div className="h-full bg-gray-50">
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
            {/* Auto-Filter Message */}
            {autoFiltersApplied && (
              <Alert className="mb-4 bg-blue-50 border-blue-200">
                <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faInfoCircle} className="h-4 w-4 mr-2 text-blue-600 flex-shrink-0" />
                    <span className="text-blue-800 text-sm">
                      Filters are automatically applied based on your preferences
                      {user?.class === '10' && ` (Class ${user.class} - ${formatStreamName(user.stream)})`}
                      {user?.class === '12' && ` (Class ${user.class} - ${formatStreamName(user.stream)}${user.field ? `, ${formatFieldName(user.field)}` : ''})`}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 self-start sm:self-auto"
                  >
                    <FontAwesomeIcon icon={faTimes} className="h-4 w-4 mr-1" />
                    Clear Filter
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Filters */}
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 transition-all duration-200 hover:scale-105 hover:shadow-md ${showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : ''}`}
                >
                  <FontAwesomeIcon 
                    icon={faFilter} 
                    className={`h-4 w-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} 
                  />
                  Filters
                </Button>
                
                {(selectedStream !== 'all' || selectedField !== 'all' || searchQuery || autoFiltersApplied) && (
                  <Button
                    variant="ghost"
                    onClick={clearAllFilters}
                    className="text-sm text-gray-600"
                  >
                    Clear all filters
                  </Button>
                )}
              </div>

              {showFilters && (
                <div className="mb-6 overflow-hidden">
                  <Card className="transform transition-all duration-300 ease-in-out animate-in slide-in-from-top-2 fade-in-0">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Stream Filter */}
                        <div className="transform transition-all duration-200 hover:scale-105">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Stream
                          </label>
                          <select
                            value={selectedStream}
                            onChange={(e) => setSelectedStream(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-400 focus:scale-105"
                          >
                            <option value="all">All Streams</option>
                            {availableStreams.map(stream => (
                              <option key={stream} value={stream}>
                                {formatStreamName(stream)}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Field Filter */}
                        <div className="transform transition-all duration-200 hover:scale-105">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Field
                          </label>
                          <select
                            value={selectedField}
                            onChange={(e) => setSelectedField(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-400 focus:scale-105"
                          >
                            <option value="all">All Fields</option>
                            {availableFields.map(field => (
                              <option key={field} value={field}>
                                {formatFieldName(field)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

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

                {/* Action Buttons - Fixed at bottom */}
                <div className="flex gap-2 mt-auto">
                  <Button 
                    className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                    variant="outline"
                    onClick={() => navigate(`/courses/${course.id}`)}
                  >
                    View Full Details
                  </Button>
                  <BookmarkButton 
                    type="courses" 
                    itemId={course.id}
                  />
                </div>
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