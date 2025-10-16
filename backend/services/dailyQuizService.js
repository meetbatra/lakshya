const QuizQuestion = require('../models/QuizQuestion');
const UserQuizAttempt = require('../models/UserQuizAttempt');
const User = require('../models/User');
const Exam = require('../models/Exam');

class QuizService {
  /**
   * Generate daily quiz for a user
   */
  static async generateDailyQuiz(userId) {
    try {
      // Get user details
      const user = await User.findById(userId);
      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      // Check if user already attempted today's quiz
      const hasAttempted = await UserQuizAttempt.hasTodayAttempt(userId, 'daily');
      if (hasAttempted) {
        return {
          success: false,
          message: 'You have already attempted today\'s quiz',
          code: 'ALREADY_ATTEMPTED'
        };
      }

      // Get user's primary exam (we'll use the first exam for now)
      const userExam = await Exam.findOne({ streams: { $in: [user.stream] } });
      if (!userExam) {
        return {
          success: false,
          message: 'No suitable exam found for your stream'
        };
      }

      // Get questions the user has attempted recently to avoid repetition
      const recentAttempts = await UserQuizAttempt.find({
        user: userId,
        date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
      }).populate('questions.question');

      const excludeQuestionIds = [];
      recentAttempts.forEach(attempt => {
        attempt.questions.forEach(q => {
          excludeQuestionIds.push(q.question._id);
        });
      });

      // Get daily quiz configuration based on day of week
      const quizConfig = this.getDailyQuizConfig();

      // Generate questions
      const questions = await QuizQuestion.getDailyQuizQuestions(
        userExam._id,
        {
          count: quizConfig.questionCount,
          subjects: quizConfig.subjects,
          difficulty: quizConfig.difficulty,
          excludeQuestionIds
        }
      );

      if (questions.length === 0) {
        return {
          success: false,
          message: 'No questions available for today\'s quiz'
        };
      }

      return {
        success: true,
        data: {
          quizId: `daily_${Date.now()}`,
          exam: userExam,
          questions: questions.map(q => new QuizQuestion(q).toQuizFormat()),
          timeLimit: quizConfig.timeLimit,
          config: quizConfig
        }
      };

    } catch (error) {
      console.error('Error generating daily quiz:', error);
      return {
        success: false,
        message: 'Failed to generate daily quiz',
        error: error.message
      };
    }
  }

  /**
   * Generate custom quiz with specified subjects and configuration
   */
  static async generateCustomQuiz(userId, options = {}) {
    try {
      const {
        subjects = ['Physics', 'Chemistry', 'Mathematics'],
        questionCount = 10,
        difficulty = null,
        timeLimit = 600
      } = options;

      // Get user details
      const user = await User.findById(userId);
      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      // Get user's primary exam (we'll use the first exam for now)
      const userExam = await Exam.findOne({ streams: { $in: [user.stream] } });
      if (!userExam) {
        return {
          success: false,
          message: 'No suitable exam found for your stream'
        };
      }

      // Get questions
      const questions = await QuizQuestion.getDailyQuizQuestions(
        userExam._id,
        {
          count: questionCount,
          subjects: subjects,
          difficulty: difficulty,
          excludeQuestionIds: []
        }
      );

      if (questions.length === 0) {
        return {
          success: false,
          message: 'No questions available for the selected subjects'
        };
      }

      // Check if we have enough questions for the requested count
      if (questions.length < questionCount) {
        return {
          success: false,
          message: `Only ${questions.length} questions available, but ${questionCount} requested. Please try with fewer questions.`
        };
      }

      return {
        success: true,
        data: {
          quizId: `custom_${Date.now()}`,
          exam: userExam,
          questions: questions.map(q => new QuizQuestion(q).toQuizFormat()),
          timeLimit: timeLimit,
          config: {
            subjects,
            questionCount,
            difficulty,
            timeLimit,
            description: `Custom Quiz: ${subjects.join(', ')}`
          }
        }
      };

    } catch (error) {
      console.error('Error generating custom quiz:', error);
      return {
        success: false,
        message: 'Failed to generate custom quiz',
        error: error.message
      };
    }
  }

