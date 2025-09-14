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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              onClick={handleBackToQuiz}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Quiz
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Review Your Answers</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant={isComplete ? "default" : "secondary"} className="text-sm">
              {answeredCount}/{totalQuestions} Questions Answered
            </Badge>
            {isComplete && (
              <Badge variant="default" className="bg-green-600 text-sm">
                <CheckCircle className="w-4 h-4 mr-1" />
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
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please answer all questions before submitting your quiz. 
              You have {totalQuestions - answeredCount} questions remaining.
            </AlertDescription>
          </Alert>
        )}

        {/* Questions Review */}
        <div className="space-y-4 mb-8">
          {currentQuiz.questions?.map((question, index) => {
            const userAnswer = answers[index];
            const isAnswered = Boolean(userAnswer);

            return (
              <Card key={index} className={`${!isAnswered ? 'border-orange-200 bg-orange-50' : 'border-green-200 bg-green-50'}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg leading-relaxed">
                      <span className="text-blue-600 font-bold mr-2">Q{index + 1}.</span>
                      {question.question}
                    </CardTitle>
                    <div className="flex items-center gap-2 ml-4">
                      {isAnswered ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-orange-500" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isAnswered ? (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Your Answer:</p>
                      <div className="p-3 bg-white border border-green-300 rounded-lg">
                        <p className="font-medium text-green-800">{userAnswer}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-orange-600 font-medium">Not answered yet</p>
                      <Button
                        onClick={() => handleGoToQuestion(index)}
                        variant="outline"
                        size="sm"
                        className="text-orange-600 border-orange-300 hover:bg-orange-50"
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
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5 text-blue-600" />
              Ready to Submit?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">
                Once you submit your quiz, our AI will analyze your answers and provide 
                personalized stream recommendations based on your interests and preferences.
              </p>
              
              <div className="flex items-center gap-4">
                <Button
                  onClick={handleSubmitQuiz}
                  disabled={!isComplete || isLoading}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Quiz & Get Recommendations
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={handleBackToQuiz}
                  variant="outline"
                  disabled={isLoading}
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