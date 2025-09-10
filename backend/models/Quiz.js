const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['multiple-choice', 'rating', 'boolean', 'text'],
    required: [true, 'Question type is required']
  },
  options: [String], // For multiple-choice questions
  category: {
    type: String,
    enum: ['aptitude', 'interest', 'personality', 'academic'],
    required: [true, 'Question category is required']
  },
  weightage: {
    type: Number,
    default: 1,
    min: 1,
    max: 5
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Quiz title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Quiz description is required'],
    trim: true
  },
  targetClass: {
    type: String,
    enum: ['10', '12', 'both'],
    required: [true, 'Target class is required']
  },
  questions: [questionSchema],
  estimatedTime: {
    type: Number, // in minutes
    required: [true, 'Estimated time is required'],
    min: 5,
    max: 60
  },
  isActive: {
    type: Boolean,
    default: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  tags: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for better query performance
quizSchema.index({ targetClass: 1, isActive: 1 });
quizSchema.index({ tags: 1 });

module.exports = mongoose.model('Quiz', quizSchema);
