import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Target, 
  Clock, 
  CheckCircle, 
  XCircle, 
  RotateCcw,
  Home,
  TrendingUp,
  Award
} from 'lucide-react';

const QuizResults = ({ 
  results, 
  questions, 
  userAnswers, 
  onRetakeQuiz, 
  onGoHome,
  quizConfig 
}) => {
  if (!results) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Processing your results...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const {
    score,
    totalQuestions = 0,
    correctAnswers = 0,
    percentage = 0,
    timeTaken = 0,
    streak,
    message = '',
    subjectPerformance = [],
    questionResults = [],
    rank,
    improvementAreas = []
  } = results;

  // Format time
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0m 0s';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Get performance level
  const getPerformanceLevel = (percentage) => {
    if (isNaN(percentage) || percentage === null || percentage === undefined) {
      return { level: 'No Data', color: 'text-gray-600', bgColor: 'bg-gray-100' };
    }
    if (percentage >= 90) return { level: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (percentage >= 75) return { level: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (percentage >= 60) return { level: 'Average', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { level: 'Needs Improvement', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const performance = getPerformanceLevel(percentage);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Trophy className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Completed!</h1>
        <p className="text-gray-600">{quizConfig?.title || 'Quiz'} Results</p>
      </div>

      {/* Main Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Score Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Your Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="text-6xl font-bold text-blue-600 mb-2">
                {isNaN(percentage) ? 0 : percentage}%
              </div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${performance.bgColor} ${performance.color}`}>
                {performance.level}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {isNaN(correctAnswers) ? 0 : correctAnswers}
                </div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {isNaN(totalQuestions - correctAnswers) ? 0 : totalQuestions - correctAnswers}
                </div>
                <div className="text-sm text-gray-600">Incorrect</div>
              </div>
            </div>

            <Progress value={isNaN(percentage) ? 0 : percentage} className="h-3 mb-4" />
            
            <div className="text-center">
              <p className="text-gray-600 italic">{message}</p>
            </div>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Time Taken</span>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{formatTime(timeTaken)}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Questions</span>
              <span className="font-medium">{totalQuestions}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Accuracy</span>
              <span className="font-medium">{percentage}%</span>
            </div>
            
            {streak && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Streak</span>
                <div className="flex items-center gap-1">
                  <Award className="h-4 w-4 text-orange-500" />
                  <span className="font-medium">{streak} days</span>
                </div>
              </div>
            )}
            
            {rank && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Rank</span>
                <span className="font-medium">#{rank}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Subject Performance */}
      {subjectPerformance.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Subject-wise Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {subjectPerformance.map((subject, index) => {
                const correct = subject.correctAnswers || subject.correct || 0;
                const total = subject.totalQuestions || subject.total || 0;
                const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
                
                return (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{subject.subject}</h4>
                      <Badge variant="outline">
                        {correct}/{total}
                      </Badge>
                    </div>
                    <Progress 
                      value={percentage} 
                      className="h-2"
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      {percentage}% accuracy
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Question Review */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Question Review</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {questions.map((question, index) => {
              const userAnswer = userAnswers.find(ua => ua.questionId === question._id);
              const selectedOptionId = userAnswer?.selectedOptionId;
              const selectedOptionIndex = userAnswer?.selectedOption;
              
              // Get question result from backend
              const questionResult = questionResults?.find(qr => qr.question?.toString() === question._id?.toString());
              
              // If we have questionResults from backend, use it. Otherwise, we can't determine correctness accurately
              let isCorrect = false;
              let correctOptionId = null;
              
              if (questionResult) {
                isCorrect = questionResult.isCorrect === true;
                correctOptionId = questionResult.correctOption;
              }
              
              return (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`
                      mt-1 p-1 rounded-full
                      ${isCorrect ? 'bg-green-100' : 'bg-red-100'}
                    `}>
                      {isCorrect ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-500">
                          Question {index + 1}
                        </span>
                        <Badge variant="outline" size="sm">{question.subject}</Badge>
                        <Badge variant={isCorrect ? "default" : "destructive"} size="sm">
                          {isCorrect ? "Correct" : "Incorrect"}
                        </Badge>
                      </div>
                      <h4 className="font-medium mb-3">{question.question}</h4>
                      
                      <div className="space-y-2">
                        {question.options.map((option, optIndex) => {
                          // Check if this option was selected by the user
                          const isThisOptionSelected = (
                            selectedOptionId && option._id === selectedOptionId
                          ) || (
                            selectedOptionIndex !== undefined && optIndex === selectedOptionIndex
                          );
                          
                          // Check if this is the correct option
                          const isThisOptionCorrect = correctOptionId && option._id === correctOptionId;
                          
                          let optionStyle = 'bg-gray-50 border-gray-200 text-gray-700';
                          let iconComponent = null;
                          
                          if (isThisOptionCorrect) {
                            // This is the correct answer - always show in green
                            optionStyle = 'bg-green-50 border-green-300 text-green-800 font-medium';
                            iconComponent = <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />;
                          } else if (isThisOptionSelected) {
                            // This was selected but is wrong - show in red
                            optionStyle = 'bg-red-50 border-red-300 text-red-800 font-medium';
                            iconComponent = <XCircle className="h-4 w-4 text-red-600 ml-auto" />;
                          }
                          
                          return (
                            <div
                              key={optIndex}
                              className={`p-3 rounded-lg border text-sm transition-colors ${optionStyle}`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-base">
                                  {String.fromCharCode(65 + optIndex)}.
                                </span>
                                <span className="flex-1">{option.text}</span>
                                {iconComponent}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {question.explanation && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm text-blue-800">
                            <strong>Explanation:</strong> {question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Improvement Areas */}
      {improvementAreas.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Areas for Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {improvementAreas.map((area, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>{area}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          variant="outline"
          onClick={onGoHome}
          className="flex items-center gap-2"
        >
          <Home className="h-4 w-4" />
          Go to Dashboard
        </Button>
        <Button
          onClick={onRetakeQuiz}
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Retake Quiz
        </Button>
      </div>
    </div>
  );
};

export default QuizResults;