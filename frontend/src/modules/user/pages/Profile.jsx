import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faGraduationCap, 
  faMapMarkerAlt, 
  faCalendarAlt,
  faEdit,
  faSave,
  faTimes,
  faBook,
  faUniversity,
  faQuestionCircle,
  faSignOutAlt,
  faCheckCircle,
  faStream,
  faBullseye
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../store/userStore';
import { authAPI } from '../api/authAPI';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, getUserInitials, getUserAvatar, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    stream: user?.stream || '',
    field: user?.field || ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [imageError, setImageError] = useState(false);

  const avatarUrl = getUserAvatar();

  // Reset image error when avatar URL changes
  useEffect(() => {
    setImageError(false);
  }, [avatarUrl]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  // Stream options
  const streamOptions = [
    { value: 'science_pcm', label: 'Science (PCM)' },
    { value: 'science_pcb', label: 'Science (PCB)' },
    { value: 'commerce', label: 'Commerce' },
    { value: 'arts', label: 'Arts' }
  ];

  // Field options based on stream
  const getFieldOptions = (stream) => {
    const streamFieldMap = {
      'science_pcm': [
        { value: 'engineering_technology', label: 'Engineering & Technology' },
        { value: 'architecture_design', label: 'Architecture & Design' },
        { value: 'pure_sciences_research', label: 'Pure Sciences & Research' },
        { value: 'computer_it', label: 'Computer Science & IT' },
        { value: 'defence_military', label: 'Defence & Military' }
      ],
      'science_pcb': [
        { value: 'medicine', label: 'Medicine (MBBS)' },
        { value: 'allied_health', label: 'Allied Health Sciences' },
        { value: 'biotechnology', label: 'Biotechnology' },
        { value: 'veterinary_science', label: 'Veterinary Science' },
        { value: 'agriculture_environment', label: 'Agriculture & Environment' }
      ],
      'commerce': [
        { value: 'business_management', label: 'Business & Management' },
        { value: 'finance_accounting', label: 'Finance & Accounting' },
        { value: 'economics_analytics', label: 'Economics & Analytics' },
        { value: 'law_commerce', label: 'Law (Commerce)' },
        { value: 'entrepreneurship', label: 'Entrepreneurship' }
      ],
      'arts': [
        { value: 'social_sciences', label: 'Social Sciences' },
        { value: 'psychology', label: 'Psychology' },
        { value: 'journalism_media', label: 'Journalism & Media' },
        { value: 'fine_arts_design', label: 'Fine Arts & Design' },
        { value: 'law_arts', label: 'Law (Arts)' },
        { value: 'civil_services', label: 'Civil Services' }
      ]
    };
    return streamFieldMap[stream] || [];
  };

  const formatStreamName = (stream) => {
    const streamMap = {
      'science_pcm': 'Science (PCM)',
      'science_pcb': 'Science (PCB)', 
      'commerce': 'Commerce',
      'arts': 'Arts'
    };
    return streamMap[stream] || stream;
  };

  const formatFieldName = (field) => {
    const fieldMap = {
      'engineering_technology': 'Engineering & Technology',
      'architecture_design': 'Architecture & Design',
      'pure_sciences_research': 'Pure Sciences & Research',
      'computer_it': 'Computer Science & IT',
      'defence_military': 'Defence & Military',
      'medicine': 'Medicine (MBBS)',
      'allied_health': 'Allied Health Sciences',
      'biotechnology': 'Biotechnology',
      'veterinary_science': 'Veterinary Science',
      'agriculture_environment': 'Agriculture & Environment',
      'business_management': 'Business & Management',
      'finance_accounting': 'Finance & Accounting',
      'economics_analytics': 'Economics & Analytics',
      'law_commerce': 'Law (Commerce)',
      'entrepreneurship': 'Entrepreneurship',
      'social_sciences': 'Social Sciences',
      'psychology': 'Psychology',
      'journalism_media': 'Journalism & Media',
      'fine_arts_design': 'Fine Arts & Design',
      'law_arts': 'Law (Arts)',
      'civil_services': 'Civil Services'
    };
    return fieldMap[field] || field;
  };

  // Check if profile is complete
  const isProfileComplete = () => {
    return user?.state && user?.class && user?.stream && 
           (user?.class === '10' || (user?.class === '12' && user?.field));
  };

  const handleCompleteProfile = () => {
    navigate('/auth/complete-profile');
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    // Update edit data when user changes
    if (user) {
      setEditData({
        stream: user.stream || '',
        field: user.field || ''
      });
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
    setMessage({ type: '', text: '' });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      stream: user.stream || '',
      field: user.field || ''
    });
    setMessage({ type: '', text: '' });
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Validation: Stream is mandatory for all users
    if (!editData.stream) {
      setMessage({ 
        type: 'error', 
        text: 'Stream is required. Please select a stream before saving.' 
      });
      setLoading(false);
      return;
    }

    // Validation: Field is mandatory for Class 12 students
    if (user.class === '12' && !editData.field) {
      setMessage({ 
        type: 'error', 
        text: 'Field is required for Class 12 students. Please select a field before saving.' 
      });
      setLoading(false);
      return;
    }

    try {
      // Call API to update user profile
      const updateData = {
        stream: editData.stream,
        ...(user.class === '12' && editData.field && { field: editData.field })
      };

      const response = await authAPI.updateProfile(updateData);
      
      // Update the user in the store
      login({ user: response.user, token: response.token });
      
      setIsEditing(false);
      setMessage({ 
        type: 'success', 
        text: 'Profile updated successfully! Your preferences will be applied to course recommendations.' 
      });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to update profile. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStreamChange = (value) => {
    setEditData({
      stream: value,
      field: '' // Reset field when stream changes
    });
  };

  // Check if all required fields are filled
  const areRequiredFieldsFilled = () => {
    const hasStream = !!editData.stream;
    const hasField = user.class !== '12' || !!editData.field;
    return hasStream && hasField;
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      logout();
      navigate('/');
    }
  };

  const handleRetakeQuiz = () => {
    navigate('/quiz');
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden mx-auto mb-4 sm:mb-6 border-4 border-white shadow-xl">
              {!imageError && avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt={user.name}
                  className="h-full w-full object-cover"
                  onError={handleImageError}
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="h-full w-full bg-blue-600 text-white flex items-center justify-center text-xl sm:text-2xl font-bold">
                  {getUserInitials()}
                </div>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 px-4">{user.name}</h1>
            <p className="text-blue-100 text-base sm:text-lg mb-4 px-4 break-all">{user.email}</p>
            <div className="flex flex-wrap justify-center gap-2 px-4">
              {isProfileComplete() && (
                <Badge className="bg-blue-500 text-white text-xs sm:text-sm">
                  <FontAwesomeIcon icon={faGraduationCap} className="h-3 w-3 mr-1" />
                  Class {user.class}
                </Badge>
              )}
              {user.stream && (
                <Badge className="bg-indigo-500 text-white text-xs sm:text-sm">
                  <FontAwesomeIcon icon={faStream} className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">{formatStreamName(user.stream)}</span>
                  <span className="sm:hidden">{formatStreamName(user.stream).split(' ')[0]}</span>
                </Badge>
              )}
              {user.field && (
                <Badge className="bg-purple-500 text-white text-xs sm:text-sm max-w-xs truncate">
                  <FontAwesomeIcon icon={faBullseye} className="h-3 w-3 mr-1" />
                  <span className="truncate">{formatFieldName(user.field)}</span>
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Success/Error Message */}
        {message.text && (
          <Alert className={`mb-6 ${message.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <FontAwesomeIcon 
              icon={message.type === 'success' ? faCheckCircle : faTimes} 
              className={`h-4 w-4 ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`} 
            />
            <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        {/* Incomplete Profile Alert */}
        {!isProfileComplete() && (
          <Alert className="mb-6 bg-amber-50 border-amber-200">
            <FontAwesomeIcon icon={faQuestionCircle} className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <span className="font-medium">Complete your profile</span> to get personalized course and college recommendations.
                </div>
                <Button 
                  onClick={handleCompleteProfile}
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-700 text-white whitespace-nowrap"
                >
                  <FontAwesomeIcon icon={faEdit} className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">Complete Profile</span>
                  <span className="sm:hidden">Complete</span>
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <CardTitle className="text-xl sm:text-2xl text-gray-900 flex items-center">
                    <FontAwesomeIcon icon={faUser} className="h-5 w-5 mr-2 text-blue-600" />
                    Profile Information
                  </CardTitle>
                  {!isEditing ? (
                    <Button 
                      onClick={handleEdit}
                      variant="outline"
                      size="sm"
                      className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white whitespace-nowrap"
                    >
                      <FontAwesomeIcon icon={faEdit} className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Edit Preferences</span>
                      <span className="sm:hidden">Edit</span>
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleSave}
                        size="sm"
                        disabled={loading || !areRequiredFieldsFilled()}
                        className={`${!areRequiredFieldsFilled() ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                      >
                        <FontAwesomeIcon icon={faSave} className="h-4 w-4 mr-1" />
                        {loading ? 'Saving...' : 'Save'}
                      </Button>
                      <Button 
                        onClick={handleCancel}
                        variant="outline"
                        size="sm"
                        className="border-gray-400 text-gray-600 hover:bg-gray-100"
                      >
                        <FontAwesomeIcon icon={faTimes} className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-1">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="h-4 w-4 mr-2 text-gray-400" />
                      State
                    </dt>
                    <dd className="text-base sm:text-lg font-medium">
                      <span className={user.state ? 'text-gray-900' : 'text-gray-500'}>
                        {user.state || 'Not selected'}
                      </span>
                    </dd>
                  </div>

                  <div className="space-y-1">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <FontAwesomeIcon icon={faCalendarAlt} className="h-4 w-4 mr-2 text-gray-400" />
                      Member Since
                    </dt>
                    <dd className="text-base sm:text-lg text-gray-900 font-medium">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                    </dd>
                  </div>

                  {/* Stream Selection */}
                  <div className="space-y-2">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <FontAwesomeIcon icon={faStream} className="h-4 w-4 mr-2 text-gray-400" />
                      <span>Stream </span>
                      <span className="text-red-500">*</span>
                      <span className="hidden sm:inline ml-1">{user.class === '10' ? '(Planning to Choose)' : '(Currently Studying)'}</span>
                    </dt>
                    {!isEditing ? (
                      <dd className="text-base sm:text-lg font-medium">
                        <span className={user.stream ? 'text-gray-900' : 'text-red-500'}>
                          {user.stream ? formatStreamName(user.stream) : 'Not selected (required)'}
                        </span>
                      </dd>
                    ) : (
                      <Select value={editData.stream} onValueChange={handleStreamChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select your stream (required)" />
                        </SelectTrigger>
                        <SelectContent>
                          {streamOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  {/* Field Selection (only for Class 12) */}
                  {user.class === '12' && (
                    <div className="space-y-2">
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <FontAwesomeIcon icon={faBullseye} className="h-4 w-4 mr-2 text-gray-400" />
                        Field of Interest
                        <span className="text-red-500 ml-1">*</span>
                      </dt>
                      {!isEditing ? (
                        <dd className="text-base sm:text-lg font-medium">
                          <span className={user.field ? 'text-gray-900' : 'text-red-500'}>
                            {user.field ? formatFieldName(user.field) : 'Not selected (required)'}
                          </span>
                        </dd>
                      ) : (
                        <Select 
                          value={editData.field} 
                          onValueChange={(value) => setEditData({...editData, field: value})}
                          disabled={!editData.stream}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={editData.stream ? "Select your field of interest (required)" : "Select stream first"} />
                          </SelectTrigger>
                          <SelectContent>
                            {getFieldOptions(editData.stream).map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  )}
                </div>

                {isEditing && (
                  <>
                    <div className="mt-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs sm:text-sm text-blue-800">
                        <FontAwesomeIcon icon={faCheckCircle} className="h-4 w-4 mr-2" />
                        Updating your preferences will automatically apply filters when you visit the courses page, 
                        showing you the most relevant content based on your academic profile.
                      </p>
                    </div>
                    
                    {!areRequiredFieldsFilled() && (
                      <div className="mt-3 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-xs sm:text-sm text-red-800">
                          <span className="text-red-500 mr-1">*</span>
                          Please fill in all required fields to save your profile. 
                          {!editData.stream && ' Stream selection is required.'}
                          {user.class === '12' && !editData.field && ' Field selection is required for Class 12 students.'}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <Button 
                  onClick={() => navigate('/courses')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base"
                >
                  <FontAwesomeIcon icon={faBook} className="h-4 w-4 mr-2" />
                  Explore Courses
                </Button>
                
                <Button 
                  onClick={() => navigate('/colleges')}
                  variant="outline"
                  className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white text-sm sm:text-base"
                >
                  <FontAwesomeIcon icon={faUniversity} className="h-4 w-4 mr-2" />
                  Browse Colleges
                </Button>
                
                <Button 
                  onClick={handleRetakeQuiz}
                  variant="outline"
                  className="w-full border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white text-sm sm:text-base"
                >
                  <FontAwesomeIcon icon={faQuestionCircle} className="h-4 w-4 mr-2" />
                  Take Career Quiz
                </Button>
                
                <div className="pt-3 sm:pt-4 border-t">
                  <Button 
                    onClick={handleLogout}
                    variant="destructive"
                    className="w-full text-sm sm:text-base"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Your Journey</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-gray-600">Profile Completion</span>
                    <span className="text-xs sm:text-sm font-medium text-gray-900">
                      {user.stream && (user.class === '10' || user.field) ? '100%' : user.stream ? '75%' : '50%'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: user.stream && (user.class === '10' || user.field) ? '100%' : user.stream ? '75%' : '50%'
                      }}
                    ></div>
                  </div>
                  
                  <div className="pt-3 sm:pt-4 space-y-2">
                    <div className="flex items-center text-xs sm:text-sm">
                      <FontAwesomeIcon icon={faCheckCircle} className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                      <span className="text-gray-600">Basic profile created</span>
                    </div>
                    <div className="flex items-center text-xs sm:text-sm">
                      <FontAwesomeIcon 
                        icon={user.stream ? faCheckCircle : faTimes} 
                        className={`h-4 w-4 mr-2 flex-shrink-0 ${user.stream ? 'text-green-500' : 'text-gray-300'}`} 
                      />
                      <span className={user.stream ? 'text-gray-600' : 'text-gray-400'}>
                        Stream preference set
                      </span>
                    </div>
                    {user.class === '12' && (
                      <div className="flex items-center text-xs sm:text-sm">
                        <FontAwesomeIcon 
                          icon={user.field ? faCheckCircle : faTimes} 
                          className={`h-4 w-4 mr-2 flex-shrink-0 ${user.field ? 'text-green-500' : 'text-gray-300'}`} 
                        />
                        <span className={user.field ? 'text-gray-600' : 'text-gray-400'}>
                          Field of interest selected
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
