const Quiz = require('../models/Quiz');
const { generateStreamRecommendation } = require('../utils/services/geminiService');

const getClass10Quiz = async () => {
  try {
    const quiz = await Quiz.findOne({
      targetClass: '10',
      purpose: 'stream-selection'
    });

    if (!quiz) {
      return {
        success: false,
        message: 'Class 10 quiz not found. Please run the initialization script.',
        data: null
      };
    }

    return {
      success: true,
      message: 'Class 10 quiz fetched successfully',
      data: {
        id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        targetClass: quiz.targetClass,
        purpose: quiz.purpose,
        totalQuestions: quiz.questions.length,
        questions: quiz.questions.map((q, index) => ({
          id: q._id,
          questionNumber: index + 1,
          question: q.question,
          options: q.options,
        }))
      }
    };
  } catch (error) {
    console.error('Error fetching Class 10 quiz:', error);
    return {
      success: false,
      message: `Failed to fetch Class 10 quiz: ${error.message}`,
      data: null
    };
  }
};

/**
 * Submit Class 10 Quiz and Calculate Stream Recommendations
 * @param {Object} submission - User's quiz submission
 * @param {string} submission.quizId - Quiz ID
 * @param {Array} submission.answers - Array of user answers
 * @param {string} submission.userId - User ID (optional)
 * @returns {Promise<Object>} Quiz results and stream recommendations
 */
const submitClass10Quiz = async (submission) => {
  try {
    const { quizId, answers, userId } = submission;

    // Validate submission
    if (!quizId || !answers || !Array.isArray(answers)) {
      return {
        success: false,
        message: 'Invalid submission format',
        data: null
      };
    }

    // Get the quiz with correct answers
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return {
        success: false,
        message: 'Quiz not found',
        data: null
      };
    }

    if (quiz.targetClass !== '10' || quiz.purpose !== 'stream-selection') {
      return {
        success: false,
        message: 'Invalid quiz type for Class 10 submission',
        data: null
      };
    }

    // Validate answers count
    if (answers.length !== quiz.questions.length) {
      return {
        success: false,
        message: `Expected ${quiz.questions.length} answers, received ${answers.length}`,
        data: null
      };
    }

    // For Class 10 stream selection quiz, we use preference-based scoring
    const isStreamSelectionQuiz = quiz.purpose === 'stream-selection';
    
    let recommendations, detailedResults;

    if (isStreamSelectionQuiz) {
      // Use Gemini AI for intelligent stream recommendation
      const geminiResult = await generateStreamRecommendation(quiz.questions, answers, { userId });
      
      if (geminiResult.success) {
        // AI-powered recommendation successful
        const aiRecommendation = geminiResult.data;
        
        // Format the recommendation for response
        recommendations = [{
          stream: aiRecommendation.stream,
          streamName: aiRecommendation.streamName,
          explanation: aiRecommendation.explanation,
          keyStrengths: aiRecommendation.keyStrengths,
          studyTips: aiRecommendation.studyTips,
          aiGenerated: true
        }];
        
        // Set a high score for AI recommendation
        streamScores = { [aiRecommendation.stream]: 90 };
        overallScore = 90;
        
      } else {
        // Return error if AI fails - no fallback
        return {
          success: false,
          message: `AI recommendation failed: ${geminiResult.message}`,
          data: null
        };
      }
      
      // For preference-based quiz, we don't have "correct" answers
      detailedResults = quiz.questions.map((question, index) => {
        const userAnswer = answers[index];
        return {
          questionNumber: index + 1,
          question: question.question,
          userAnswer,
          category: question.category || 'general'
        };
      });

      } else {
        // Traditional quiz with correct/incorrect answers (not used for Class 10)
        return {
          success: false,
          message: 'Traditional quiz scoring not implemented for this version',
          data: null
        };
      }    return {
      success: true,
      message: 'Quiz submitted successfully',
      data: {
        quizId,
        userId,
        totalQuestions: quiz.questions.length,
        recommendations,
        detailedResults,
        submittedAt: new Date()
      }
    };

  } catch (error) {
    console.error('Error submitting quiz:', error);
    return {
      success: false,
      message: `Failed to submit quiz: ${error.message}`,
      data: null
    };
  }
};

/**
 * Get all available quizzes for a specific class
 * @param {string} targetClass - Target class ('10' or '12')
 * @returns {Promise<Object>} List of available quizzes
 */
const getAvailableQuizzes = async (targetClass) => {
  try {
    const quizzes = await Quiz.find({ targetClass })
      .select('title description purpose estimatedTime questions')
      .lean();

    const quizList = quizzes.map(quiz => ({
      id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      purpose: quiz.purpose,
      estimatedTime: quiz.estimatedTime,
      totalQuestions: quiz.questions.length,
      targetClass: quiz.targetClass
    }));

    return {
      success: true,
      message: `Available quizzes for class ${targetClass} fetched successfully`,
      data: {
        targetClass,
        quizzes: quizList,
        total: quizList.length
      }
    };
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return {
      success: false,
      message: `Failed to fetch quizzes: ${error.message}`,
      data: null
    };
  }
};

module.exports = {
  getClass10Quiz,
  submitClass10Quiz,
  getAvailableQuizzes
};