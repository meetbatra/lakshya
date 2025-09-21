import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../user/store/userStore';
import { useQuizStore } from '../store/quizStore';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Badge } from '../../../components/ui/badge';
import { CheckCircle, AlertCircle, ArrowLeft, Send } from 'lucide-react';

const QuizReview = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    currentQuiz,
    answers,
    isLoading,
    error,
    getAnsweredCount,
    canSubmitQuiz,
    submitQuiz,
    goToQuestion,
    clearError
  } = useQuizStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const answeredCount = getAnsweredCount();
  const totalQuestions = currentQuiz?.totalQuestions || 0;
  const isComplete = canSubmitQuiz();

  const handleSubmitQuiz = async () => {
    try {
      await submitQuiz(user?.id);
      navigate('/quiz/results');
    } catch (error) {
      console.error('Quiz submission failed:', error);
      // Error is handled by the store and displayed in UI
    }
  };

  const handleGoToQuestion = (questionIndex) => {
    goToQuestion(questionIndex);
    navigate('/quiz/question');
  };

  const handleBackToQuiz = () => {
    navigate('/quiz/question');
  };

  if (!currentQuiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No quiz data found.</p>
          <Button onClick={() => navigate('/quiz/start')}>
            Start New Quiz
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">
            <Button
              onClick={handleBackToQuiz}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 w-fit"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Quiz</span>
              <span className="sm:hidden">Back</span>
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Review Your Answers</h1>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <Badge variant={isComplete ? "default" : "secondary"} className="text-xs sm:text-sm w-fit">
              {answeredCount}/{totalQuestions} Questions Answered
            </Badge>
            {isComplete && (
              <Badge variant="default" className="bg-green-600 text-xs sm:text-sm w-fit">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Ready to Submit
              </Badge>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
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

        {/* Incomplete Warning */}
        {!isComplete && (
          <Alert className="mb-4 sm:mb-6">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <AlertDescription className="text-sm">
              Please answer all questions before submitting your quiz. 
              You have <span className="font-medium">{totalQuestions - answeredCount}</span> questions remaining.
            </AlertDescription>
          </Alert>
        )}

        {/* Questions Review */}
        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          {currentQuiz.questions?.map((question, index) => {
            const userAnswer = answers[index];
            const isAnswered = Boolean(userAnswer);

            return (
              <Card key={index} className={`${!isAnswered ? 'border-orange-200 bg-orange-50' : 'border-green-200 bg-green-50'}`}>
                <CardHeader className="pb-3 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <CardTitle className="text-base sm:text-lg leading-relaxed">
                      <span className="text-blue-600 font-bold mr-2">Q{index + 1}.</span>
                      {question.question}
                    </CardTitle>
                    <div className="flex items-center gap-2 sm:ml-4">
                      {isAnswered ? (
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  {isAnswered ? (
                    <div className="space-y-2">
                      <p className="text-xs sm:text-sm text-gray-600">Your Answer:</p>
                      <div className="p-3 bg-white border border-green-300 rounded-lg">
                        <p className="font-medium text-green-800 text-sm sm:text-base">{userAnswer}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-orange-600 font-medium text-sm sm:text-base">Not answered yet</p>
                      <Button
                        onClick={() => handleGoToQuestion(index)}
                        variant="outline"
                        size="sm"
                        className="text-orange-600 border-orange-300 hover:bg-orange-50 text-xs sm:text-sm"
                      >
                        Answer This Question
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Submit Section */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Send className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              Ready to Submit?
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="space-y-4">
              <p className="text-gray-700 text-sm sm:text-base">
                Once you submit your quiz, our AI will analyze your answers and provide 
                personalized stream recommendations based on your interests and preferences.
              </p>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <Button
                  onClick={handleSubmitQuiz}
                  disabled={!isComplete || isLoading}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-sm sm:text-base"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      <span className="hidden sm:inline">Processing...</span>
                      <span className="sm:hidden">Processing...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Submit Quiz & Get Recommendations</span>
                      <span className="sm:hidden">Submit Quiz</span>
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={handleBackToQuiz}
                  variant="outline"
                  disabled={isLoading}
                  className="text-sm sm:text-base"
                >
                  Continue Editing
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizReview;