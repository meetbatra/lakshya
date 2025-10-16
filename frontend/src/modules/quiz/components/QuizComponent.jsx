import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  AlertCircle,
  RotateCcw,
  Send
} from 'lucide-react';
import { toast } from 'sonner';

const QuizComponent = ({ 
  questions, 
  timeLimit, 
  quizConfig, 
  onSubmit, 
  onBack,
  isLoading = false 
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60); // Convert minutes to seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Timer effect
  useEffect(() => {
    if (timeRemaining <= 0) {
      handleAutoSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  // Format time display
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Handle answer selection
  const handleAnswerSelect = (optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: optionIndex
    }));
  };

  // Navigate to specific question
  const goToQuestion = (index) => {
    setCurrentQuestion(index);
  };

  // Navigate next/previous
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  // Auto submit when time runs out
  const handleAutoSubmit = useCallback(async () => {
    if (isSubmitting) return;
    
    toast.warning('Time\'s up! Submitting your quiz automatically.');
    await handleSubmit(true);
  }, [isSubmitting]);

  // Submit quiz
  const handleSubmit = async (isAutoSubmit = false) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Format answers for submission
      const formattedAnswers = questions.map((question, index) => {
        const selectedIndex = answers[index];
        const selectedOption = selectedIndex !== undefined && question.options[selectedIndex] 
          ? question.options[selectedIndex] 
          : null;
        
        return {
          questionId: question._id,
          selectedOptionId: selectedOption ? selectedOption._id : null,
          selectedOption: selectedIndex || null,
          isAnswered: selectedIndex !== undefined
        };
      });

      const timeTaken = (timeLimit * 60) - timeRemaining;
      
      await onSubmit({
        answers: formattedAnswers,
        timeTaken,
        totalQuestions: questions.length,
        answeredQuestions: Object.keys(answers).length,
        isAutoSubmit
      });
    } catch (error) {
      toast.error('Failed to submit quiz. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Calculate progress
  const answeredCount = Object.keys(answers).length;
  const progressPercentage = (answeredCount / questions.length) * 100;

  // Get time warning class
  const getTimeWarningClass = () => {
    const percentage = (timeRemaining / (timeLimit * 60)) * 100;
    if (percentage <= 10) return 'text-red-600';
    if (percentage <= 25) return 'text-orange-600';
    return 'text-green-600';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Questions Available</h3>
            <p className="text-gray-600 mb-4">No questions found for this quiz configuration.</p>
            <Button onClick={onBack}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="container mx-auto px-4 py-4">
      {/* Header with timer and progress */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={onBack}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-bold">{quizConfig?.title || 'Quiz'}</h1>
              <p className="text-sm text-gray-600">{quizConfig?.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 font-mono text-lg ${getTimeWarningClass()}`}>
              <Clock className="h-5 w-5" />
              {formatTime(timeRemaining)}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{answeredCount}/{questions.length} answered</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Question Navigation Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 lg:grid-cols-3 gap-2">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToQuestion(index)}
                    className={`
                      w-10 h-10 rounded text-sm font-medium transition-colors
                      ${currentQuestion === index 
                        ? 'bg-blue-600 text-white' 
                        : answers[index] !== undefined
                        ? 'bg-green-100 text-green-800 border border-green-300'
                        : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
                      }
                    `}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-600 rounded"></div>
                  <span>Current</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
                  <span>Not Answered</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Question Area */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <Badge variant="secondary" className="mb-2">
                    Question {currentQuestion + 1} of {questions.length}
                  </Badge>
                  <div className="flex gap-2 mb-2">
                    <Badge variant="outline">{currentQ.subject}</Badge>
                    <Badge variant="outline">{currentQ.difficulty}</Badge>
                    {currentQ.topic && (
                      <Badge variant="outline" className="text-xs">{currentQ.topic}</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {/* Question */}
              <div className="mb-6">
                <h2 className="text-lg font-medium leading-relaxed">
                  {currentQ.question}
                </h2>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`
                      w-full p-4 text-left rounded-lg border-2 transition-all
                      ${answers[currentQuestion] === index
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium
                        ${answers[currentQuestion] === index
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : 'border-gray-300 text-gray-600'
                        }
                      `}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span>{option.text}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>

                <div className="flex gap-2">
                  {answers[currentQuestion] !== undefined && (
                    <Button
                      variant="outline"
                      onClick={() => setAnswers(prev => {
                        const newAnswers = { ...prev };
                        delete newAnswers[currentQuestion];
                        return newAnswers;
                      })}
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Clear
                    </Button>
                  )}
                  
                  {currentQuestion === questions.length - 1 ? (
                    <Button
                      onClick={() => setShowConfirm(true)}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={isSubmitting}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Submit Quiz
                    </Button>
                  ) : (
                    <Button onClick={handleNext}>
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Submit Quiz?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>Are you sure you want to submit your quiz?</p>
                
                <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Questions Answered:</span>
                    <span className="font-medium">{answeredCount}/{questions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time Remaining:</span>
                    <span className="font-medium">{formatTime(timeRemaining)}</span>
                  </div>
                </div>
                
                {answeredCount < questions.length && (
                  <p className="text-orange-600 text-sm">
                    You have {questions.length - answeredCount} unanswered questions.
                  </p>
                )}
                
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirm(false)}
                    className="flex-1"
                  >
                    Continue Quiz
                  </Button>
                  <Button
                    onClick={() => handleSubmit(false)}
                    disabled={isSubmitting}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Now'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default QuizComponent;