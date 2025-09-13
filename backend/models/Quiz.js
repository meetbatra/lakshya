const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  options: {
    type: [String],
    required: [true, 'Options are required for MCQ questions'],
    validate: {
      validator: function(options) {
        return options && options.length >= 2 && options.length <= 6;
      },
      message: 'Questions must have between 2 and 6 options'
    }
  },
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
    enum: ['10', '12'],
    required: [true, 'Target class is required']
  },
  stream: {
    type: String,
    enum: ['science-pcm', 'science-pcb', 'commerce', 'arts'],
    required: function() {
      return this.targetClass === '12';
    },
    validate: {
      validator: function(stream) {
        // Stream should only be provided for class 12
        if (this.targetClass === '10' && stream) {
          return false;
        }
        // Stream is required for class 12
        if (this.targetClass === '12' && !stream) {
          return false;
        }
        return true;
      },
      message: 'Stream is required only for class 12 quizzes'
    }
  },
  purpose: {
    type: String,
    enum: ['stream-selection', 'field-recommendation'],
    required: [true, 'Quiz purpose is required'],
    validate: {
      validator: function(purpose) {
        // Class 10 should be for stream selection
        if (this.targetClass === '10' && purpose !== 'stream-selection') {
          return false;
        }
        // Class 12 should be for field recommendation
        if (this.targetClass === '12' && purpose !== 'field-recommendation') {
          return false;
        }
        return true;
      },
      message: 'Class 10 is for stream selection, Class 12 is for field recommendation'
    }
  },
  questions: [questionSchema],
}, {
  timestamps: true
});

// Index for better query performance
quizSchema.index({ targetClass: 1, isActive: 1 });
quizSchema.index({ targetClass: 1, stream: 1, isActive: 1 });
quizSchema.index({ purpose: 1, isActive: 1 });
quizSchema.index({ tags: 1 });

// Pre-save middleware to ensure data consistency
quizSchema.pre('save', function(next) {
  // Auto-set purpose based on class if not provided
  if (!this.purpose) {
    this.purpose = this.targetClass === '10' ? 'stream-selection' : 'field-recommendation';
  }
  
  next();
});

// Virtual for quiz display name
quizSchema.virtual('displayName').get(function() {
  if (this.targetClass === '10') {
    return `${this.title} - Class 10 (Stream Selection)`;
  } else {
    return `${this.title} - Class 12 ${this.stream.toUpperCase()} (Field Recommendation)`;
  }
});

module.exports = mongoose.model('Quiz', quizSchema);
