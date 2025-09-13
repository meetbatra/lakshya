const QuizService = require('../services/quizService');
const { testGeminiConnection } = require('../utils/geminiService');

/**
 * Quiz Controller - Handles HTTP requests for quiz operations
 */

/**
 * GET /api/quiz/class10
 * Get Class 10 Stream Selection Quiz
 */
const getClass10Quiz = async (req, res) => {
  try {
    const result = await QuizService.getClass10Quiz();
    
    if (!result.success) {
      return res.status(404).json(result);
    }

    res.status(200).json({
      success: true,
      message: result.message,
      data: result.data
    });
  } catch (error) {
    console.error('Error in getClass10Quiz controller:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: null
    });
  }
};

/**
 * POST /api/quiz/class10/submit
 * Submit Class 10 Quiz and Get Stream Recommendations
 */
const submitClass10Quiz = async (req, res) => {
  try {
    const { quizId, answers, userId } = req.body;

    // Validate request body
    if (!quizId || !answers) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: quizId and answers',
        data: null
      });
    }

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Answers must be an array',
        data: null
      });
    }

    const submission = {
      quizId,
      answers,
      userId: userId || null
    };

    const result = await QuizService.submitClass10Quiz(submission);

    if (!result.success) {
      // Handle different error types based on message content
      if (result.message.includes('Invalid submission') || 
          result.message.includes('Expected') ||
          result.message.includes('Invalid quiz type')) {
        return res.status(400).json(result);
      }

      if (result.message.includes('not found')) {
        return res.status(404).json(result);
      }

      return res.status(500).json(result);
    }

    res.status(200).json({
      success: true,
      message: result.message,
      data: result.data
    });

  } catch (error) {
    console.error('Error in submitClass10Quiz controller:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while processing quiz submission',
      data: null
    });
  }
};

/**
 * GET /api/quiz/available/:class
 * Get all available quizzes for a specific class
 */
const getAvailableQuizzes = async (req, res) => {
  try {
    const { class: targetClass } = req.params;

    // Validate class parameter
    if (!['10', '12'].includes(targetClass)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid class. Supported classes: 10, 12',
        data: null
      });
    }

    const result = await QuizService.getAvailableQuizzes(targetClass);

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.status(200).json({
      success: true,
      message: result.message,
      data: result.data
    });

  } catch (error) {
    console.error('Error in getAvailableQuizzes controller:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: null
    });
  }
};

/**
 * GET /api/quiz/health
 * Health check endpoint for quiz service
 */
const healthCheck = async (req, res) => {
  try {
    // Test database connectivity
    const class10Result = await QuizService.getAvailableQuizzes('10');
    
    // Test Gemini AI connectivity
    const geminiResult = await testGeminiConnection();
    
    if (!class10Result.success) {
      return res.status(503).json({
        success: false,
        message: 'Quiz service is unhealthy - Database issue',
        data: {
          timestamp: new Date().toISOString(),
          status: 'unhealthy',
          database: 'failed',
          gemini: geminiResult.success ? 'healthy' : 'failed',
          error: class10Result.message
        }
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Quiz service is healthy',
      data: {
        timestamp: new Date().toISOString(),
        status: 'operational',
        database: 'healthy',
        gemini: geminiResult.success ? 'healthy' : 'degraded',
        class10Quizzes: class10Result.data.total,
        geminiStatus: geminiResult.data,
        version: '1.0.0'
      }
    });
  } catch (error) {
    console.error('Quiz service health check failed:', error);
    res.status(503).json({
      success: false,
      message: 'Quiz service is unhealthy',
      data: {
        timestamp: new Date().toISOString(),
        status: 'error',
        error: error.message
      }
    });
  }
};

module.exports = {
  getClass10Quiz,
  submitClass10Quiz,
  getAvailableQuizzes,
  healthCheck
};
