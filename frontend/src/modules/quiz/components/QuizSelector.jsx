import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Brain, Zap, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { quizAPI } from '../api/quizAPI';

const QuizSelector = ({ onSelectQuiz }) => {
  const [questionCounts, setQuestionCounts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch question counts on component mount
  useEffect(() => {
    const fetchQuestionCounts = async () => {
      try {
        const response = await quizAPI.getQuestionCounts();
        if (response.success) {
          setQuestionCounts(response.data);
        } else {
          toast.error('Failed to load question information');
        }
      } catch (error) {
        console.error('Error fetching question counts:', error);
        toast.error('Failed to load question information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestionCounts();
  }, []);

  // Generate quiz types based on available questions
  const getQuizTypes = () => {
    if (!questionCounts) return [];

    const { quizTypes } = questionCounts;

    return [
      {
        id: 'jee',
        title: 'JEE Main Quiz',
        description: 'Physics, Chemistry, Mathematics',
        subjects: quizTypes.jee.subjects,
        icon: <Zap className="h-6 w-6" />,
        color: 'bg-blue-500',
        textColor: 'text-blue-600',
        borderColor: 'border-blue-200',
        questions: 25, // Fixed 25 questions
        availableQuestions: quizTypes.jee.availableQuestions,
        timeLimit: 60, // Fixed 60 minutes (1 hour)
        stream: 'PCM',
        disabled: quizTypes.jee.availableQuestions < 25 // Disabled if less than 25 questions available
      },
      {
        id: 'neet',
        title: 'NEET Quiz',
        description: 'Physics, Chemistry, Biology',
        subjects: quizTypes.neet.subjects,
        icon: <Brain className="h-6 w-6" />,
        color: 'bg-green-500',
        textColor: 'text-green-600',
        borderColor: 'border-green-200',
        questions: 25, // Fixed 25 questions
        availableQuestions: quizTypes.neet.availableQuestions,
        timeLimit: 60, // Fixed 60 minutes (1 hour)
        stream: 'PCB',
        disabled: quizTypes.neet.availableQuestions < 25 // Disabled if less than 25 questions available
      }
    ];
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

  const quizTypes = getQuizTypes();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Quiz</h1>
        <p className="text-gray-600">Select the type of quiz you want to take</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {quizTypes.map((quiz) => (
          <Card 
            key={quiz.id} 
            className={`
              cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 
              ${quiz.borderColor} border-2
              ${quiz.disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            onClick={() => !quiz.disabled && onSelectQuiz(quiz)}
          >
            <CardHeader className="text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${quiz.color} text-white mb-4 mx-auto`}>
                {quiz.icon}
              </div>
              <CardTitle className={quiz.textColor}>{quiz.title}</CardTitle>
              <CardDescription>{quiz.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Subjects */}
              {quiz.subjects.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Subjects:</p>
                  <div className="flex flex-wrap gap-2">
                    {quiz.subjects.map((subject) => (
                      <Badge key={subject} variant="secondary" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Question Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Available Questions:</span>
                  <span className="font-medium">{quiz.availableQuestions}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Recommended:</span>
                  <span className="font-medium">{quiz.questions} Questions</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Time Limit:</span>
                  <span className="font-medium">
                    {quiz.timeLimit >= 60 
                      ? `${Math.floor(quiz.timeLimit / 60)}h ${quiz.timeLimit % 60}m`
                      : `${quiz.timeLimit}m`
                    }
                  </span>
                </div>
              </div>
              
              {/* Warning for insufficient question count */}
              {quiz.availableQuestions < 25 && quiz.availableQuestions > 0 && (
                <div className="flex items-center gap-2 p-2 bg-orange-50 rounded border border-orange-200">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <span className="text-xs text-orange-700">
                    Need at least 25 questions (Available: {quiz.availableQuestions})
                  </span>
                </div>
              )}
              
              <Button 
                className={`w-full ${quiz.color} hover:opacity-90`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!quiz.disabled) {
                    onSelectQuiz(quiz);
                  }
                }}
                disabled={quiz.disabled}
              >
                {quiz.disabled ? 'Insufficient Questions (Need 25)' : `Start ${quiz.title}`}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Additional Info */}
      <div className="mt-12 text-center">
        <div className="bg-gray-50 rounded-lg p-6 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Quiz Format</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Each quiz contains exactly 25 random questions</li>
            <li>• 1-hour time limit (60 minutes) for each quiz</li>
            <li>• Questions are selected randomly from all available topics</li>
            <li>• You can review and change answers before submitting</li>
            <li>• Timer will automatically submit when time runs out</li>
            <li>• Detailed explanations provided after submission</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QuizSelector;