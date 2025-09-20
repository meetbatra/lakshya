import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Alert, AlertDescription } from '../../../components/ui/alert';
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
  faHeart
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../store/userStore';
import { useBookmarkStore } from '../../../shared/store/bookmarkStore';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useAuth();
  const { bookmarks, isLoading, error, fetchBookmarks } = useBookmarkStore();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    console.log('Dashboard auth state:', { isAuthenticated, token: token ? 'Token present' : 'No token' });
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
  if (!isAuthenticated) {
    navigate('/auth/login');
    return null;
  }

  const formatDuration = (duration) => {
    if (!duration) return 'N/A';
    
    if (typeof duration === 'string') {
      return duration;
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
    
    return 'N/A';
  };

  const BookmarkSection = ({ title, items, type, emptyMessage, onViewItem }) => (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FontAwesomeIcon 
            icon={type === 'courses' ? faBook : type === 'colleges' ? faUniversity : faGraduationCap} 
            className="h-5 w-5 text-blue-600" 
          />
          {title}
          <Badge variant="secondary" className="ml-auto">
            {items.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="text-center py-8">
            <FontAwesomeIcon icon={faHeart} className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500">{emptyMessage}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3"
              onClick={() => navigate(`/${type}`)}
            >
              Browse {title}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {items.map((item) => (
              <div 
                key={item._id} 
                className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900 text-sm leading-tight">
                    {item.name || item.title}
                  </h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewItem(item)}
                    className="ml-2 h-8 px-3 text-xs"
                  >
                    <FontAwesomeIcon icon={faEye} className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </div>
                
                {/* Course specific fields
                {type === 'courses' && (
                  <div className="space-y-1">
                    {item.category && (
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                    )}
                    {item.duration && (
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <FontAwesomeIcon icon={faClock} className="h-3 w-3" />
                        {formatDuration(item.duration)}
                      </p>
                    )}
                  </div>
                )} */}
                
                {/* College specific fields */}
                {type === 'colleges' && (
                  <div className="space-y-1">
                    {item.location && (
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="h-3 w-3" />
                        {item.location}
                      </p>
                    )}
                    {item.type && (
                      <Badge variant="outline" className="text-xs">
                        {item.type}
                      </Badge>
                    )}
                  </div>
                )}
                
                {/* Exam specific fields */}
                {type === 'exams' && (
                  <div className="space-y-1">
                    {item.type && (
                      <Badge variant="outline" className="text-xs">
                        {item.type}
                      </Badge>
                    )}
                    {item.examDate && (
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <FontAwesomeIcon icon={faCalendarAlt} className="h-3 w-3" />
                        {new Date(item.examDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

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

        {/* Bookmarks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <BookmarkSection
            title="Bookmarked Courses"
            items={bookmarks.courses || []}
            type="courses"
            emptyMessage="No bookmarked courses yet. Start exploring to find courses that interest you!"
            onViewItem={handleViewCourse}
          />
          
          <BookmarkSection
            title="Bookmarked Colleges"
            items={bookmarks.colleges || []}
            type="colleges"
            emptyMessage="No bookmarked colleges yet. Browse colleges to bookmark your favorites!"
            onViewItem={handleViewCollege}
          />
          
          <BookmarkSection
            title="Bookmarked Exams"
            items={bookmarks.exams || []}
            type="exams"
            emptyMessage="No bookmarked exams yet. Check out available exams to stay updated!"
            onViewItem={handleViewExam}
          />
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/quiz/start')}
                className="h-auto py-4 flex flex-col items-center gap-2"
              >
                <FontAwesomeIcon icon={faTachometerAlt} className="h-5 w-5" />
                <span>Take Quiz</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/courses')}
                className="h-auto py-4 flex flex-col items-center gap-2"
              >
                <FontAwesomeIcon icon={faBook} className="h-5 w-5" />
                <span>Browse Courses</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/colleges')}
                className="h-auto py-4 flex flex-col items-center gap-2"
              >
                <FontAwesomeIcon icon={faUniversity} className="h-5 w-5" />
                <span>Find Colleges</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/exams')}
                className="h-auto py-4 flex flex-col items-center gap-2"
              >
                <FontAwesomeIcon icon={faGraduationCap} className="h-5 w-5" />
                <span>View Exams</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;