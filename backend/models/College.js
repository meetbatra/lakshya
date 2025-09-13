const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'College name is required'],
    trim: true
  },
  shortName: {
    type: String,
    trim: true,
    uppercase: true
  },
  type: {
    type: String,
    enum: ['government', 'private', 'deemed', 'autonomous'],
    required: [true, 'College type is required']
  },
  location: {
    address: {
      type: String,
      required: [true, 'College address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    pincode: {
      type: String,
      match: [/^\d{6}$/, 'Please provide a valid pincode']
    },
  },
  contact: {
    phone: [String],
    email: [String],
    website: String,
  },
  courses: [{
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    courseName: String,
    
  }],
  images: [String],
  isActive: {
    type: Boolean,
    default: true
  },
}, {
  timestamps: true
});

// Indexes for better performance
collegeSchema.index({ 'location.state': 1, 'location.city': 1 });
collegeSchema.index({ type: 1 });
collegeSchema.index({ 'courses.courseName': 1 });
collegeSchema.index({ 'affiliation.rankings.rank': 1 });
collegeSchema.index({ name: 'text', 'location.city': 'text', 'location.state': 'text' });

module.exports = mongoose.model('College', collegeSchema);
