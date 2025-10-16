const mongoose = require('mongoose');
const NotificationService = require('./services/notificationService');
const Notification = require('./models/Notification');
const Exam = require('./models/Exam');
const ExamDeadline = require('./models/ExamDeadline');
const User = require('./models/User');

// Simple script to manually trigger notification creation for testing
async function testNotificationCreation() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lakshya');
    console.log('Connected to MongoDB');
    
    console.log('🔔 Running exam deadline notifications check manually...');
    await NotificationService.createExamDeadlineNotifications();
    console.log('✅ Notification creation completed!');
    
    // Get a count of notifications created
    const totalNotifications = await Notification.countDocuments();
    const urgentNotifications = await Notification.countDocuments({ priority: 'high' });
    
    console.log(`📊 Total notifications in database: ${totalNotifications}`);
    console.log(`🔴 High priority notifications: ${urgentNotifications}`);
    
    // Show recent notifications
    const recentNotifications = await Notification.find()
      .populate('exam', 'name shortName')
      .sort({ createdAt: -1 })
      .limit(10);
    
    console.log('\n📋 Recent notifications:');
    recentNotifications.forEach((notif, index) => {
      const priority = notif.priority === 'high' ? '🔴' : notif.priority === 'medium' ? '🟡' : '🟢';
      console.log(`${index + 1}. ${priority} ${notif.exam?.name || 'Unknown Exam'} - ${notif.type} (${notif.daysRemaining} days)`);
    });
    
  } catch (error) {
    console.error('❌ Error testing notification creation:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run the test
testNotificationCreation();