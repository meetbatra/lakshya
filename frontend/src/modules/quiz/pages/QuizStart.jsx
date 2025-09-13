import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../user/store/userStore';
import { useQuizStore } from '../store/quizStore';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Clock, Users, BookOpen, Target } from 'lucide-react';

const QuizStart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    fetchClass10Quiz, 
    startQuiz, 
    resetQuiz, 
    currentQuiz, 
    isLoading, 
    error,
    clearError 
  } = useQuizStore();
  
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // Reset quiz state when component mounts
    resetQuiz();
    
    // Fetch quiz based on user's class
    if (user?.class === '10') {
      fetchClass10Quiz();
    }
  }, [user?.class, fetchClass10Quiz, resetQuiz]);

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
    } else if (user?.class === '12') {
      return 'Career Guidance Quiz';
    }
    return 'Career Guidance Quiz';
  };

  const getQuizDescription = () => {
    if (user?.class === '10') {
      return 'This quiz will help you choose the right stream (Science, Commerce, or Arts) for Class 11 based on your interests, aptitude, and career goals.';
    } else if (user?.class === '12') {
      return 'This quiz will provide personalized career recommendations based on your current stream and interests.';
    }
    return 'This quiz will help guide your educational and career decisions.';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your personalized quiz...</p>
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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No Quiz Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              No quiz is available for your class at the moment.
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
    <div className="h-[90vh] bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getQuizTitle()}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {getQuizDescription()}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Quiz Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Quiz Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">Estimated Time</p>
                  <p className="text-sm text-gray-600">{currentQuiz.estimatedTime || '10-15 minutes'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">Total Questions</p>
                  <p className="text-sm text-gray-600">{currentQuiz.totalQuestions} questions</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">Quiz Type</p>
                  <p className="text-sm text-gray-600">Preference-based assessment</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600 mt-0.5">1.</span>
                  Answer each question honestly based on your genuine interests and preferences.
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600 mt-0.5">2.</span>
                  There are no right or wrong answers - this is about discovering what suits you best.
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600 mt-0.5">3.</span>
                  You can navigate between questions and change your answers before submitting.
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600 mt-0.5">4.</span>
                  Our AI will analyze your responses to provide personalized recommendations.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Start Quiz Button */}
        <div className="text-center">
          <Button 
            onClick={handleStartQuiz}
            size="lg"
            className="px-8 py-3 text-lg"
            disabled={hasStarted}
          >
            {hasStarted ? 'Starting Quiz...' : 'Start Quiz'}
          </Button>
          <p className="text-sm text-gray-500 mt-2">
            Take your time and answer thoughtfully for the best recommendations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizStart;