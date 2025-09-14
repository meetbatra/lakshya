const quizService = require('../services/quizService');
const { testGeminiConnection } = require('../utils/services/geminiService');

/**
 * Quiz Controller - Handles HTTP requests for quiz operations
 */

/**
 * GET /api/quiz/class10
 * Get Class 10 Stream Selection Quiz
 */
const getClass10Quiz = async (req, res) => {
  const result = await quizService.getClass10Quiz();
  
  if (!result.success) {
    return res.status(404).json(result);
  }

  res.status(200).json({
    success: true,
    message: result.message,
    data: result.data
  });
};

/**
 * POST /api/quiz/class10/submit
 * Submit Class 10 Quiz and Get Stream Recommendations
 */
const submitClass10Quiz = async (req, res) => {
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

  const result = await quizService.submitClass10Quiz(submission);

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
};

/**
 * GET /api/quiz/available/:class
 * Get all available quizzes for a specific class
 */
const getAvailableQuizzes = async (req, res) => {
  const { class: targetClass } = req.params;

  // Validate class parameter
  if (!['10', '12'].includes(targetClass)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid class. Supported classes: 10, 12',
      data: null
    });
  }

  const result = await quizService.getAvailableQuizzes(targetClass);

  if (!result.success) {
    return res.status(500).json(result);
  }

  res.status(200).json({
    success: true,
    message: result.message,
    data: result.data
  });
};

/**
 * GET /api/quiz/health
 * Health check endpoint for quiz service
 */
const healthCheck = async (req, res) => {
  // Test database connectivity
  const class10Result = await quizService.getAvailableQuizzes('10');
  
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
};

/**
 * GET /api/quiz/class12/pcm
 * Fetch Class 12 PCM Field Recommendation Quiz
 */
const getClass12PCMQuiz = async (req, res) => {
  const result = await quizService.getClass12PCMQuiz();
  if (!result.success) {
    return res.status(404).json(result);
  }
  res.status(200).json({ success: true, message: result.message, data: result.data });
};

/**
 * POST /api/quiz/class12/pcm/submit
 * Submit Class 12 PCM Field Recommendation Quiz
 */
const submitClass12PCMQuiz = async (req, res) => {
  const { quizId, answers, userId } = req.body;
  if (!quizId || !answers || !Array.isArray(answers)) {
    return res.status(400).json({ success: false, message: 'Invalid request body: quizId + answers[] required', data: null });
  }
  const result = await quizService.submitClass12PCMQuiz({ quizId, answers, userId });
  if (!result.success) {
    if (result.message.includes('not found')) return res.status(404).json(result);
    if (result.message.includes('Invalid') || result.message.includes('Expected')) return res.status(400).json(result);
    return res.status(500).json(result);
  }
  res.status(200).json({ success: true, message: result.message, data: result.data });
};

/**
 * GET /api/quiz/class12/pcb
 * Fetch Class 12 PCB Field Recommendation Quiz
 */
const getClass12PCBQuiz = async (req, res) => {
  const result = await quizService.getClass12PCBQuiz();
  if (!result.success) return res.status(404).json(result);
  res.status(200).json({ success: true, message: result.message, data: result.data });
};

/**
 * POST /api/quiz/class12/pcb/submit
 * Submit Class 12 PCB Field Recommendation Quiz
 */
const submitClass12PCBQuiz = async (req, res) => {
  const { quizId, answers, userId } = req.body;
  if (!quizId || !answers || !Array.isArray(answers)) {
    return res.status(400).json({ success: false, message: 'Invalid request body: quizId + answers[] required', data: null });
  }
  const result = await quizService.submitClass12PCBQuiz({ quizId, answers, userId });
  if (!result.success) {
    if (result.message.includes('not found')) return res.status(404).json(result);
    if (result.message.includes('Invalid') || result.message.includes('Expected')) return res.status(400).json(result);
    return res.status(500).json(result);
  }
  res.status(200).json({ success: true, message: result.message, data: result.data });
};

/**
 * GET /api/quiz/class12/commerce
 * Fetch Class 12 Commerce Field Recommendation Quiz
 */
const getClass12CommerceQuiz = async (req, res) => {
  const result = await quizService.getClass12CommerceQuiz();
  if (!result.success) return res.status(404).json(result);
  res.status(200).json({ success: true, message: result.message, data: result.data });
};

/**
 * POST /api/quiz/class12/commerce/submit
 * Submit Class 12 Commerce Field Recommendation Quiz
 */
const submitClass12CommerceQuiz = async (req, res) => {
  const { quizId, answers, userId } = req.body;
  if (!quizId || !answers || !Array.isArray(answers)) {
    return res.status(400).json({ success: false, message: 'Invalid request body: quizId + answers[] required', data: null });
  }
  const result = await quizService.submitClass12CommerceQuiz(quizId, answers, userId);
  if (!result.success) {
    if (result.message.includes('not found')) return res.status(404).json(result);
    if (result.message.includes('Invalid') || result.message.includes('Expected')) return res.status(400).json(result);
    return res.status(500).json(result);
  }
  res.status(200).json({ success: true, message: result.message, data: result.data });
};

/**
 * GET /api/quiz/class12/arts
 * Fetch Class 12 Arts Field Recommendation Quiz
 */
const getClass12ArtsQuiz = async (req, res) => {
  const result = await quizService.getClass12ArtsQuiz();
  if (!result.success) return res.status(404).json(result);
  res.status(200).json({ success: true, message: result.message, data: result.data });
};

/**
 * POST /api/quiz/class12/arts/submit
 * Submit Class 12 Arts Field Recommendation Quiz
 */
const submitClass12ArtsQuiz = async (req, res) => {
  const { quizId, answers, userId } = req.body;
  if (!quizId || !answers || !Array.isArray(answers)) {
    return res.status(400).json({ success: false, message: 'Invalid request body: quizId + answers[] required', data: null });
  }
  const result = await quizService.submitClass12ArtsQuiz(quizId, answers, userId);
  if (!result.success) {
    if (result.message.includes('not found')) return res.status(404).json(result);
    if (result.message.includes('Invalid') || result.message.includes('Expected')) return res.status(400).json(result);
    return res.status(500).json(result);
  }
  res.status(200).json({ success: true, message: result.message, data: result.data });
};

module.exports = {
  getClass10Quiz,
  submitClass10Quiz,
  getAvailableQuizzes,
  healthCheck,
  getClass12PCMQuiz,
  submitClass12PCMQuiz,
  getClass12PCBQuiz,
  submitClass12PCBQuiz,
  getClass12CommerceQuiz,
  submitClass12CommerceQuiz,
  getClass12ArtsQuiz,
  submitClass12ArtsQuiz
};
