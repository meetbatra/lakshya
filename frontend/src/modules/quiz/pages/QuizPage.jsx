import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import QuizSelector from '../components/QuizSelector';
import QuizComponent from '../components/QuizComponent';
import QuizResults from '../components/QuizResults';
import { quizAPI } from '../api/quizAPI';

const QuizPage = () => {
  const [currentView, setCurrentView] = useState('selector'); // 'selector', 'quiz', 'results'
  const [selectedQuizType, setSelectedQuizType] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [quizResults, setQuizResults] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState(null);

  // Handle quiz type selection
  const handleSelectQuiz = async (quizType) => {
    setSelectedQuizType(quizType);
    setIsLoading(true);
    
    try {
      // Get custom quiz for JEE or NEET
      const config = {
        subjects: quizType.subjects,
        questionCount: quizType.questions,
        difficulty: null, // Mixed difficulty
        timeLimit: quizType.timeLimit * 60 // Convert minutes to seconds
      };
      const response = await quizAPI.getCustomQuiz(config);
      
      if (response.success) {
        setQuizData(response.data);
        setQuizStartTime(new Date().toISOString());
        setCurrentView('quiz');
      } else {
        toast.error(response.message || 'Failed to load quiz');
      }
    } catch (error) {
      console.error('Error loading quiz:', error);
      toast.error(error.message || 'Failed to load quiz. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle quiz submission
  const handleQuizSubmit = async (submissionData) => {
    setIsLoading(true);
    setUserAnswers(submissionData.answers);
    
    try {
      // Format answers for backend API
      const formattedAnswers = submissionData.answers.map(answer => ({
        questionId: answer.questionId,
        selectedOptionId: answer.selectedOptionId,
        timeTaken: 0 // Individual question time not tracked yet
      }));

      const quizSubmissionData = {
        quizId: `custom_${Date.now()}`,
        examId: quizData.exam._id, // Use the exam ID from quiz data
        answers: formattedAnswers,
        startTime: quizStartTime,
        endTime: new Date().toISOString()
      };

      const response = await quizAPI.submitCustomQuiz(quizSubmissionData);
      
      if (response.success) {
        // Extract and format the results properly
        const formattedResults = {
          totalQuestions: response.data.results.totalQuestions,
          correctAnswers: response.data.results.correctAnswers,
          score: `${response.data.results.correctAnswers}/${response.data.results.totalQuestions}`,
          percentage: response.data.results.percentage,
          timeTaken: response.data.results.totalTimeTaken,
          message: response.data.message,
          subjectPerformance: response.data.results.subjectPerformance,
          questionResults: response.data.results.questionResults || [],
          streak: response.data.streak,
          rank: null // Custom quizzes don't have ranking
        };
        
        setQuizResults(formattedResults);
        setCurrentView('results');
        toast.success('Quiz submitted successfully!');
      } else {
        toast.error(response.message || 'Failed to submit quiz');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error(error.message || 'Failed to submit quiz. Please try again.');
      setIsLoading(false);
    }
  };

  // Handle retake quiz
  const handleRetakeQuiz = () => {
    setQuizData(null);
    setQuizResults(null);
    setUserAnswers([]);
    handleSelectQuiz(selectedQuizType);
  };

  // Handle go to home
  const handleGoHome = () => {
    setCurrentView('selector');
    setSelectedQuizType(null);
    setQuizData(null);
    setQuizResults(null);
    setUserAnswers([]);
  };

  // Handle back to selector
  const handleBackToSelector = () => {
    setCurrentView('selector');
    setSelectedQuizType(null);
    setQuizData(null);
  };

  // Render current view
  const renderCurrentView = () => {
    switch (currentView) {
      case 'selector':
        return <QuizSelector onSelectQuiz={handleSelectQuiz} />;
      
      case 'quiz':
        return (
          <QuizComponent
            questions={quizData?.questions || []}
            timeLimit={selectedQuizType?.timeLimit || 10}
            quizConfig={{
              title: selectedQuizType?.title,
              description: selectedQuizType?.description
            }}
            onSubmit={handleQuizSubmit}
            onBack={handleBackToSelector}
            isLoading={isLoading}
          />
        );
      
      case 'results':
        return (
          <QuizResults
            results={quizResults}
            questions={quizData?.questions || []}
            userAnswers={userAnswers}
            onRetakeQuiz={handleRetakeQuiz}
            onGoHome={handleGoHome}
            quizConfig={{
              title: selectedQuizType?.title,
              description: selectedQuizType?.description
            }}
          />
        );
      
      default:
        return <QuizSelector onSelectQuiz={handleSelectQuiz} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderCurrentView()}
    </div>
  );
};

export default QuizPage;