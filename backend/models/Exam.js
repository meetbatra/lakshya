const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Exam name is required'],
    trim: true
  },
  shortName: { 
    type: String,
    trim: true,
    uppercase: true
  },
  streams: [{ 
    type: String, 
    enum: ['science_pcm', 'science_pcb', 'commerce', 'arts']
  }],
  eligibility: { 
    type: String, 
    required: [true, 'Eligibility criteria is required'],
    trim: true
  },
  examMonth: { 
    type: String,
    trim: true
  },
  description: { 
    type: String,
    trim: true
  },
  syllabus: { 
    type: [String],
    default: []
  },
  officialLink: { 
    type: String,
    validate: {
      validator: function(v) {
        if (!v) return true; // Allow empty strings
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Please provide a valid URL'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better performance
examSchema.index({ name: 'text', shortName: 'text', description: 'text' });
examSchema.index({ streams: 1 });
examSchema.index({ examMonth: 1 });
examSchema.index({ isActive: 1 });

module.exports = mongoose.model('Exam', examSchema);