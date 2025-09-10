const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Course name is required'],
    trim: true,
    unique: true
  },
  shortName: {
    type: String,
    required: [true, 'Course short name is required'],
    trim: true,
    uppercase: true
  },
  stream: {
    type: String,
    enum: ['science', 'commerce', 'arts', 'engineering', 'medical', 'management', 'law', 'other'],
    required: [true, 'Stream is required']
  },
  level: {
    type: String,
    enum: ['undergraduate', 'postgraduate', 'diploma', 'certificate'],
    required: [true, 'Course level is required']
  },
  duration: {
    years: {
      type: Number,
      required: [true, 'Course duration is required'],
      min: 1,
      max: 6
    },
    months: {
      type: Number,
      default: 0,
      min: 0,
      max: 11
    }
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    trim: true
  },
  eligibility: {
    minimumClass: {
      type: String,
      enum: ['10', '12', 'graduate'],
      required: [true, 'Minimum class requirement is required']
    },
    requiredSubjects: [String],
    minimumPercentage: {
      type: Number,
      min: 0,
      max: 100
    },
    entranceExams: [String]
  },
  careerOptions: [{
    jobTitle: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    averageSalary: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'INR'
      }
    },
    growthProspects: {
      type: String,
      enum: ['excellent', 'good', 'average', 'limited'],
      default: 'good'
    },
    sector: {
      type: String,
      enum: ['government', 'private', 'both'],
      default: 'both'
    }
  }],
  higherStudyOptions: [{
    courseName: String,
    description: String,
    duration: String
  }],
  topColleges: [{
    name: String,
    type: {
      type: String,
      enum: ['government', 'private', 'deemed']
    },
    location: String,
    ranking: Number
  }],
  skills: {
    technical: [String],
    soft: [String]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  popularity: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Indexes for better performance
courseSchema.index({ stream: 1, level: 1 });
courseSchema.index({ 'eligibility.minimumClass': 1 });
courseSchema.index({ popularity: -1 });
courseSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Course', courseSchema);
