const mongoose = require('mongoose');
const Exam = require('./models/Exam');
const ExamDeadline = require('./models/ExamDeadline');
const Notification = require('./models/Notification');
const User = require('./models/User');
require('dotenv').config();

async function checkNotifications() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lakshya');
    console.log('Connected to MongoDB');
    
    // Check all notifications
    const notifications = await Notification.find({}).populate('exam').sort({ createdAt: -1 });
    console.log(`\n📋 Found ${notifications.length} notifications in database:`);
    
    notifications.forEach((notification, index) => {
      console.log(`\n${index + 1}. ${notification.title}`);
      console.log(`   Type: ${notification.type}`);
      console.log(`   Exam: ${notification.exam.name} (${notification.exam.shortName})`);
      console.log(`   Streams: ${notification.exam.streams.join(', ')}`);
      console.log(`   Message: ${notification.message}`);
      console.log(`   Priority: ${notification.priority}`);
      console.log(`   Created: ${notification.createdAt.toLocaleString()}`);
    });
    
    // Check test users and their streams
    const users = await User.find({ email: { $regex: '@test.com$' } });
    console.log(`\n👥 Found ${users.length} test users:`);
    
    users.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) - Stream: ${user.stream}`);
    });
    
    // Test notification filtering for each user
    for (const user of users) {
      console.log(`\n🔍 Checking notifications for ${user.name} (${user.stream}):`);
      
      // Use the same logic as in notificationService
      const userNotifications = await Notification.aggregate([
        {
          $lookup: {
            from: 'exams',
            localField: 'exam',
            foreignField: '_id',
            as: 'exam'
          }
        },
        {
          $unwind: '$exam'
        },
        {
          $match: {
            'exam.streams': { $in: [user.stream] },
            deletedBy: { $ne: user._id }
          }
        },
        {
          $addFields: {
            isRead: { $in: [user._id, '$readBy'] }
          }
        },
        {
          $sort: { createdAt: -1 }
        }
      ]);
      
      console.log(`   Found ${userNotifications.length} notifications for this user:`);
      userNotifications.forEach((notif, idx) => {
        console.log(`     ${idx + 1}. ${notif.title} (${notif.priority}) - Read: ${notif.isRead}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDisconnected from MongoDB');
  }
}

checkNotifications();