  /**
   * Get daily quiz configuration based on current day
   */
  static getDailyQuizConfig() {
    const dayOfWeek = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    const configs = {
      1: { // Monday - Physics Focus
        subjects: ['Physics'],
        difficulty: null, // Mixed
        questionCount: 10,
        timeLimit: 600, // 10 minutes
        description: 'Monday Physics Challenge'
      },
      2: { // Tuesday - Chemistry Focus
        subjects: ['Chemistry'],
        difficulty: null,
        questionCount: 10,
        timeLimit: 600,
        description: 'Tuesday Chemistry Challenge'
      },
      3: { // Wednesday - Mathematics Focus
        subjects: ['Mathematics'],
        difficulty: null,
        questionCount: 10,
        timeLimit: 600,
        description: 'Wednesday Math Challenge'
      },
      4: { // Thursday - Biology Focus
        subjects: ['Biology'],
        difficulty: null,
        questionCount: 10,
        timeLimit: 600,
        description: 'Thursday Biology Challenge'
      },
      5: { // Friday - Mixed Review
        subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology'],
        difficulty: null,
        questionCount: 12,
        timeLimit: 720, // 12 minutes
        description: 'Friday Mixed Review'
      },
      6: { // Saturday - Hard Questions
        subjects: ['Physics', 'Chemistry', 'Mathematics'],
        difficulty: 'Hard',
        questionCount: 8,
        timeLimit: 600,
        description: 'Saturday Challenge'
      },
      0: { // Sunday - Easy Review
        subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology'],
        difficulty: 'Easy',
        questionCount: 15,
        timeLimit: 900, // 15 minutes
        description: 'Sunday Review'
      }
    };

    return configs[dayOfWeek] || configs[1]; // Default to Monday config
  }

  /**
   * Submit quiz attempt and calculate results
   */
  static async submitQuiz(userId, quizData) {
    try {
      const { quizId, examId, answers, startTime, endTime } = quizData;

      // Get user details
      const user = await User.findById(userId);
      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      // Validate answers format
      if (!answers || !Array.isArray(answers)) {
        return {
          success: false,
          message: 'Invalid answers format'
        };
      }

      // Get all questions with correct answers
      const questionIds = answers.map(a => a.questionId);
      const questions = await QuizQuestion.find({ _id: { $in: questionIds } });

      if (questions.length !== answers.length) {
        return {
          success: false,
          message: 'Question count mismatch'
        };
      }

      // Calculate results
      let correctAnswers = 0;
      const processedQuestions = [];
      const subjectStats = {};

      for (let i = 0; i < answers.length; i++) {
        const answer = answers[i];
        const question = questions.find(q => q._id.toString() === answer.questionId);
        
        if (!question) continue;

        // Find correct option
        const correctOption = question.options.find(opt => opt.isCorrect);
        if (!correctOption) {
          console.error(`No correct option found for question ${question._id}`);
          continue;
        }

        // Ensure both IDs are strings for comparison
        const correctOptionIdStr = correctOption._id.toString();
        const selectedOptionIdStr = answer.selectedOptionId ? answer.selectedOptionId.toString() : null;
        
        const isCorrect = selectedOptionIdStr && correctOptionIdStr === selectedOptionIdStr;

        if (isCorrect) correctAnswers++;

        // Update question statistics
        await QuizQuestion.updateQuestionStats(question._id, isCorrect);

        // Track subject performance
        if (!subjectStats[question.subject]) {
          subjectStats[question.subject] = {
            subject: question.subject,
            totalQuestions: 0,
            correctAnswers: 0
          };
        }
        subjectStats[question.subject].totalQuestions++;
        if (isCorrect) subjectStats[question.subject].correctAnswers++;

        processedQuestions.push({
          question: question._id,
          selectedOption: selectedOptionIdStr,
          correctOption: correctOptionIdStr,
          isCorrect: isCorrect,
          timeTaken: answer.timeTaken || 0
        });
      }

      // Calculate subject percentages
      const subjectPerformance = Object.values(subjectStats).map(stat => ({
        ...stat,
        percentage: Math.round((stat.correctAnswers / stat.totalQuestions) * 100)
      }));

      // Calculate overall metrics
      const totalQuestions = answers.length;
      const score = correctAnswers;
      const percentage = Math.round((correctAnswers / totalQuestions) * 100);
      const totalTimeTaken = Math.floor((new Date(endTime) - new Date(startTime)) / 1000);

      // Save quiz attempt
      const quizAttempt = new UserQuizAttempt({
        user: userId,
        quizType: 'daily',
        exam: examId,
        questions: processedQuestions,
        totalQuestions,
        correctAnswers,
        score,
        percentage,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        totalTimeTaken,
        subjectPerformance,
        isCompleted: true
      });

      await quizAttempt.save();

      // Get updated streak
      const streak = await UserQuizAttempt.getUserStreak(userId);

      return {
        success: true,
        data: {
          quizAttemptId: quizAttempt._id,
          results: {
            totalQuestions,
            correctAnswers,
            score,
            percentage,
            totalTimeTaken,
            subjectPerformance,
            questionResults: processedQuestions
          },
          streak,
          message: this.getResultMessage(percentage)
        }
      };

    } catch (error) {
      console.error('Error submitting quiz:', error);
      return {
        success: false,
        message: 'Failed to submit quiz',
        error: error.message
      };
    }
  }

