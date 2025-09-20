import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft,
  faSpinner,
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faGlobe,
  faGraduationCap,
  faUniversity,
  faExternalLinkAlt
} from '@fortawesome/free-solid-svg-icons';
import { useCollegesStore } from '../store/collegesStore';
import BookmarkButton from '../../../shared/components/BookmarkButton';

const CollegeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  const {
    selectedCollege,
    error,
    fetchCollegeById,
    clearSelectedCollege,
    clearError
  } = useCollegesStore();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      fetchCollegeById(id).finally(() => setLoading(false));
    }
    
    return () => clearSelectedCollege();
  }, [id]);

  const handleBack = () => {
    navigate('/colleges');
  };

  // Helper function to get college type badge color
  const getTypeColor = (type) => {
    switch (type) {
      case 'government': return 'bg-green-100 text-green-800';
      case 'private': return 'bg-blue-100 text-blue-800';
      case 'deemed': return 'bg-purple-100 text-purple-800';
      case 'autonomous': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} className="h-8 w-8 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600">Loading college details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Button 
            onClick={handleBack} 
            variant="ghost" 
            className="mb-6 flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
            Back to Colleges
          </Button>
          
          <Alert>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!selectedCollege) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Button 
            onClick={handleBack} 
            variant="ghost" 
            className="mb-6 flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
            Back to Colleges
          </Button>
          
          <div className="text-center py-16">
            <FontAwesomeIcon icon={faUniversity} className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">College not found</h3>
            <p className="text-gray-600">The college you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </div>
    );
  }

  const college = selectedCollege;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button 
            onClick={handleBack} 
            variant="ghost" 
            className="mb-4 hover:bg-white/50"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to Colleges
          </Button>
          
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
                {college.name}
              </h1>
              <BookmarkButton 
                type="colleges" 
                itemId={college._id}
                className="ml-4"
              />
            </div>
            
            {college.shortName && (
              <p className="text-xl text-gray-600 font-medium mb-4">
                {college.shortName}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge variant="outline" className={`text-sm ${getTypeColor(college.type)} border-blue-200 bg-white`}>
                {college.type?.charAt(0).toUpperCase() + college.type?.slice(1)}
              </Badge>
              {college.courses && college.courses.length > 0 && (
                <Badge variant="outline" className="text-sm border-green-200 text-green-700 bg-white">
                  {college.courses.length} Course{college.courses.length !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>

            {college.location && (
              <div className="flex items-center gap-6 text-gray-600">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="h-4 w-4 mr-2" />
                  <span>
                    {college.location.city}
                    {college.location.state && `, ${college.location.state}`}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* College Image */}
            {college.images && college.images.length > 0 && (
              <Card className="py-0">
                <CardContent className="p-0">
                  <img 
                    src={college.images[0]} 
                    alt={college.name}
                    className="w-full h-64 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Address */}
            {college.location && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="h-5 w-5 text-blue-600" />
                    Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-700">
                    {college.location.address && (
                      <p className="mb-2">{college.location.address}</p>
                    )}
                    <p>
                      {college.location.city}
                      {college.location.state && `, ${college.location.state}`}
                      {college.location.pincode && ` - ${college.location.pincode}`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Courses Offered */}
            {college.courses && college.courses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faGraduationCap} className="h-5 w-5 text-blue-600" />
                    Courses Offered ({college.courses.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {college.courses.map((course, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-900">
                          {course.courseName || 'Course'}
                        </h4>
                        {course.courseId && (
                          <p className="text-sm text-gray-600 mt-1">
                            Course ID: {course.courseId}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Phone Numbers */}
                {college.contact?.phone && college.contact.phone.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FontAwesomeIcon icon={faPhone} className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">Phone</span>
                    </div>
                    <div className="space-y-1">
                      {college.contact.phone.map((phone, index) => (
                        <a 
                          key={index}
                          href={`tel:${phone}`}
                          className="block text-blue-600 hover:text-blue-800 text-sm"
                        >
                          {phone}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Email Addresses */}
                {college.contact?.email && college.contact.email.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FontAwesomeIcon icon={faEnvelope} className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">Email</span>
                    </div>
                    <div className="space-y-1">
                      {college.contact.email.map((email, index) => (
                        <a 
                          key={index}
                          href={`mailto:${email}`}
                          className="block text-blue-600 hover:text-blue-800 text-sm break-all"
                        >
                          {email}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Website */}
                {college.contact?.website && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FontAwesomeIcon icon={faGlobe} className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">Website</span>
                    </div>
                    <a 
                      href={college.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Visit Website
                      <FontAwesomeIcon icon={faExternalLinkAlt} className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-gray-600">Type</span>
                  <Badge className={`${getTypeColor(college.type)} border-0 text-xs`}>
                    {college.type?.charAt(0).toUpperCase() + college.type?.slice(1)}
                  </Badge>
                </div>
                
                {college.courses && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-gray-600">Courses</span>
                    <span className="font-semibold">{college.courses.length}</span>
                  </div>
                )}
                
                {college.location?.state && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-gray-600">State</span>
                    <span className="font-semibold">{college.location.state}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeDetails;