const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Password not required for Google OAuth users
    },
    minlength: [6, 'Password must be at least 6 characters']
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allow null values and make them unique
  },
  avatar: {
    type: String // URL to profile picture
  },
  class: {
    type: String,
    enum: ['10', '12'],
    required: function() {
      return !this.googleId; // Not required initially for Google OAuth users
    }
  },
  state: {
    type: String,
    required: function() {
      return !this.googleId; // Not required initially for Google OAuth users
    },
    trim: true
  },
  // Stream information based on class
  stream: {
    type: String,
    enum: ['science_pcm', 'science_pcb', 'commerce', 'arts'],
    required: function() {
      return this.class === '10' || this.class === '12';
    }
  },
  // Field of interest (for Class 12 students)
  field: {
    type: String,
    enum: [
      // Science PCM fields
      'engineering_technology', 'architecture_design', 'defence_military', 'computer_it', 'pure_sciences_research',
      // Science PCB fields  
      'medicine', 'allied_health', 'biotechnology', 'veterinary_science', 'agriculture_environment',
      // Commerce fields
      'business_management', 'finance_accounting', 'economics_analytics', 'law_commerce', 'entrepreneurship',
      // Arts fields
      'social_sciences', 'psychology', 'journalism_media', 'fine_arts_design', 'law_arts', 'civil_services'
    ],
    required: function() {
      return this.class === '12' && this.stream;
    }
  },
  quizResults: [{
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz'
    },
    answers: [String],
    recommendations: {
      stream: String,
      explanation: String,
      confidence: Number
    },
    completedAt: {
      type: Date,
      default: Date.now
    }
  }],
  profile: {
    avatar: String,
    bio: String,
    achievements: [String]
  },
  bookmarks: {
    courses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    }],
    colleges: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'College'
    }],
    exams: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam'
    }]
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
