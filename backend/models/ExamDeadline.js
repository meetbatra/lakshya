const mongoose = require('mongoose');

const examDeadlineSchema = new mongoose.Schema({
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: [true, 'Exam reference is required']
  },
  applicationStartDate: {
    type: Date,
    required: [true, 'Application start date is required']
  },
  applicationEndDate: {
    type: Date,
    required: [true, 'Application end date is required']
  },
  examDate: {
    type: Date,
    required: [true, 'Exam date is required']
  },
  admitCardDate: {
    type: Date
  },
  resultDate: {
    type: Date
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [2024, 'Year must be 2024 or later']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for better performance
examDeadlineSchema.index({ exam: 1, year: 1 }, { unique: true }); // One deadline per exam per year
examDeadlineSchema.index({ applicationEndDate: 1 });
examDeadlineSchema.index({ examDate: 1 });
examDeadlineSchema.index({ admitCardDate: 1 });
examDeadlineSchema.index({ resultDate: 1 });
examDeadlineSchema.index({ isActive: 1 });

// Virtual for getting exam details
examDeadlineSchema.virtual('examDetails', {
  ref: 'Exam',
  localField: 'exam',
  foreignField: '_id',
  justOne: true
});

// Ensure virtual fields are serialized
examDeadlineSchema.set('toJSON', { virtuals: true });
examDeadlineSchema.set('toObject', { virtuals: true });

// Pre-save middleware to validate dates
examDeadlineSchema.pre('save', function(next) {
  // Validate date sequence
  if (this.applicationStartDate >= this.applicationEndDate) {
    return next(new Error('Application end date must be after start date'));
  }
  
  if (this.applicationEndDate >= this.examDate) {
    return next(new Error('Exam date must be after application end date'));
  }
  
  if (this.admitCardDate && this.admitCardDate >= this.examDate) {
    return next(new Error('Admit card date must be before exam date'));
  }
  
  if (this.resultDate && this.resultDate <= this.examDate) {
    return next(new Error('Result date must be after exam date'));
  }
  
  next();
});

// Static method to get upcoming deadlines
examDeadlineSchema.statics.getUpcomingDeadlines = function(daysAhead = 7) {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + daysAhead);
  
  return this.find({
    isActive: true,
    $or: [
      { applicationEndDate: { $gte: new Date(), $lte: targetDate } },
      { examDate: { $gte: new Date(), $lte: targetDate } },
      { admitCardDate: { $gte: new Date(), $lte: targetDate } },
      { resultDate: { $gte: new Date(), $lte: targetDate } }
    ]
  }).populate('exam');
};

// Static method to get deadlines for a specific exam
examDeadlineSchema.statics.getDeadlinesForExam = function(examId, year) {
  const query = { exam: examId, isActive: true };
  if (year) query.year = year;
  
  return this.find(query).populate('exam');
};

module.exports = mongoose.model('ExamDeadline', examDeadlineSchema);