  /**
   * Get user's quiz analytics
   */
  static async getUserAnalytics(userId, days = 30) {
    try {
      const [analytics, subjectAnalytics, streak] = await Promise.all([
        UserQuizAttempt.getUserAnalytics(userId, days),
        UserQuizAttempt.getSubjectAnalytics(userId, days),
        UserQuizAttempt.getUserStreak(userId)
      ]);

      return {
        success: true,
        data: {
          overall: analytics,
          subjects: subjectAnalytics,
          streak,
          period: `Last ${days} days`
        }
      };

    } catch (error) {
      console.error('Error fetching user analytics:', error);
      return {
        success: false,
        message: 'Failed to fetch analytics',
        error: error.message
      };
    }
  }

  /**
   * Get quiz leaderboard
   */
  static async getLeaderboard(examId, quizType = 'daily', limit = 10) {
    try {
      const leaderboard = await UserQuizAttempt.getLeaderboard(examId, quizType, limit);

      return {
        success: true,
        data: leaderboard
      };

    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return {
        success: false,
        message: 'Failed to fetch leaderboard',
        error: error.message
      };
    }
  }

  /**
   * Get quiz status for user (has attempted today, streak, etc.)
   */
  static async getQuizStatus(userId) {
    try {
      const [hasAttempted, streak, todayConfig] = await Promise.all([
        UserQuizAttempt.hasTodayAttempt(userId, 'daily'),
        UserQuizAttempt.getUserStreak(userId),
        Promise.resolve(this.getDailyQuizConfig())
      ]);

      return {
        success: true,
        data: {
          hasAttemptedToday: hasAttempted,
          streak,
          todayConfig,
          canAttempt: !hasAttempted
        }
      };

    } catch (error) {
      console.error('Error fetching quiz status:', error);
      return {
        success: false,
        message: 'Failed to fetch quiz status',
        error: error.message
      };
    }
  }

  /**
   * Get motivational message based on performance
   */
  static getResultMessage(percentage) {
    if (percentage >= 90) return "🏆 Outstanding! You're a quiz champion!";
    if (percentage >= 80) return "🌟 Excellent work! Keep it up!";
    if (percentage >= 70) return "👍 Good job! You're on the right track!";
    if (percentage >= 60) return "📚 Not bad! A bit more practice will help!";
    if (percentage >= 50) return "💪 Keep trying! Practice makes perfect!";
    return "🎯 Don't give up! Every expert was once a beginner!";
  }
}

module.exports = QuizService;