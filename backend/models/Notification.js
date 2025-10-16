const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: [true, 'Exam reference is required']
  },
  examDeadline: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExamDeadline',
    required: [true, 'Exam deadline reference is required']
  },
  type: {
    type: String,
    enum: ['application_deadline', 'exam_date', 'admit_card', 'result_date'],
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  deadlineDate: {
    type: Date,
    required: true,
    index: true
  },
  daysRemaining: {
    type: Number,
    required: true,
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    index: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  // Track which users have read this notification
  readBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Track which users have deleted this notification
  deletedBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    deletedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Compound indexes for efficient queries
notificationSchema.index({ exam: 1, type: 1, deadlineDate: 1 }, { unique: true }); // Prevent duplicate notifications
notificationSchema.index({ type: 1, deadlineDate: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

// Virtual for formatted time
notificationSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diff = now - this.createdAt;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return this.createdAt.toLocaleDateString();
});

// Virtual for action URL
notificationSchema.virtual('actionUrl').get(function() {
  return `/exams/${this.exam}`;
});

// Virtual for icon based on type and priority
notificationSchema.virtual('icon').get(function() {
  const iconMap = {
    application_deadline: '📝',
    exam_date: '📅',
    admit_card: '🎫',
    result_date: '📊'
  };
  return iconMap[this.type] || '🔔';
});

// Static method to create exam deadline notifications (generic, not user-specific)
notificationSchema.statics.createExamDeadlineNotification = async function({
  examId,
  examDeadlineId,
  type,
  deadlineDate
}) {
  const ExamDeadline = mongoose.model('ExamDeadline');
  const Exam = mongoose.model('Exam');
  
  // Get exam deadline details
  const examDeadline = await ExamDeadline.findById(examDeadlineId).populate('exam');
  if (!examDeadline) {
    throw new Error('Exam deadline not found');
  }
  
  const exam = examDeadline.exam;
  const daysRemaining = Math.ceil((deadlineDate - new Date()) / (1000 * 60 * 60 * 24));
  
  let title, message;
  
  switch (type) {
    case 'application_deadline':
      title = `${exam.name} - Application Deadline Approaching`;
      message = `Only ${daysRemaining} days left to apply for ${exam.name}. Don't miss out!`;
      break;
    case 'exam_date':
      title = `${exam.name} - Exam Date Approaching`;
      message = `${exam.name} exam is scheduled in ${daysRemaining} days. Start your final preparations!`;
      break;
    case 'admit_card':
      title = `${exam.name} - Admit Card Available`;
      message = `Admit card for ${exam.name} is now available. Download it before the exam!`;
      break;
    case 'result_date':
      title = `${exam.name} - Results Expected`;
      message = `Results for ${exam.name} are expected to be announced in ${daysRemaining} days.`;
      break;
    default:
      title = `${exam.name} - Important Update`;
      message = `Important deadline approaching for ${exam.name} in ${daysRemaining} days.`;
  }
  
  // Set expiration date (30 days after deadline)
  const expiresAt = new Date(deadlineDate);
  expiresAt.setDate(expiresAt.getDate() + 30);
  
  const notification = new this({
    title,
    message,
    type,
    exam: examId,
    examDeadline: examDeadlineId,
    deadlineDate,
    daysRemaining,
    expiresAt,
    priority: daysRemaining <= 3 ? 'high' : daysRemaining <= 7 ? 'medium' : 'low'
  });
  
  await notification.save();
  return notification;
};

// Static method to get notifications for a user based on their stream
notificationSchema.statics.getUserNotifications = async function(userId, userStream, options = {}) {
  const {
    unreadOnly = false,
    type = null
  } = options;
  
  // Build match criteria
  const matchCriteria = {
    // Only get notifications that are not expired
    expiresAt: { $gt: new Date() },
    // Only get notifications that this user hasn't deleted
    'deletedBy.userId': { $ne: userId }
  };
  
  // Filter by type if specified
  if (type) {
    matchCriteria.type = type;
  }
  
  // Aggregation pipeline to filter by user stream and add read status
  const pipeline = [
    // First, lookup exam details to get streams
    {
      $lookup: {
        from: 'exams',
        localField: 'exam',
        foreignField: '_id',
        as: 'examDetails'
      }
    },
    {
      $unwind: '$examDetails'
    },
    // Filter notifications where user's stream matches exam streams
    {
      $match: {
        ...matchCriteria,
        'examDetails.streams': { $in: [userStream] }
      }
    },
    // Add read status for this specific user
    {
      $addFields: {
        isRead: {
          $in: [userId, { $ifNull: ['$readBy.userId', []] }]
        },
        readAt: {
          $let: {
            vars: {
              readRecord: {
                $filter: {
                  input: { $ifNull: ['$readBy', []] },
                  cond: { $eq: ['$$this.userId', userId] }
                }
              }
            },
            in: { $arrayElemAt: ['$$readRecord.readAt', 0] }
          }
        }
      }
    },
    // Filter by read status if requested
    ...(unreadOnly ? [{ $match: { isRead: false } }] : []),
    // Sort by priority and creation date
    {
      $sort: {
        priority: 1, // high priority first (assuming 'high' comes before 'low' alphabetically)
        createdAt: -1
      }
    },
    // Clean up the output
    {
      $project: {
        _id: 1,
        title: 1,
        message: 1,
        type: 1,
        exam: '$examDetails._id',
        examName: '$examDetails.name',
        examShortName: '$examDetails.shortName',
        deadlineDate: 1,
        daysRemaining: 1,
        priority: 1,
        createdAt: 1,
        isRead: 1,
        readAt: 1,
        icon: 1,
        actionUrl: 1
      }
    }
  ];
  
  const notifications = await this.aggregate(pipeline);
  
  return {
    notifications,
    unreadCount: await this.getUnreadCount(userId, userStream)
  };
};

// Static method to get unread count for a user based on their stream
notificationSchema.statics.getUnreadCount = async function(userId, userStream) {
  const pipeline = [
    {
      $lookup: {
        from: 'exams',
        localField: 'exam',
        foreignField: '_id',
        as: 'examDetails'
      }
    },
    {
      $unwind: '$examDetails'
    },
    {
      $match: {
        // Only get notifications that are not expired
        expiresAt: { $gt: new Date() },
        // Only get notifications that this user hasn't deleted
        'deletedBy.userId': { $ne: userId },
        // Only get notifications for user's stream
        'examDetails.streams': { $in: [userStream] }
      }
    },
    {
      $addFields: {
        isRead: {
          $in: [userId, { $ifNull: ['$readBy.userId', []] }]
        }
      }
    },
    {
      $match: {
        isRead: false
      }
    },
    {
      $count: 'unreadCount'
    }
  ];
  
  const result = await this.aggregate(pipeline);
  return result[0]?.unreadCount || 0;
};

// Static method to mark notification as read for a user
notificationSchema.statics.markAsRead = async function(notificationId, userId) {
  const result = await this.updateOne(
    { 
      _id: notificationId,
      'readBy.userId': { $ne: userId } // Only update if not already read
    },
    {
      $push: {
        readBy: {
          userId: userId,
          readAt: new Date()
        }
      }
    }
  );
  
  return result.modifiedCount > 0;
};

// Static method to mark notification as deleted for a user
notificationSchema.statics.markAsDeleted = async function(notificationId, userId) {
  const result = await this.updateOne(
    {
      _id: notificationId,
      'deletedBy.userId': { $ne: userId } // Only update if not already deleted
    },
    {
      $push: {
        deletedBy: {
          userId: userId,
          deletedAt: new Date()
        }
      }
    }
  );
  
  return result.modifiedCount > 0;
};

// Static method to mark all notifications as read for a user
notificationSchema.statics.markAllAsRead = async function(userId, userStream) {
  // Get all notification IDs that the user can see and hasn't read
  const pipeline = [
    {
      $lookup: {
        from: 'exams',
        localField: 'exam',
        foreignField: '_id',
        as: 'examDetails'
      }
    },
    {
      $unwind: '$examDetails'
    },
    {
      $match: {
        expiresAt: { $gt: new Date() },
        'deletedBy.userId': { $ne: userId },
        'examDetails.streams': { $in: [userStream] }
      }
    },
    {
      $addFields: {
        isRead: {
          $in: [userId, '$readBy.userId']
        }
      }
    },
    {
      $match: {
        isRead: false
      }
    },
    {
      $project: {
        _id: 1
      }
    }
  ];
  
  const unreadNotifications = await this.aggregate(pipeline);
  const notificationIds = unreadNotifications.map(n => n._id);
  
  if (notificationIds.length === 0) {
    return 0;
  }
  
  // Mark all unread notifications as read
  const result = await this.updateMany(
    {
      _id: { $in: notificationIds },
      'readBy.userId': { $ne: userId }
    },
    {
      $push: {
        readBy: {
          userId: userId,
          readAt: new Date()
        }
      }
    }
  );
  
  return result.modifiedCount;
};

// Method to mark as read
notificationSchema.methods.markAsRead = async function() {
  this.isRead = true;
  return await this.save();
};

// Method to soft delete
notificationSchema.methods.softDelete = async function() {
  this.isDeleted = true;
  return await this.save();
};

// Ensure virtuals are included in JSON
notificationSchema.set('toJSON', { virtuals: true });
notificationSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Notification', notificationSchema);