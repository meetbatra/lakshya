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
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  class: {
    type: String,
    enum: ['10', '12', 'graduate'],
    required: [true, 'Class information is required']
  },
  state: {
    type: String,
    required: [true, 'State is required'],
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
      'engineering', 'architecture', 'pure_sciences', 'computer_science',
      // Science PCB fields  
      'medicine', 'dentistry', 'pharmacy', 'biotechnology', 'nursing',
      // Commerce fields
      'ca', 'cs', 'bcom', 'bba', 'economics',
      // Arts fields
      'ba', 'journalism', 'psychology', 'sociology', 'literature'
    ],
    required: function() {
      return this.class === '12' && this.stream;
    }
  },
  preferences: {
    interestedStreams: [String],
    careerGoals: [String],
    studyPreference: {
      type: String,
      enum: ['government', 'private', 'both'],
      default: 'both'
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
