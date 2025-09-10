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
  affiliation: {
    university: String,
    accreditation: [String], // NAAC, NBA etc.
    rankings: [{
      agency: String, // NIRF, Times, etc.
      rank: Number,
      year: Number,
      category: String
    }]
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
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  contact: {
    phone: [String],
    email: [String],
    website: String,
    socialMedia: {
      facebook: String,
      twitter: String,
      linkedin: String,
      instagram: String
    }
  },
  courses: [{
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    courseName: String,
    fees: {
      annual: Number,
      total: Number,
      currency: {
        type: String,
        default: 'INR'
      }
    },
    seats: {
      total: Number,
      reserved: {
        sc: Number,
        st: Number,
        obc: Number,
        ews: Number
      }
    },
    cutoff: {
      general: Number,
      sc: Number,
      st: Number,
      obc: Number,
      ews: Number,
      year: Number
    }
  }],
  facilities: {
    hostel: {
      available: {
        type: Boolean,
        default: false
      },
      capacity: Number,
      fees: Number
    },
    library: {
      available: {
        type: Boolean,
        default: false
      },
      books: Number,
      digitalResources: Boolean
    },
    labs: [{
      name: String,
      equipment: [String],
      capacity: Number
    }],
    sports: {
      available: {
        type: Boolean,
        default: false
      },
      facilities: [String]
    },
    canteen: {
      type: Boolean,
      default: false
    },
    transport: {
      available: {
        type: Boolean,
        default: false
      },
      routes: [String]
    },
    wifi: {
      type: Boolean,
      default: false
    },
    medical: {
      type: Boolean,
      default: false
    }
  },
  admission: {
    process: String,
    entranceExams: [String],
    applicationDeadline: Date,
    sessionStart: Date,
    documents: [String]
  },
  placement: {
    percentage: Number,
    averagePackage: Number,
    highestPackage: Number,
    topRecruiters: [String],
    year: Number
  },
  reviews: [{
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  images: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  verified: {
    type: Boolean,
    default: false
  }
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
