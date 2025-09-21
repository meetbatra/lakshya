import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTachometerAlt,
  faBookmark,
  faBook,
  faUniversity,
  faGraduationCap,
  faMapMarkerAlt,
  faCalendarAlt,
  faClock,
  faEye,
  faSpinner,
  faExclamationTriangle,
  faHeart,
  faTimes,
  faPhone,
  faEnvelope,
  faExternalLinkAlt
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../store/userStore';
import { useBookmarkStore } from '../../../shared/store/bookmarkStore';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useAuth();
  const { bookmarks, isLoading, error, fetchBookmarks, removeBookmark } = useBookmarkStore();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [activeTab, setActiveTab] = useState('courses');
  const [removingBookmarks, setRemovingBookmarks] = useState(new Set());
  const [showAllItems, setShowAllItems] = useState({
    courses: false,
    colleges: false,
    exams: false
  });

  const ITEMS_PER_PAGE = 9; // Show 9 items initially (3x3 grid)

  // Color utility functions for badges
  const getFieldColor = (field) => {
    const colors = {
      // Science PCM fields
      'engineering_technology': 'border-blue-200 text-blue-700',
      'architecture_design': 'border-indigo-200 text-indigo-700',
      'defence_military': 'border-slate-200 text-slate-700',
      'computer_it': 'border-cyan-200 text-cyan-700',
      'pure_sciences_research': 'border-purple-200 text-purple-700',
      
      // Science PCB fields
      'medicine': 'border-red-200 text-red-700',
      'allied_health': 'border-pink-200 text-pink-700',
      'biotechnology': 'border-emerald-200 text-emerald-700',
      'veterinary_science': 'border-teal-200 text-teal-700',
      'agriculture_environment': 'border-green-200 text-green-700',
      
      // Commerce fields
      'business_management': 'border-orange-200 text-orange-700',
      'finance_accounting': 'border-amber-200 text-amber-700',
      'economics_analytics': 'border-yellow-200 text-yellow-700',
      'law_commerce': 'border-amber-200 text-amber-800',
      'entrepreneurship': 'border-rose-200 text-rose-700',
      
      // Arts fields
      'social_sciences': 'border-violet-200 text-violet-700',
      'psychology': 'border-fuchsia-200 text-fuchsia-700',
      'journalism_media': 'border-blue-200 text-blue-800',
      'fine_arts_design': 'border-pink-200 text-pink-800',
      'law_arts': 'border-amber-200 text-amber-800',
      'civil_services': 'border-slate-200 text-slate-700',
      
      'default': 'border-gray-200 text-gray-700'
    };
    return colors[field?.toLowerCase()] || colors.default;
  };

  const getStreamColor = (stream) => {
    const colors = {
      'science_pcm': 'border-blue-200 text-blue-700',
      'science_pcb': 'border-green-200 text-green-700',
      'commerce': 'border-orange-200 text-orange-700',
      'arts': 'border-purple-200 text-purple-700',
      'default': 'border-gray-200 text-gray-700'
    };
    return colors[stream?.toLowerCase()] || colors.default;
  };

  const getLevelColor = (level) => {
    const colors = {
      'undergraduate': 'border-emerald-200 text-emerald-700',
      'postgraduate': 'border-violet-200 text-violet-700',
      'diploma': 'border-teal-200 text-teal-700',
      'certificate': 'border-cyan-200 text-cyan-700',
      'default': 'border-gray-200 text-gray-700'
    };
    return colors[level?.toLowerCase()] || colors.default;
  };

  const getCollegeTypeColor = (type) => {
    const colors = {
      'government': 'border-emerald-200 text-emerald-700',
      'private': 'border-violet-200 text-violet-700',
      'deemed': 'border-rose-200 text-rose-700',
      'autonomous': 'border-teal-200 text-teal-700',
      'university': 'border-blue-200 text-blue-800',
      'institute': 'border-indigo-200 text-indigo-700',
      'default': 'border-gray-200 text-gray-700'
    };
    return colors[type?.toLowerCase()] || colors.default;
  };

  const getCountBadgeColor = (type) => {
    const colors = {
      'courses': 'border-blue-200 text-blue-700',
      'colleges': 'border-green-200 text-green-700',
      'exams': 'border-purple-200 text-purple-700'
    };
    return colors[type] || 'border-gray-200 text-gray-700';
  };

  const getExamMonthColor = (month) => {
    const colors = {
      'january': 'border-sky-200 text-sky-700',
      'february': 'border-indigo-200 text-indigo-700',
      'march': 'border-emerald-200 text-emerald-700',
      'april': 'border-yellow-200 text-yellow-700',
      'may': 'border-orange-200 text-orange-700',
      'june': 'border-red-200 text-red-700',
      'july': 'border-pink-200 text-pink-700',
      'august': 'border-purple-200 text-purple-700',
      'september': 'border-violet-200 text-violet-700',
      'october': 'border-amber-200 text-amber-700',
      'november': 'border-lime-200 text-lime-700',
      'december': 'border-cyan-200 text-cyan-700',
      'default': 'border-gray-200 text-gray-700'
    };
    return colors[month?.toLowerCase()] || colors.default;
  };

  // Formatter functions for display names
  const formatFieldName = (field) => {
    const fieldNames = {
      // Science PCM fields
      'engineering_technology': 'Engineering & Technology',
      'architecture_design': 'Architecture & Design',
      'defence_military': 'Defence & Military',
      'computer_it': 'Computer & IT',
      'pure_sciences_research': 'Pure Sciences & Research',
      
      // Science PCB fields
      'medicine': 'Medicine',
      'allied_health': 'Allied Health',
      'biotechnology': 'Biotechnology',
      'veterinary_science': 'Veterinary Science',
      'agriculture_environment': 'Agriculture & Environment',
      
      // Commerce fields
      'business_management': 'Business & Management',
      'finance_accounting': 'Finance & Accounting',
      'economics_analytics': 'Economics & Analytics',
      'law_commerce': 'Law & Commerce',
      'entrepreneurship': 'Entrepreneurship',
      
      // Arts fields
      'social_sciences': 'Social Sciences',
      'psychology': 'Psychology',
      'journalism_media': 'Journalism & Media',
      'fine_arts_design': 'Fine Arts & Design',
      'law_arts': 'Law & Arts',
      'civil_services': 'Civil Services'
    };
    return fieldNames[field] || field;
  };

  const formatStreamName = (stream) => {
    const streamNames = {
      'science_pcm': 'Science (PCM)',
      'science_pcb': 'Science (PCB)',
      'commerce': 'Commerce',
      'arts': 'Arts'
    };
    return streamNames[stream] || stream;
  };

  const formatLevelName = (level) => {
    const levelNames = {
      'undergraduate': 'Undergraduate',
      'postgraduate': 'Postgraduate',
      'diploma': 'Diploma',
      'certificate': 'Certificate'
    };
    return levelNames[level] || level;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchBookmarks(token).finally(() => {
        setIsInitialLoad(false);
      });
    } else {
      setIsInitialLoad(false);
    }
  }, [isAuthenticated, token, fetchBookmarks]);

  // Show loading state only on initial load
  if (isInitialLoad && isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} className="text-4xl text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const formatDuration = (duration) => {
    if (duration === null || duration === undefined) return '';
    if (typeof duration === 'string') {
      return duration.trim() !== '' ? duration : '';
    }
    if (typeof duration === 'number') {
      if (duration < 12) {
        return `${duration} month${duration > 1 ? 's' : ''}`;
      } else {
        const years = Math.floor(duration / 12);
        const months = duration % 12;
        if (months === 0) {
          return `${years} year${years > 1 ? 's' : ''}`;
        } else {
          return `${years} year${years > 1 ? 's' : ''} ${months} month${months > 1 ? 's' : ''}`;
        }
      }
    }
    if (typeof duration === 'object') {
      const parts = [];
      if (duration.years) parts.push(`${duration.years} year${duration.years > 1 ? 's' : ''}`);
      if (duration.months) parts.push(`${duration.months} month${duration.months > 1 ? 's' : ''}`);
      return parts.join(' ').trim();
    }
    return '';
  };

  // Handle removing a bookmark
  const handleRemoveBookmark = async (type, itemId) => {
    const bookmarkKey = `${type}-${itemId}`;
    setRemovingBookmarks(prev => new Set([...prev, bookmarkKey]));
    
    try {
      const result = await removeBookmark(type, itemId, token);
      if (!result.success) {
        console.error('Failed to remove bookmark:', result.message);
      }
    } catch (error) {
      console.error('Error removing bookmark:', error);
    } finally {
      setRemovingBookmarks(prev => {
        const newSet = new Set(prev);
        newSet.delete(bookmarkKey);
        return newSet;
      });
    }
  };

  const BookmarkTabSection = ({ items, type, emptyMessage, onViewItem }) => {
    const shouldShowMore = items.length > ITEMS_PER_PAGE;
    const displayItems = showAllItems[type] ? items : items.slice(0, ITEMS_PER_PAGE);
    
    const toggleShowAll = () => {
      setShowAllItems(prev => ({
        ...prev,
        [type]: !prev[type]
      }));
    };

    return (
      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-12">
            <FontAwesomeIcon icon={faHeart} className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookmarks yet</h3>
            <p className="text-gray-500 mb-6">{emptyMessage}</p>
            <Button 
              variant="outline" 
              className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              onClick={() => navigate(`/${type}`)}
            >
              Browse {type === 'courses' ? 'Courses' : type === 'colleges' ? 'Colleges' : 'Exams'}
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayItems.map((item) => (
                <div 
                  key={item._id} 
                  className="border rounded-lg p-4 bg-white"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900 text-sm leading-tight">
                      {item.name || item.title}
                    </h4>
                    <div className="flex gap-1 ml-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveBookmark(type, item._id)}
                        disabled={removingBookmarks.has(`${type}-${item._id}`)}
                        className="h-8 px-2 text-xs text-red-600 hover:bg-red-50 hover:border-red-200 disabled:opacity-50"
                        title="Remove bookmark"
                      >
                        {removingBookmarks.has(`${type}-${item._id}`) ? (
                          <FontAwesomeIcon icon={faSpinner} className="h-3 w-3 animate-spin" />
                        ) : (
                          <FontAwesomeIcon icon={faTimes} className="h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewItem(item)}
                        className="h-8 px-3 text-xs"
                      >
                        <FontAwesomeIcon icon={faEye} className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                  
                  {type === 'courses' && (
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {item.field && (
                          <Badge variant="outline" className={`text-xs ${getFieldColor(item.field)}`}>
                            {formatFieldName(item.field)}
                          </Badge>
                        )}
                        {item.level && (
                          <Badge variant="outline" className={`text-xs ${getLevelColor(item.level)}`}>
                            {formatLevelName(item.level)}
                          </Badge>
                        )}
                        {item.stream && (
                          <Badge variant="outline" className={`text-xs ${getStreamColor(item.stream)}`}>
                            {formatStreamName(item.stream)}
                          </Badge>
                        )}
                      </div>
                      {formatDuration(item.duration) && (
                        <p className="text-xs text-gray-600 flex items-center gap-1">
                          <FontAwesomeIcon icon={faClock} className="h-3 w-3" />
                          {formatDuration(item.duration)}
                        </p>
                      )}
                      {item.shortName && (
                        <p className="text-xs text-gray-600">
                          <strong>Short Name:</strong> {item.shortName}
                        </p>
                      )}
                      {item.description && (
                        <p className="text-xs text-gray-700 mt-1 overflow-hidden">
                          {item.description.length > 100 ? `${item.description.substring(0, 100)}...` : item.description}
                        </p>
                      )}
                    </div>
                  )}
                  
                  {type === 'colleges' && (
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {item.type && (
                          <Badge variant="outline" className={`text-xs ${getCollegeTypeColor(item.type)}`}>
                            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                          </Badge>
                        )}
                        {item.courses && item.courses.length > 0 && (
                          <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">
                            {item.courses.length} Course{item.courses.length !== 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                      {item.shortName && (
                        <p className="text-xs text-gray-600">
                          <strong>Short Name:</strong> {item.shortName}
                        </p>
                      )}
                      {item.location && (
                        <p className="text-xs text-gray-600 flex items-center gap-1">
                          <FontAwesomeIcon icon={faMapMarkerAlt} className="h-3 w-3" />
                          {item.location.address ? 
                            `${item.location.address}, ${[item.location.city, item.location.state].filter(Boolean).join(', ')}` :
                            [item.location.city, item.location.state].filter(Boolean).join(', ')
                          }
                        </p>
                      )}
                      {item.contact && (
                        <div className="space-y-1">
                          {item.contact.phone && item.contact.phone.length > 0 && (
                            <p className="text-xs text-gray-600 flex items-center gap-1">
                              <FontAwesomeIcon icon={faPhone} className="h-3 w-3" />
                              {item.contact.phone[0]}
                            </p>
                          )}
                          {item.contact.email && item.contact.email.length > 0 && (
                            <p className="text-xs text-gray-600 flex items-center gap-1">
                              <FontAwesomeIcon icon={faEnvelope} className="h-3 w-3" />
                              {item.contact.email[0]}
                            </p>
                          )}
                          {item.contact.website && (
                            <p className="text-xs text-blue-600 flex items-center gap-1">
                              <FontAwesomeIcon icon={faExternalLinkAlt} className="h-3 w-3" />
                              <span className="truncate">Website available</span>
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {type === 'exams' && (
                    <div className="space-y-2 text-xs text-gray-700">
                      <div className="flex flex-wrap gap-1">
                        {item.streams && item.streams.length > 0 && item.streams.map((stream, idx) => (
                          <Badge key={idx} variant="outline" className={`text-xs ${getStreamColor(stream)}`}>
                            {formatStreamName(stream)}
                          </Badge>
                        ))}
                      </div>
                      {item.shortName && (
                        <p><strong>Short Name:</strong> {item.shortName}</p>
                      )}
                      {item.eligibility && (
                        <p><strong>Eligibility:</strong> {item.eligibility}</p>
                      )}
                      {item.examMonth && (
                        <div className="flex items-center gap-2">
                          <strong>Exam Month:</strong>
                          <Badge variant="outline" className={`text-xs ${getExamMonthColor(item.examMonth)}`}>
                            {item.examMonth}
                          </Badge>
                        </div>
                      )}
                      {item.description && (
                        <p className="mt-1 overflow-hidden">
                          {item.description.length > 80 ? `${item.description.substring(0, 80)}...` : item.description}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Show More/Less Button */}
            {shouldShowMore && (
              <div className="text-center pt-4">
                <Button
                  variant="outline"
                  onClick={toggleShowAll}
                  className="border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  {showAllItems[type] ? (
                    <>
                      Show Less ({items.length - ITEMS_PER_PAGE} hidden)
                    </>
                  ) : (
                    <>
                      Show All {items.length} Items (+{items.length - ITEMS_PER_PAGE} more)
                    </>
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const handleViewCourse = (course) => {
    navigate(`/courses/${course._id}`);
  };

  const handleViewCollege = (college) => {
    navigate(`/colleges/${college._id}`);
  };

  const handleViewExam = (exam) => {
    navigate(`/exams/${exam._id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <FontAwesomeIcon icon={faTachometerAlt} className="h-16 w-16 text-blue-600 mb-4" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent mb-4">
              Dashboard
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Welcome back, {user?.name || 'Student'}!
            </p>
            <p className="text-sm text-gray-500">
              Here are your bookmarked items for quick access
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <FontAwesomeIcon icon={faExclamationTriangle} className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Bookmark Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="cursor-pointer" onClick={() => setActiveTab('courses')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Courses</h3>
                  <p className="text-3xl font-bold text-blue-600">{bookmarks.courses?.length || 0}</p>
                </div>
                <FontAwesomeIcon icon={faBook} className="h-12 w-12 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer" onClick={() => setActiveTab('colleges')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Colleges</h3>
                  <p className="text-3xl font-bold text-green-600">{bookmarks.colleges?.length || 0}</p>
                </div>
                <FontAwesomeIcon icon={faUniversity} className="h-12 w-12 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer" onClick={() => setActiveTab('exams')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Exams</h3>
                  <p className="text-3xl font-bold text-purple-600">{bookmarks.exams?.length || 0}</p>
                </div>
                <FontAwesomeIcon icon={faGraduationCap} className="h-12 w-12 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Bookmarks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FontAwesomeIcon icon={faBookmark} className="h-5 w-5 text-blue-600" />
              My Bookmarks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-auto">
                <TabsTrigger value="courses" className="flex items-center justify-center gap-1 sm:gap-2 px-1 sm:px-3 py-2 text-xs sm:text-sm">
                  <FontAwesomeIcon icon={faBook} className="h-4 w-4" />
                  <span className="hidden sm:inline">Courses ({bookmarks.courses?.length || 0})</span>
                </TabsTrigger>
                <TabsTrigger value="colleges" className="flex items-center justify-center gap-1 sm:gap-2 px-1 sm:px-3 py-2 text-xs sm:text-sm">
                  <FontAwesomeIcon icon={faUniversity} className="h-4 w-4" />
                  <span className="hidden sm:inline">Colleges ({bookmarks.colleges?.length || 0})</span>
                </TabsTrigger>
                <TabsTrigger value="exams" className="flex items-center justify-center gap-1 sm:gap-2 px-1 sm:px-3 py-2 text-xs sm:text-sm">
                  <FontAwesomeIcon icon={faGraduationCap} className="h-4 w-4" />
                  <span className="hidden sm:inline">Exams ({bookmarks.exams?.length || 0})</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="courses" className="mt-6">
                <BookmarkTabSection
                  items={bookmarks.courses || []}
                  type="courses"
                  emptyMessage="Bookmarked courses will show here"
                  onViewItem={handleViewCourse}
                />
              </TabsContent>
              
              <TabsContent value="colleges" className="mt-6">
                <BookmarkTabSection
                  items={bookmarks.colleges || []}
                  type="colleges"
                  emptyMessage="Bookmarked colleges will show here"
                  onViewItem={handleViewCollege}
                />
              </TabsContent>
              
              <TabsContent value="exams" className="mt-6">
                <BookmarkTabSection
                  items={bookmarks.exams || []}
                  type="exams"
                  emptyMessage="Bookmarked exams will show here"
                  onViewItem={handleViewExam}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;