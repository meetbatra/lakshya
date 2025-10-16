const mongoose = require('mongoose');

const userQuizAttemptSchema = new mongoose.Schema({
  // User and quiz information
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Quiz details
  quizType: {
    type: String,
    required: true,
    enum: ['daily', 'practice', 'mock', 'challenge'],
    default: 'daily',
    index: true
  },
  
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true,
    index: true
  },
  
  // Questions and answers
  questions: [{
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'QuizQuestion',
      required: true
    },
    selectedOption: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    isCorrect: {
      type: Boolean,
      required: true
    },
    timeTaken: {
      type: Number, // in seconds
      default: 0
    }
  }],
  
  // Performance metrics
  totalQuestions: {
    type: Number,
    required: true
  },
  
  correctAnswers: {
    type: Number,
    required: true,
    default: 0
  },
  
  score: {
    type: Number,
    required: true,
    default: 0
  },
  
  percentage: {
    type: Number,
    required: true,
    default: 0
  },
  
  // Time tracking
  startTime: {
    type: Date,
    required: true
  },
  
  endTime: {
    type: Date,
    required: true
  },
  
  totalTimeTaken: {
    type: Number, // in seconds
    required: true
  },
  
  // Subject-wise performance
  subjectPerformance: [{
    subject: {
      type: String,
      required: true
    },
    totalQuestions: {
      type: Number,
      required: true
    },
    correctAnswers: {
      type: Number,
      required: true
    },
    percentage: {
      type: Number,
      required: true
    }
  }],
  
  // Quiz session details
  date: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  isCompleted: {
    type: Boolean,
    default: true
  },
  
  // Streak tracking
  isStreakDay: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound indexes for performance
userQuizAttemptSchema.index({ user: 1, date: -1 });
userQuizAttemptSchema.index({ user: 1, quizType: 1, date: -1 });
userQuizAttemptSchema.index({ exam: 1, date: -1 });

// Static method to get user's quiz streak
userQuizAttemptSchema.statics.getUserStreak = async function(userId) {
  const attempts = await this.find({
    user: userId,
    quizType: 'daily',
    isCompleted: true
  }).sort({ date: -1 }).limit(30);
  
  let streak = 0;
  const today = new Date();
  
  for (let i = 0; i < attempts.length; i++) {
    const attemptDate = new Date(attempts[i].date);
    const daysDiff = Math.floor((today - attemptDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === streak) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

// Static method to get user's performance analytics
userQuizAttemptSchema.statics.getUserAnalytics = async function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const pipeline = [
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        date: { $gte: startDate },
        isCompleted: true
      }
    },
    {
      $group: {
        _id: null,
        totalQuizzes: { $sum: 1 },
        averageScore: { $avg: '$percentage' },
        totalQuestions: { $sum: '$totalQuestions' },
        totalCorrect: { $sum: '$correctAnswers' },
        averageTime: { $avg: '$totalTimeTaken' }
      }
    }
  ];
  
  const result = await this.aggregate(pipeline);
  return result[0] || {
    totalQuizzes: 0,
    averageScore: 0,
    totalQuestions: 0,
    totalCorrect: 0,
    averageTime: 0
  };
};

// Static method to get subject-wise performance
userQuizAttemptSchema.statics.getSubjectAnalytics = async function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const pipeline = [
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        date: { $gte: startDate },
        isCompleted: true
      }
    },
    {
      $unwind: '$subjectPerformance'
    },
    {
      $group: {
        _id: '$subjectPerformance.subject',
        totalQuestions: { $sum: '$subjectPerformance.totalQuestions' },
        totalCorrect: { $sum: '$subjectPerformance.correctAnswers' },
        averagePercentage: { $avg: '$subjectPerformance.percentage' },
        quizCount: { $sum: 1 }
      }
    },
    {
      $project: {
        subject: '$_id',
        totalQuestions: 1,
        totalCorrect: 1,
        averagePercentage: { $round: ['$averagePercentage', 2] },
        quizCount: 1,
        _id: 0
      }
    },
    {
      $sort: { averagePercentage: -1 }
    }
  ];
  
  return await this.aggregate(pipeline);
};

// Static method to check if user attempted today's quiz
userQuizAttemptSchema.statics.hasTodayAttempt = async function(userId, quizType = 'daily') {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const attempt = await this.findOne({
    user: userId,
    quizType: quizType,
    date: {
      $gte: today,
      $lt: tomorrow
    }
  });
  
  return !!attempt;
};

// Static method to get recent attempts for leaderboard
userQuizAttemptSchema.statics.getLeaderboard = async function(examId, quizType = 'daily', limit = 10) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const pipeline = [
    {
      $match: {
        exam: examId,
        quizType: quizType,
        date: { $gte: today },
        isCompleted: true
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'userDetails'
      }
    },
    {
      $unwind: '$userDetails'
    },
    {
      $project: {
        userName: '$userDetails.name',
        percentage: 1,
        totalTimeTaken: 1,
        correctAnswers: 1,
        totalQuestions: 1
      }
    },
    {
      $sort: {
        percentage: -1,
        totalTimeTaken: 1 // Secondary sort by time (faster is better)
      }
    },
    {
      $limit: limit
    }
  ];
  
  return await this.aggregate(pipeline);
};

// Pre-save middleware to calculate percentage and subject performance
userQuizAttemptSchema.pre('save', function(next) {
  // Calculate overall percentage
  if (this.totalQuestions > 0) {
    this.percentage = Math.round((this.correctAnswers / this.totalQuestions) * 100);
  }
  
  // Calculate subject-wise performance
  if (this.questions && this.questions.length > 0) {
    const subjectStats = {};
    
    // This would need to be populated from the actual questions
    // For now, we'll assume it's calculated elsewhere
  }
  
  next();
});

module.exports = mongoose.model('UserQuizAttempt', userQuizAttemptSchema);