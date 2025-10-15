import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '../store/quizStore';
import { useAuth } from '../../user/store/userStore';
import { authAPI } from '../../user/api/authAPI';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { toast } from 'sonner';
import { 
  Trophy, 
  BookOpen, 
  Lightbulb, 
  Target, 
  Download, 
  RefreshCw,
  Home,
  Sparkles,
  Settings,
} from 'lucide-react';

const QuizResults = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, login } = useAuth();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const {
    quizResults,
    isQuizCompleted,
    error,
    resetQuiz,
    clearError
  } = useQuizStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!isQuizCompleted || !quizResults) {
    return (
      <div className="h-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  const { recommendations, totalQuestions, submittedAt, courses } = quizResults;
  const primaryRecommendation = recommendations?.[0];

  // Check if recommended stream/field differs from user's current profile
  const isRecommendationDifferent = () => {
    if (!user || !primaryRecommendation) {
      return false;
    }
    
    // Get user's current stream and field (could be in user directly or in user.profile)
    const userStream = user.stream || user.profile?.stream;
    const userField = user.field || user.profile?.field;
    
    if (primaryRecommendation.fieldId) {
      // This is a field recommendation (Class 12)
      return userField !== primaryRecommendation.fieldId;
    } else if (primaryRecommendation.stream) {
      // This is a stream recommendation (Class 10 or 12)
      return userStream !== primaryRecommendation.stream;
    }
    
    return false;
  };

  // Handle profile update to match recommendation
  const handleUpdateProfile = async () => {
    if (!user || !primaryRecommendation) {
      toast.error('Unable to update profile. User or recommendation data not available.');
      return;
    }
    
    setIsUpdatingProfile(true);
    try {
      const updateData = {};
      
      if (primaryRecommendation.fieldId) {
        // Update field for Class 12 students
        updateData.field = primaryRecommendation.fieldId;
      } else if (primaryRecommendation.stream) {
        // Update stream
        updateData.stream = primaryRecommendation.stream;
        
        // If updating stream, clear field as it might not be compatible
        const currentUserStream = user.stream || user.profile?.stream;
        if ((user.field || user.profile?.field) && primaryRecommendation.stream !== currentUserStream) {
          updateData.field = null;
        }
      }
      
      const result = await authAPI.updateProfile(updateData);
      
      // Update user in auth store
      login({ user: result.user, token: result.token });
      
      const successMessage = primaryRecommendation.fieldId 
        ? `Profile updated! Your field has been changed to ${getFieldDisplayName(primaryRecommendation.fieldId)}`
        : `Profile updated! Your stream has been changed to ${getStreamDisplayName(primaryRecommendation.stream)}`;
      
      toast.success(successMessage);
      
    } catch (error) {
      console.error('Profile update error:', error);
      const errorMessage = error.message || 'Failed to update profile. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const getStreamDisplayName = (stream) => {
    const streamMap = {
      'science_pcm': 'Science (PCM)',
      'science_pcb': 'Science (PCB)',
      'commerce': 'Commerce',
      'arts': 'Arts'
    };
    return streamMap[stream] || stream;
  };

  const getFieldDisplayName = (fieldId) => {
    const fieldMap = {
      // PCM fields
      'engineering_technology': 'Engineering & Technology',
      'architecture_design': 'Architecture & Design',
      'defence_military': 'Defence & Military',
      'computer_it': 'Computer Science & IT',
      'pure_sciences_research': 'Pure Sciences & Research',
      // PCB fields
      'medicine': 'Medical Sciences',
      'allied_health': 'Allied Health & Nursing',
      'biotechnology': 'Biotechnology & Research',
      'veterinary_science': 'Veterinary Sciences',
      'agriculture_environment': 'Agriculture & Environmental Sciences'
    };
    return fieldMap[fieldId] || fieldId;
  };

  const getStreamColor = (stream) => {
    const colorMap = {
      'science_pcm': 'bg-blue-100 text-blue-800 border-blue-200',
      'science_pcb': 'bg-green-100 text-green-800 border-green-200',
      'commerce': 'bg-purple-100 text-purple-800 border-purple-200',
      'arts': 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colorMap[stream] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getFieldColor = (fieldId) => {
    const colorMap = {
      // PCM fields
      'engineering_technology': 'bg-blue-100 text-blue-800 border-blue-200',
      'architecture_design': 'bg-purple-100 text-purple-800 border-purple-200',
      'defence_military': 'bg-red-100 text-red-800 border-red-200',
      'computer_it': 'bg-green-100 text-green-800 border-green-200',
      'pure_sciences_research': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      // PCB fields
      'medicine': 'bg-red-100 text-red-800 border-red-200',
      'allied_health': 'bg-pink-100 text-pink-800 border-pink-200',
      'biotechnology': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'veterinary_science': 'bg-amber-100 text-amber-800 border-amber-200',
      'agriculture_environment': 'bg-lime-100 text-lime-800 border-lime-200'
    };
    return colorMap[fieldId] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const handleTakeNewQuiz = () => {
    resetQuiz();
    navigate('/quiz/start');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleDownloadResults = () => {
    // Determine if this is a stream or field recommendation
    const isFieldRecommendation = primaryRecommendation.fieldId;
    const recommendationType = isFieldRecommendation ? 'Field' : 'Stream';
    const recommendationValue = isFieldRecommendation 
      ? getFieldDisplayName(primaryRecommendation.fieldId)
      : getStreamDisplayName(primaryRecommendation.stream);

    const resultsText = `
Quiz Results - ${new Date(submittedAt).toLocaleDateString()}

Recommended ${recommendationType}: ${recommendationValue}

Explanation:
${primaryRecommendation.explanation}

Key Strengths:
${primaryRecommendation.keyStrengths?.map(strength => `• ${strength}`).join('\n')}

Study Tips:
${primaryRecommendation.studyTips}
    `;
    
    const blob = new Blob([resultsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz-results-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-900">Your Quiz Results</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Based on your responses, our AI has analyzed your interests and preferences 
            to provide personalized recommendations for your educational journey.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <Alert className="mb-6">
            <AlertDescription>{error}</AlertDescription>
            <Button 
              onClick={clearError} 
              variant="outline" 
              size="sm" 
              className="mt-2"
            >
              Dismiss
            </Button>
          </Alert>
        )}

        {/* Quiz Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Quiz Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">{totalQuestions}</p>
                <p className="text-sm text-gray-600">Questions Answered</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">AI Powered</p>
                <p className="text-sm text-gray-600">Analysis Method</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {new Date(submittedAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">Completion Date</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Primary Recommendation */}
        {primaryRecommendation && (
          <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                {primaryRecommendation.fieldId ? 'Recommended Field' : 'Recommended Stream'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Stream/Field Badge */}
                <div className="text-center">
                  <Badge 
                    className={`text-lg px-4 py-2 ${
                      primaryRecommendation.fieldId 
                        ? getFieldColor(primaryRecommendation.fieldId)
                        : getStreamColor(primaryRecommendation.stream)
                    }`}
                  >
                    {primaryRecommendation.fieldId 
                      ? (primaryRecommendation.fieldName || getFieldDisplayName(primaryRecommendation.fieldId))
                      : (primaryRecommendation.streamName || getStreamDisplayName(primaryRecommendation.stream))
                    }
                  </Badge>
                </div>

                {/* Explanation */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-600" />
                    Why This {primaryRecommendation.fieldId ? 'Field' : 'Stream'}?
                  </h3>
                  <p className="text-gray-700 leading-relaxed bg-white p-4 rounded-lg border">
                    {primaryRecommendation.explanation}
                  </p>
                </div>

                {/* Key Strengths */}
                {primaryRecommendation.keyStrengths && primaryRecommendation.keyStrengths.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-600" />
                      Your Key Strengths
                    </h3>
                    <div className="bg-white p-4 rounded-lg border">
                      <ul className="space-y-2">
                        {primaryRecommendation.keyStrengths.map((strength, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                            <span className="text-gray-700">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Study Tips */}
                {primaryRecommendation.studyTips && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-amber-600" />
                      Study Tips
                    </h3>
                    <div className="bg-white p-4 rounded-lg border">
                      <p className="text-gray-700 leading-relaxed">
                        {primaryRecommendation.studyTips}
                      </p>
                    </div>
                  </div>
                )}

                {/* AI Generated Badge */}
                {primaryRecommendation.aiGenerated && (
                  <div className="text-center">
                    <Badge variant="outline" className="text-xs text-blue-600 border-blue-300">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Generated Recommendation
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profile Update Recommendation */}
        {isAuthenticated && user && primaryRecommendation && isRecommendationDifferent() && (
          <Card className="mb-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-green-600" />
                Update Your Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border">
                  <p className="text-gray-700 mb-3">
                    Based on your quiz results, we recommend updating your profile to better match your interests and goals. 
                    This will help us provide more accurate course and career recommendations.
                  </p>
                  
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">Current:</span>
                          <div className="mt-1">
                            {primaryRecommendation.fieldId ? (
                              <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                                {(user.field || user.profile?.field) ? getFieldDisplayName(user.field || user.profile?.field) : 'No field selected'}
                              </Badge>
                            ) : (
                              <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                                {(user.stream || user.profile?.stream) ? getStreamDisplayName(user.stream || user.profile?.stream) : 'No stream selected'}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <span className="font-medium text-gray-600">Recommended:</span>
                          <div className="mt-1">
                            <Badge className={`${
                              primaryRecommendation.fieldId 
                                ? getFieldColor(primaryRecommendation.fieldId)
                                : getStreamColor(primaryRecommendation.stream)
                            }`}>
                              {primaryRecommendation.fieldId 
                                ? (primaryRecommendation.fieldName || getFieldDisplayName(primaryRecommendation.fieldId))
                                : (primaryRecommendation.streamName || getStreamDisplayName(primaryRecommendation.stream))
                              }
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleUpdateProfile}
                      disabled={isUpdatingProfile}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    >
                      {isUpdatingProfile ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          Update Profile
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-xs text-gray-500 flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
                    <p>
                      Updating your profile will help us provide more accurate course and career recommendations 
                      tailored to your interests and goals.
                    </p>
                  </div>
                  {primaryRecommendation.stream && (user.field || user.profile?.field) && (
                    <div className="text-xs text-amber-600 flex items-start gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-1 flex-shrink-0"></div>
                      <p>
                        Note: Changing your stream will also clear your current field selection as it may no longer be compatible.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Course Recommendations */}
        {courses && courses.courses && courses.courses.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-600" />
                {primaryRecommendation?.fieldId ? 
                  `Courses in ${primaryRecommendation.fieldName || getFieldDisplayName(primaryRecommendation.fieldId)}` : 
                  `Course Options for ${primaryRecommendation?.streamName || getStreamDisplayName(primaryRecommendation?.stream)}`
                }
              </CardTitle>
              <p className="text-sm text-gray-600">
                Based on your {primaryRecommendation?.fieldId ? 'recommended field' : 'recommended stream'}, here are relevant courses you can pursue:
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {courses.courses.map((course, index) => (
                  <div key={course.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="space-y-3">
                      {/* Course Header */}
                      <div>
                        <h4 className="font-semibold text-gray-900">{course.name}</h4>
                        <p className="text-sm text-gray-600">({course.shortName})</p>
                      </div>
                      
                      {/* Course Details */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {course.level}
                          </Badge>
                          <span className="text-gray-600">
                            {course.duration.years} year{course.duration.years > 1 ? 's' : ''}
                            {course.duration.months > 0 && ` ${course.duration.months} months`}
                          </span>
                        </div>
                        
                        {course.description && (
                          <p className="text-gray-700 text-xs line-clamp-3">
                            {course.description}
                          </p>
                        )}
                        
                        {/* Career Options Preview */}
                        {course.careerOptions && course.careerOptions.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-gray-800 mb-1">Career Options:</p>
                            <div className="flex flex-wrap gap-1">
                              {course.careerOptions.slice(0, 3).map((career, careerIndex) => (
                                <Badge key={careerIndex} variant="secondary" className="text-xs">
                                  {typeof career === 'string' ? career : career.jobTitle}
                                </Badge>
                              ))}
                              {course.careerOptions.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{course.careerOptions.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Course Summary */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>{courses.totalCourses}</strong> course{courses.totalCourses > 1 ? 's' : ''} available in your {primaryRecommendation?.fieldId ? 'recommended field' : 'recommended stream'}. 
                  These programs can help you build the skills needed for your career goals.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button onClick={handleDownloadResults} variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download Results
          </Button>
          
          <Button onClick={handleTakeNewQuiz} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Take New Quiz
          </Button>
          
          <Button onClick={handleGoHome} className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Go Home
          </Button>
        </div>

        {/* Next Steps */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
              {primaryRecommendation.fieldId ? (
                // Next steps for Class 12 PCM field recommendations
                <>
                  <p>• Research specific career paths in {primaryRecommendation.fieldName || getFieldDisplayName(primaryRecommendation.fieldId)}</p>
                  <p>• Explore entrance exams and admission requirements for your field</p>
                  <p>• Connect with professionals and mentors in your chosen domain</p>
                  <p>• Build relevant technical skills and create portfolio projects</p>
                  <p>• Consider internships or competitions in your field of interest</p>
                </>
              ) : (
                // Next steps for Class 10 stream recommendations  
                <>
                  <p>• Explore detailed career paths in your recommended stream</p>
                  <p>• Connect with mentors and professionals in your field of interest</p>
                  <p>• Research colleges and courses that align with your goals</p>
                  <p>• Take specialized assessments for deeper career insights</p>
                  <p>• Start building relevant skills and portfolio projects</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizResults;