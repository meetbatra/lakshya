const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema({
  // Basic question information
  question: {
    type: String,
    required: true,
    trim: true,
    index: 'text' // Enable text search
  },
  
  // Multiple choice options
  options: [{
    text: {
      type: String,
      required: true,
      trim: true
    },
    isCorrect: {
      type: Boolean,
      default: false
    }
  }],
  
  // Question metadata
  subject: {
    type: String,
    required: true,
    enum: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'General Knowledge', 'Legal Reasoning', 'Logical Reasoning'],
    index: true
  },
  
  topic: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium',
    index: true
  },
  
  // Exam association
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true,
    index: true
  },
  
  // Question analytics
  totalAttempts: {
    type: Number,
    default: 0
  },
  
  correctAttempts: {
    type: Number,
    default: 0
  },
  
  // Administrative fields
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  
  createdBy: {
    type: String,
    default: 'System'
  },
  
  tags: [{
    type: String,
    trim: true
  }],
  
  explanation: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
quizQuestionSchema.index({ exam: 1, subject: 1, difficulty: 1 });
quizQuestionSchema.index({ exam: 1, isActive: 1 });
quizQuestionSchema.index({ subject: 1, topic: 1 });

// Virtual for success rate
quizQuestionSchema.virtual('successRate').get(function() {
  if (this.totalAttempts === 0) return 0;
  return Math.round((this.correctAttempts / this.totalAttempts) * 100);
});

// Static method to get random questions for daily quiz
quizQuestionSchema.statics.getDailyQuizQuestions = async function(examId, options = {}) {
  const {
    count = 10,
    subjects = [],
    difficulty = null,
    excludeQuestionIds = []
  } = options;
  
  // Build match criteria
  const matchCriteria = {
    exam: examId,
    isActive: true,
    _id: { $nin: excludeQuestionIds }
  };
  
  // Filter by subjects if specified
  if (subjects.length > 0) {
    matchCriteria.subject = { $in: subjects };
  }
  
  // Filter by difficulty if specified
  if (difficulty) {
    matchCriteria.difficulty = difficulty;
  }
  
  // Aggregate pipeline for random selection
  const pipeline = [
    { $match: matchCriteria },
    { $sample: { size: count } },
    {
      $lookup: {
        from: 'exams',
        localField: 'exam',
        foreignField: '_id',
        as: 'examDetails'
      }
    }
  ];
  
  const questions = await this.aggregate(pipeline);
  return questions;
};

// Static method to get questions by topic for targeted practice
quizQuestionSchema.statics.getQuestionsByTopic = async function(examId, subject, topic, count = 5) {
  const questions = await this.find({
    exam: examId,
    subject: subject,
    topic: topic,
    isActive: true
  }).limit(count);
  
  return questions;
};

// Static method to update question analytics
quizQuestionSchema.statics.updateQuestionStats = async function(questionId, isCorrect) {
  const updateFields = {
    $inc: { totalAttempts: 1 }
  };
  
  if (isCorrect) {
    updateFields.$inc.correctAttempts = 1;
  }
  
  await this.updateOne({ _id: questionId }, updateFields);
};

// Instance method to get formatted question for API response
quizQuestionSchema.methods.toQuizFormat = function() {
  return {
    _id: this._id,
    question: this.question,
    options: this.options.map(option => ({
      text: option.text,
      _id: option._id
      // Note: We don't send isCorrect to frontend
    })),
    subject: this.subject,
    topic: this.topic,
    difficulty: this.difficulty,
    explanation: this.explanation
  };
};

// Ensure we have at least 4 options and exactly one correct answer
quizQuestionSchema.pre('save', function(next) {
  if (this.options.length < 4) {
    return next(new Error('Question must have at least 4 options'));
  }
  
  const correctOptions = this.options.filter(option => option.isCorrect);
  if (correctOptions.length !== 1) {
    return next(new Error('Question must have exactly one correct answer'));
  }
  
  next();
});

module.exports = mongoose.model('QuizQuestion', quizQuestionSchema);