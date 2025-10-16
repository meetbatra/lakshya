const QuizService = require('../services/dailyQuizService');
const User = require('../models/User');
const Exam = require('../models/Exam');
const QuizQuestion = require('../models/QuizQuestion');
const { wrapAsync } = require('../utils/middleware');

class DailyQuizController {
  /**
   * Get daily quiz for authenticated user
   * GET /api/quiz/daily
   */
  static getDailyQuiz = wrapAsync(async (req, res) => {
    const userId = req.user.id;
    
    const result = await QuizService.generateDailyQuiz(userId);
    
    if (!result.success) {
      if (result.code === 'ALREADY_ATTEMPTED') {
        return res.status(409).json(result);
      }
      return res.status(400).json(result);
    }
    
    res.json(result);
  });

  /**
   * Submit quiz answers
   * POST /api/quiz/submit
   */
  static submitQuiz = wrapAsync(async (req, res) => {
    const userId = req.user.id;
    const quizData = req.body;
    
    // Validate required fields
    const { quizId, examId, answers, startTime, endTime } = quizData;
    
    if (!quizId || !examId || !answers || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: quizId, examId, answers, startTime, endTime'
      });
    }
    
    const result = await QuizService.submitQuiz(userId, quizData);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.json(result);
  });

  /**
   * Get user's quiz analytics
   * GET /api/quiz/analytics?days=30
   */
  static getAnalytics = wrapAsync(async (req, res) => {
    const userId = req.user.id;
    const days = parseInt(req.query.days) || 30;
    
    if (days < 1 || days > 365) {
      return res.status(400).json({
        success: false,
        message: 'Days parameter must be between 1 and 365'
      });
    }
    
    const result = await QuizService.getUserAnalytics(userId, days);
    res.json(result);
  });

  /**
   * Get quiz status for user
   * GET /api/quiz/status
   */
  static getQuizStatus = wrapAsync(async (req, res) => {
    const userId = req.user.id;
    
    const result = await QuizService.getQuizStatus(userId);
    res.json(result);
  });

  /**
   * Get leaderboard
   * GET /api/quiz/leaderboard?examId=xxx&type=daily&limit=10
   */
  static getLeaderboard = wrapAsync(async (req, res) => {
    const { examId, type = 'daily', limit = 10 } = req.query;
    
    if (!examId) {
      return res.status(400).json({
        success: false,
        message: 'examId is required'
      });
    }
    
    const limitNum = parseInt(limit);
    if (limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        message: 'Limit must be between 1 and 100'
      });
    }
    
    const result = await QuizService.getLeaderboard(examId, type, limitNum);
    res.json(result);
  });

  /**
   * Get user's quiz history
   * GET /api/quiz/history?page=1&limit=10
   */
  static getQuizHistory = wrapAsync(async (req, res) => {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    if (page < 1 || limit < 1 || limit > 50) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pagination parameters'
      });
    }
    
    try {
      const UserQuizAttempt = require('../models/UserQuizAttempt');
      
      const skip = (page - 1) * limit;
      
      const [attempts, total] = await Promise.all([
        UserQuizAttempt.find({ user: userId, isCompleted: true })
          .populate('exam', 'name')
          .sort({ date: -1 })
          .skip(skip)
          .limit(limit)
          .select('quizType percentage correctAnswers totalQuestions totalTimeTaken date subjectPerformance'),
        UserQuizAttempt.countDocuments({ user: userId, isCompleted: true })
      ]);
      
      res.json({
        success: true,
        data: {
          attempts,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            itemsPerPage: limit
          }
        }
      });
      
    } catch (error) {
      console.error('Error fetching quiz history:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch quiz history',
        error: error.message
      });
    }
  });

  /**
   * Get detailed results of a specific quiz attempt
   * GET /api/quiz/results/:attemptId
   */
  static getQuizResults = wrapAsync(async (req, res) => {
    const userId = req.user.id;
    const { attemptId } = req.params;
    
    try {
      const UserQuizAttempt = require('../models/UserQuizAttempt');
      
      const attempt = await UserQuizAttempt.findOne({
        _id: attemptId,
        user: userId
      }).populate([
        { path: 'exam', select: 'name' },
        { path: 'questions.question', select: 'question options subject topic difficulty explanation' }
      ]);
      
      if (!attempt) {
        return res.status(404).json({
          success: false,
          message: 'Quiz attempt not found'
        });
      }
      
      res.json({
        success: true,
        data: attempt
      });
      
    } catch (error) {
      console.error('Error fetching quiz results:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch quiz results',
        error: error.message
      });
    }
  });

  /**
   * Get available question counts by subject
   * GET /api/daily-quiz/question-counts
   */
  static getQuestionCounts = wrapAsync(async (req, res) => {
    const userId = req.user.id;
    
    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's primary exam
    const userExam = await Exam.findOne({ streams: { $in: [user.stream] } });
    if (!userExam) {
      return res.status(400).json({
        success: false,
        message: 'No suitable exam found for your stream'
      });
    }

    try {
      // Get question counts by subject
      const questionCounts = await QuizQuestion.aggregate([
        {
          $match: {
            exam: userExam._id,
            isActive: true
          }
        },
        {
          $group: {
            _id: '$subject',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);

      // Calculate totals for different quiz types
      const subjectCounts = {};
      let totalQuestions = 0;

      questionCounts.forEach(item => {
        subjectCounts[item._id] = item.count;
        totalQuestions += item.count;
      });

      // Calculate available questions for different quiz types
      const jeeSubjects = ['Physics', 'Chemistry', 'Mathematics'];
      const neetSubjects = ['Physics', 'Chemistry', 'Biology'];

      const jeeTotal = jeeSubjects.reduce((sum, subject) => sum + (subjectCounts[subject] || 0), 0);
      const neetTotal = neetSubjects.reduce((sum, subject) => sum + (subjectCounts[subject] || 0), 0);

      res.json({
        success: true,
        data: {
          subjectCounts,
          totalQuestions,
          quizTypes: {
            jee: {
              subjects: jeeSubjects,
              availableQuestions: jeeTotal,
              maxRecommended: 25 // Fixed 25 questions for all quizzes
            },
            neet: {
              subjects: neetSubjects,
              availableQuestions: neetTotal,
              maxRecommended: 25 // Fixed 25 questions for all quizzes
            }
          }
        }
      });
    } catch (error) {
      console.error('Error getting question counts:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get question counts'
      });
    }
  });

  /**
   * Get custom quiz with specified subjects and configuration
   * POST /api/daily-quiz/custom
   */
  static getCustomQuiz = wrapAsync(async (req, res) => {
    const userId = req.user.id;
    const { subjects, questionCount = 10, difficulty = null, timeLimit = 600 } = req.body;
    
    if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Subjects array is required'
      });
    }
    
    // Use the quiz service to generate a custom quiz
    const result = await QuizService.generateCustomQuiz(userId, {
      subjects,
      questionCount,
      difficulty,
      timeLimit
    });
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.json(result);
  });

  /**
   * Development endpoint to check today's quiz config
   * GET /api/quiz/today-config
   */
  static getTodayConfig = wrapAsync(async (req, res) => {
    const config = QuizService.getDailyQuizConfig();
    
    res.json({
      success: true,
      data: {
        dayOfWeek: new Date().getDay(),
        dayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()],
        config
      }
    });
  });
}

module.exports = DailyQuizController;