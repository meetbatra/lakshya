import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faClock, 
  faUsers, 
  faSpinner,
  faGraduationCap,
  faBriefcase,
  faBuilding,
  faTrophy,
  faLightbulb,
  faBookOpen,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';
import { useCoursesStore } from '../store/coursesStore';
import BookmarkButton from '../../../shared/components/BookmarkButton';

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const {
    selectedCourse,
    loading,
    error,
    fetchCourseById,
    clearError
  } = useCoursesStore();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (courseId) {
      fetchCourseById(courseId);
    }
  }, [courseId, fetchCourseById]);

  const formatDuration = (duration) => {
    if (!duration) return 'N/A';
    
    if (typeof duration === 'string') return duration;
    
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

  const getGrowthProspectColor = (prospect) => {
    switch (prospect) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'average': return 'bg-yellow-100 text-yellow-800';
      case 'limited': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSectorColor = (sector) => {
    switch (sector) {
      case 'government': return 'bg-blue-100 text-blue-800';
      case 'private': return 'bg-purple-100 text-purple-800';
      case 'both': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCollegeTypeColor = (type) => {
    switch (type) {
      case 'government': return 'bg-blue-100 text-blue-800';
      case 'private': return 'bg-purple-100 text-purple-800';
      case 'deemed': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-20">
            <FontAwesomeIcon icon={faSpinner} className="h-6 w-6 text-blue-600 animate-spin mr-3" />
            <span className="text-base text-gray-600">Loading course details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <Alert className="mb-8">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={() => navigate('/courses')} className="mb-4">
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  if (!selectedCourse) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Course not found</h3>
            <p className="text-gray-600 mb-6">The requested course could not be found.</p>
            <Button onClick={() => navigate('/courses')}>
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Back to Courses
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const course = selectedCourse;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button 
            onClick={() => navigate('/courses')} 
            variant="ghost" 
            className="mb-4 hover:bg-white/50"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to Courses
          </Button>
          
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
                {course.name}
              </h1>
              <BookmarkButton 
                type="courses" 
                itemId={course.id}
                className="ml-4"
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge variant="outline" className="text-sm border-blue-200 text-blue-700 bg-white">
                {course.shortName}
              </Badge>
              <Badge variant="outline" className="text-sm border-green-200 text-green-700 bg-white">
                {course.stream?.replace('_', ' ').toUpperCase()}
              </Badge>
              <Badge variant="outline" className="text-sm border-purple-200 text-purple-700 bg-white">
                {course.level?.toUpperCase()}
              </Badge>
            </div>

            <div className="flex items-center gap-6 text-gray-600">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faClock} className="h-4 w-4 mr-2" />
                <span>Duration: {formatDuration(course.duration)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FontAwesomeIcon icon={faBookOpen} className="h-5 w-5 mr-2 text-blue-600" />
                  Course Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{course.description}</p>
              </CardContent>
            </Card>

            {/* Eligibility - Show early on mobile */}
            <div className="lg:hidden">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FontAwesomeIcon icon={faTrophy} className="h-5 w-5 mr-2 text-blue-600" />
                    Eligibility
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Minimum Education</h4>
                    <p className="text-gray-700">Class {course.eligibility?.minimumClass}</p>
                  </div>
                  
                  {course.eligibility?.minimumPercentage && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Minimum Percentage</h4>
                      <p className="text-gray-700">{course.eligibility.minimumPercentage}%</p>
                    </div>
                  )}

                  {course.eligibility?.requiredSubjects && course.eligibility.requiredSubjects.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Required Subjects</h4>
                      <div className="flex flex-wrap gap-2">
                        {course.eligibility.requiredSubjects.map((subject, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {course.eligibility?.entranceExams && course.eligibility.entranceExams.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Entrance Exams</h4>
                      <div className="flex flex-wrap gap-2">
                        {course.eligibility.entranceExams.map((exam, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-orange-200 text-orange-700">
                            {exam}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Career Options */}
            {course.careerOptions && course.careerOptions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FontAwesomeIcon icon={faBriefcase} className="h-5 w-5 mr-2 text-blue-600" />
                    Career Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {course.careerOptions.map((career, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{career.jobTitle}</h4>
                          <div className="flex gap-2">
                            <Badge className={`text-xs ${getGrowthProspectColor(career.growthProspects)}`}>
                              {career.growthProspects}
                            </Badge>
                            <Badge className={`text-xs ${getSectorColor(career.sector)}`}>
                              {career.sector}
                            </Badge>
                          </div>
                        </div>
                        {career.description && (
                          <p className="text-gray-600 text-sm">{career.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Skills */}
            {(course.skills?.technical?.length > 0 || course.skills?.soft?.length > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FontAwesomeIcon icon={faLightbulb} className="h-5 w-5 mr-2 text-blue-600" />
                    Skills Developed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {course.skills.technical && course.skills.technical.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Technical Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {course.skills.technical.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-blue-200 text-blue-700">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {course.skills.soft && course.skills.soft.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Soft Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {course.skills.soft.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-green-200 text-green-700">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Top Colleges - Show on mobile after skills */}
            {course.topColleges && course.topColleges.length > 0 && (
              <div className="lg:hidden">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FontAwesomeIcon icon={faBuilding} className="h-5 w-5 mr-2 text-blue-600" />
                      Top Colleges
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {course.topColleges.map((college, index) => (
                        <div key={index} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
                          <div className="mb-1">
                            <h4 className="font-semibold text-gray-900 text-sm">{college.name}</h4>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-gray-600 text-xs">{college.location}</p>
                            <Badge className={`text-xs ${getCollegeTypeColor(college.type)}`}>
                              {college.type}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Higher Study Options */}
            {course.higherStudyOptions && course.higherStudyOptions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FontAwesomeIcon icon={faGraduationCap} className="h-5 w-5 mr-2 text-blue-600" />
                    Higher Study Options
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {course.higherStudyOptions.map((option, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{option.courseName}</h4>
                          {option.duration && (
                            <Badge variant="outline" className="text-xs">
                              {option.duration}
                            </Badge>
                          )}
                        </div>
                        {option.description && (
                          <p className="text-gray-600 text-sm">{option.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Hidden on mobile, shown on desktop */}
          <div className="hidden lg:block space-y-6">
            {/* Eligibility */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FontAwesomeIcon icon={faTrophy} className="h-5 w-5 mr-2 text-blue-600" />
                  Eligibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Minimum Education</h4>
                  <p className="text-gray-700">Class {course.eligibility?.minimumClass}</p>
                </div>
                
                {course.eligibility?.minimumPercentage && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Minimum Percentage</h4>
                    <p className="text-gray-700">{course.eligibility.minimumPercentage}%</p>
                  </div>
                )}

                {course.eligibility?.requiredSubjects && course.eligibility.requiredSubjects.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Required Subjects</h4>
                    <div className="flex flex-wrap gap-2">
                      {course.eligibility.requiredSubjects.map((subject, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {course.eligibility?.entranceExams && course.eligibility.entranceExams.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Entrance Exams</h4>
                    <div className="flex flex-wrap gap-2">
                      {course.eligibility.entranceExams.map((exam, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-orange-200 text-orange-700">
                          {exam}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Colleges */}
            {course.topColleges && course.topColleges.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FontAwesomeIcon icon={faBuilding} className="h-5 w-5 mr-2 text-blue-600" />
                    Top Colleges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {course.topColleges.map((college, index) => (
                      <div key={index} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
                        <div className="mb-1">
                          <h4 className="font-semibold text-gray-900 text-sm">{college.name}</h4>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-gray-600 text-xs">{college.location}</p>
                          <Badge className={`text-xs ${getCollegeTypeColor(college.type)}`}>
                            {college.type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;