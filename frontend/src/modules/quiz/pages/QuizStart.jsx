import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../user/store/userStore';
import { useQuizStore } from '../store/quizStore';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Clock, Users, BookOpen, Target } from 'lucide-react';

const QuizStart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    fetchClass10Quiz, 
    fetchClass12PCMQuiz,
    fetchClass12PCBQuiz,
    fetchClass12CommerceQuiz,
    fetchClass12ArtsQuiz,
    startQuiz, 
    resetQuiz, 
    currentQuiz, 
    isLoading, 
    error,
    clearError 
  } = useQuizStore();
  
  const [hasStarted, setHasStarted] = useState(false);

  // Function to convert database stream names to user-friendly display names
  const getStreamDisplayName = (stream) => {
    const streamMap = {
      'science_pcm': 'Science (PCM)',
      'science_pcb': 'Science (PCB)', 
      'commerce': 'Commerce',
      'arts': 'Arts'
    };
    return streamMap[stream] || stream;
  };

  useEffect(() => {
    // Scroll to top of page
    window.scrollTo(0, 0);
    
    // Reset quiz state when component mounts
    resetQuiz();
    
    // Fetch quiz based on user's class and stream
    if (user?.class === '10') {
      fetchClass10Quiz();
    } else if (user?.class === '12' && user?.stream === 'science_pcm') {
      fetchClass12PCMQuiz();
    } else if (user?.class === '12' && user?.stream === 'science_pcb') {
      fetchClass12PCBQuiz();
    } else if (user?.class === '12' && user?.stream === 'commerce') {
      fetchClass12CommerceQuiz();
    } else if (user?.class === '12' && user?.stream === 'arts') {
      fetchClass12ArtsQuiz();
    }
  }, [user?.class, user?.stream, fetchClass10Quiz, fetchClass12PCMQuiz, fetchClass12PCBQuiz, fetchClass12CommerceQuiz, fetchClass12ArtsQuiz, resetQuiz]);

  const handleStartQuiz = () => {
    if (!currentQuiz) return;
    
    setHasStarted(true);
    startQuiz();
    // Navigate to quiz question page
    navigate('/quiz/question');
  };

  const getQuizTitle = () => {
    if (user?.class === '10') {
      return 'Stream Selection Quiz';
    } else if (user?.class === '12' && user?.stream === 'science_pcm') {
      return 'PCM Field Recommendation Quiz';
    } else if (user?.class === '12' && user?.stream === 'science_pcb') {
      return 'PCB Field Recommendation Quiz';
    } else if (user?.class === '12' && user?.stream === 'commerce') {
      return 'Commerce Field Recommendation Quiz';
    } else if (user?.class === '12' && user?.stream === 'arts') {
      return 'Arts Field Recommendation Quiz';
    } else if (user?.class === '12') {
      return 'Career Guidance Quiz';
    }
    return 'Career Guidance Quiz';
  };

  const getQuizDescription = () => {
    if (user?.class === '10') {
      return 'This quiz will help you choose the right stream (Science, Commerce, or Arts) for Class 11 based on your interests, aptitude, and career goals.';
    } else if (user?.class === '12' && user?.stream === 'science_pcm') {
      return 'Discover your ideal field within PCM - Engineering & Technology, Computer Science & IT, Architecture & Design, Defence & Military, or Pure Sciences & Research.';
    } else if (user?.class === '12' && user?.stream === 'science_pcb') {
      return 'Discover your ideal field within PCB - Medical Sciences, Allied Health & Nursing, Biotechnology & Research, Veterinary Sciences, or Agriculture & Environmental Sciences.';
    } else if (user?.class === '12' && user?.stream === 'commerce') {
      return 'Discover your ideal field within Commerce - Business Management, Finance & Accounting, Economics & Analytics, Law & Commerce, or Entrepreneurship.';
    } else if (user?.class === '12' && user?.stream === 'arts') {
      return 'Discover your ideal field within Arts - Civil Services, Psychology & Counseling, Media & Journalism, Law & Legal Studies, Creative Arts & Design, or Social Sciences & Research.';
    } else if (user?.class === '12') {
      return 'This quiz will provide personalized career recommendations based on your current stream and interests.';
    }
    return 'This quiz will help guide your educational and career decisions.';
  };

  if (isLoading) {
    return (
      <div className="h-full bg-gray-50">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Loading State */}
          <div className="flex justify-center items-center py-20">
            <FontAwesomeIcon icon={faSpinner} className="h-6 w-6 text-blue-600 animate-spin mr-3" />
            <span className="text-base text-gray-600">Loading your personalized quiz...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Quiz Not Available</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Button 
                onClick={() => {
                  clearError();
                  if (user?.class === '10') {
                    fetchClass10Quiz();
                  } else if (user?.class === '12' && user?.stream === 'science_pcm') {
                    fetchClass12PCMQuiz();
                  } else if (user?.class === '12' && user?.stream === 'science_pcb') {
                    fetchClass12PCBQuiz();
                  } else if (user?.class === '12' && user?.stream === 'commerce') {
                    fetchClass12CommerceQuiz();
                  } else if (user?.class === '12' && user?.stream === 'arts') {
                    fetchClass12ArtsQuiz();
                  }
                }}
                className="w-full"
              >
                Try Again
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="w-full"
              >
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentQuiz) {
    // Show different messages based on user's profile
    let noQuizMessage = 'No quiz is available for your class at the moment.';
    
    if (user?.class === '12' && !['science_pcm', 'science_pcb', 'commerce', 'arts'].includes(user?.stream)) {
      noQuizMessage = `Quiz for Class 12 ${getStreamDisplayName(user.stream)} stream is coming soon. Currently available for PCM, PCB, Commerce, and Arts students.`;
    } else if (!user?.class) {
      noQuizMessage = 'Please complete your profile to access personalized quizzes.';
    }

    return (
      <div className="h-full bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No Quiz Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              {noQuizMessage}
            </p>
            <Button onClick={() => navigate('/')} className="w-full">
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent mb-4">
              {getQuizTitle()}
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              {getQuizDescription()}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Quiz Information */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                Quiz Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Estimated Time</p>
                  <p className="text-gray-600">{currentQuiz.estimatedTime || '10-15 minutes'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Total Questions</p>
                  <p className="text-gray-600">{currentQuiz.totalQuestions} questions</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Target className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Quiz Type</p>
                  <p className="text-gray-600">Preference-based assessment</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-orange-600" />
                </div>
                Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                    1
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Answer each question honestly based on your genuine interests and preferences.
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                    2
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    There are no right or wrong answers - this is about discovering what suits you best.
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                    3
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    You can navigate between questions and change your answers before submitting.
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                    4
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Our AI will analyze your responses to provide personalized recommendations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white rounded-2xl shadow-lg p-8 border-0">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Begin?</h3>
            <p className="text-gray-600">
              Take your time and answer thoughtfully for the best recommendations.
            </p>
          </div>
          
          <Button 
            onClick={handleStartQuiz}
            size="lg"
            className="px-12 py-4 text-lg font-semibold bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            disabled={hasStarted}
          >
            {hasStarted ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                Starting Quiz...
              </>
            ) : (
              <>
                <Target className="mr-2 h-5 w-5" />
                Start Quiz
              </>
            )}
          </Button>
          
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Personalized</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizStart;