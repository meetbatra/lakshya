import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faSpinner, 
  faCalendarAlt,
  faClipboardList,
  faGraduationCap,
  faExternalLinkAlt,
  faFilter,
  faTimes,
  faBook,
  faCheckCircle,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import useExamsStore from '../store/examsStore';
import { useAuth } from '../../user/store/userStore';
import BookmarkButton from '../../../shared/components/BookmarkButton';

const Exams = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const { user, isAuthenticated } = useAuth();
  
  const {
    exams,
    loading,
    error,
    filters,
    filterOptions,
    fetchAllExams,
    fetchFilterOptions,
    setFilters,
    resetFilters,
    clearError,
    getFilteredExams
  } = useExamsStore();

  // Get filtered exams for display
  const filteredExams = getFilteredExams();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchAllExams();
    fetchFilterOptions();
  }, []);

  const handleSearchChange = (e) => {
    setFilters({ search: e.target.value });
  };

  const handleFilterChange = (filterName, value) => {
    setFilters({ [filterName]: value });
  };

  const handleClearFilters = () => {
    resetFilters();
  };

  const handleExamClick = (examId) => {
    navigate(`/exams/${examId}`);
  };

  const getStreamBadgeColor = (stream) => {
    const colors = {
      'science_pcm': 'bg-blue-100 text-blue-800',
      'science_pcb': 'bg-green-100 text-green-800',
      'commerce': 'bg-yellow-100 text-yellow-800',
      'arts': 'bg-purple-100 text-purple-800'
    };
    return colors[stream] || 'bg-gray-100 text-gray-800';
  };

  const formatStreamName = (stream) => {
    const names = {
      'science_pcm': 'Science (PCM)',
      'science_pcb': 'Science (PCB)',
      'commerce': 'Commerce',
      'arts': 'Arts'
    };
    return names[stream] || stream;
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

  if (loading && exams.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <FontAwesomeIcon icon={faSpinner} spin className="text-3xl text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent mb-4">
              Competitive Exams
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover entrance exams for your dream career path. Find the right exam that matches your stream and goals.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative">
              <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search exams by name, description, or syllabus..."
                value={filters.search}
                onChange={handleSearchChange}
                className="pl-11 py-3 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 pb-8 px-4 sm:px-6 lg:px-8">
        {/* Error State */}
        {error && (
          <Alert className="mb-8">
            <AlertDescription>{error}</AlertDescription>
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
            
            {(filters.streams !== 'all' || filters.examMonth !== 'all' || filters.search) && (
              <Button
                variant="ghost"
                onClick={handleClearFilters}
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Stream Filter */}
                    <div className="transform transition-all duration-200 hover:scale-105">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stream
                      </label>
                      <select
                        value={filters.streams}
                        onChange={(e) => handleFilterChange('streams', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-400 focus:scale-105"
                      >
                        <option value="all">All Streams</option>
                        {filterOptions.streams.map((stream) => (
                          <option key={stream} value={stream}>
                            {formatStreamName(stream)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Exam Month Filter */}
                    <div className="transform transition-all duration-200 hover:scale-105">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Exam Month
                      </label>
                      <select
                        value={filters.examMonth}
                        onChange={(e) => handleFilterChange('examMonth', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-400 focus:scale-105"
                      >
                        <option value="all">All Months</option>
                        {filterOptions.examMonths.map((month) => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Sort By */}
                    <div className="transform transition-all duration-200 hover:scale-105">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sort By
                      </label>
                      <select
                        value="name"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-400 focus:scale-105"
                      >
                        <option value="name">Name</option>
                        <option value="examMonth">Exam Month</option>
                        <option value="streams">Stream</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <FontAwesomeIcon icon={faSpinner} className="h-6 w-6 text-blue-600 animate-spin mr-3" />
            <span className="text-base text-gray-600">Loading exams...</span>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Results Header */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {filteredExams?.length || 0} Exams
                  </h2>
                  <p className="text-gray-600">
                    {filters.search || filters.streams !== 'all' || filters.examMonth !== 'all' ? 
                      `Showing ${filteredExams?.length || 0} filtered results` : 
                      `${filteredExams?.length || 0} exams available`
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Exams Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(filteredExams || []).map((exam, index) => (
                <Card 
                  key={exam?._id || index} 
                  className="hover:shadow-md transition-shadow duration-200 border border-gray-200 flex flex-col h-full"
                >
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="mb-4">
                        <div className="mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 leading-tight mb-3">
                            {exam?.name || 'Unknown Exam'}
                          </h3>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">
                            {exam?.shortName || 'N/A'}
                          </Badge>
                          {exam?.examMonth && (
                            <Badge variant="outline" className="text-xs border-green-200 text-green-700">
                              {exam.examMonth}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Exam Description */}
                      <div className="mb-4">
                        <p className="text-gray-600 text-sm leading-relaxed" style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {exam?.description || 'No description available'}
                        </p>
                      </div>

                      {/* Exam Details */}
                      <div className="space-y-3 mb-4">
                        {/* Eligibility */}
                        {exam?.eligibility && (
                          <div className="flex items-start gap-1 text-sm text-gray-600">
                            <FontAwesomeIcon icon={faCheckCircle} className="h-3 w-3 mt-0.5" />
                            <span className="line-clamp-2">{exam.eligibility}</span>
                          </div>
                        )}

                        {/* Syllabus Count */}
                        {exam?.syllabus && exam.syllabus.length > 0 && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <FontAwesomeIcon icon={faBook} className="h-3 w-3" />
                            <span>{exam.syllabus.length} subject{exam.syllabus.length !== 1 ? 's' : ''} covered</span>
                          </div>
                        )}
                      </div>

                      {/* Streams Preview */}
                      {exam?.streams && exam.streams.length > 0 && (
                        <div className="mb-4">
                          <div className="text-sm font-medium text-gray-700 mb-2">Applicable Streams</div>
                          <div className="flex flex-wrap gap-1">
                            {exam.streams.slice(0, 2).map((stream, streamIndex) => (
                              <span key={streamIndex} className={`inline-block text-xs px-2 py-1 rounded ${getStreamBadgeColor(stream)}`}>
                                {formatStreamName(stream)}
                              </span>
                            ))}
                            {exam.streams.length > 2 && (
                              <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                                +{exam.streams.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Syllabus Preview */}
                      {exam?.syllabus && exam.syllabus.length > 0 && (
                        <div className="mb-4">
                          <div className="text-sm font-medium text-gray-700 mb-2">Key Subjects</div>
                          <div className="space-y-1">
                            {exam.syllabus.slice(0, 2).map((subject, subjectIndex) => (
                              <div key={subjectIndex} className="text-sm">
                                <span className="font-medium text-gray-800">{subject}</span>
                              </div>
                            ))}
                            {exam.syllabus.length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{exam.syllabus.length - 2} more subjects
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Official Link Indicator */}
                      {exam?.officialLink && (
                        <div className="mb-4">
                          <div className="flex items-center text-blue-600 text-sm">
                            <FontAwesomeIcon icon={faExternalLinkAlt} className="h-3 w-3 mr-2" />
                            <span>Official website available</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons - Fixed at bottom */}
                    <div className="flex gap-2 mt-auto">
                      <Button 
                        className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                        variant="outline"
                        onClick={() => handleExamClick(exam._id)}
                      >
                        View Full Details
                      </Button>
                      <BookmarkButton 
                        type="exams" 
                        itemId={exam._id}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* No Results */}
            {(filteredExams?.length || 0) === 0 && (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <FontAwesomeIcon icon={faSearch} className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No exams found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search or selecting a different category</p>
                <Button 
                  className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                  variant="outline"
                  onClick={() => {
                    setFilters({ search: '' });
                  }}
                >
                  Clear Search
                </Button>
              </div>
            )}
          </>
        )}

        {/* Loading overlay for subsequent loads */}
        {loading && exams.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <FontAwesomeIcon icon={faSpinner} spin className="text-2xl text-blue-600 mr-3" />
              <span>Loading exams...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Exams;