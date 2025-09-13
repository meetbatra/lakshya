import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '../store/quizStore';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Progress } from '../../../components/ui/progress';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

const QuizQuestion = () => {
  const navigate = useNavigate();
  const {
    currentQuiz,
    currentQuestionIndex,
    answers,
    isQuizStarted,
    error,
    getCurrentQuestion,
    getCurrentAnswer,
    isCurrentQuestionAnswered,
    getProgress,
    getAnsweredCount,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    canSubmitQuiz,
    clearError
  } = useQuizStore();

  // Redirect if quiz not started
  useEffect(() => {
    if (!isQuizStarted || !currentQuiz) {
      navigate('/quiz/start');
    }
  }, [isQuizStarted, currentQuiz, navigate]);

  const currentQuestion = getCurrentQuestion();
  const currentAnswer = getCurrentAnswer();
  const progress = getProgress();
  const answeredCount = getAnsweredCount();
  const isLastQuestion = currentQuestionIndex === (currentQuiz?.totalQuestions - 1);
  const isFirstQuestion = currentQuestionIndex === 0;

  const handleAnswerSelect = (answer) => {
    answerQuestion(answer);
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      nextQuestion();
    } else if (canSubmitQuiz()) {
      // Navigate to review page or submit
      navigate('/quiz/review');
    }
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      previousQuestion();
    }
  };

  const handleFinishQuiz = () => {
    navigate('/quiz/review');
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading question...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Stream Selection Quiz
            </h1>
            <div className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {currentQuiz.totalQuestions}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress: {progress}%</span>
              <span>Answered: {answeredCount}/{currentQuiz.totalQuestions}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
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

        {/* Question Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentQuestion.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  className={`w-full p-4 text-left border rounded-lg transition-all duration-200 hover:border-blue-400 hover:bg-blue-50 ${
                    currentAnswer === option
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      currentAnswer === option
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {currentAnswer === option && (
                        <CheckCircle className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <Button
            onClick={handlePrevious}
            variant="outline"
            disabled={isFirstQuestion}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex gap-3">
            {!isLastQuestion && (
              <Button
                onClick={handleNext}
                disabled={!isCurrentQuestionAnswered()}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}

            {isLastQuestion && (
              <Button
                onClick={handleFinishQuiz}
                disabled={!isCurrentQuestionAnswered()}
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              >
                Finish Quiz
                <CheckCircle className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Question Navigation */}
        <div className="mt-8 p-4 bg-white rounded-lg border">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Question Navigation</h3>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
            {Array.from({ length: currentQuiz.totalQuestions }, (_, index) => (
              <button
                key={index}
                onClick={() => goToQuestion(index)}
                className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                  index === currentQuestionIndex
                    ? 'bg-blue-600 text-white'
                    : answers[index]
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-gray-100 text-gray-500 border border-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizQuestion;