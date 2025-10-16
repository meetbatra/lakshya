const mongoose = require('mongoose');
const NotificationService = require('./services/notificationService');
const Notification = require('./models/Notification');
const Exam = require('./models/Exam');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lakshya');

async function testExpiredNotificationCleanup() {
  try {
    console.log('🧪 Testing Expired Notification Cleanup');
    console.log('=====================================');

    // Create a test notification with an expired deadline
    const testExam = await Exam.findOne();
    if (!testExam) {
      console.log('❌ No exam found for testing');
      return;
    }

    // Create a notification with deadline date in the past
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 5); // 5 days ago

    const expiredNotification = new Notification({
      exam: testExam._id,
      examDeadline: testExam._id, // Using exam ID as placeholder
      type: 'application_deadline',
      title: 'Expired Test Notification',
      message: 'This notification should be deleted',
      deadlineDate: pastDate,
      daysRemaining: -5,
      priority: 'medium',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    });

    await expiredNotification.save();
    console.log(`✅ Created test expired notification with deadline: ${pastDate.toLocaleDateString()}`);

    // Check current notification count
    const beforeCount = await Notification.countDocuments();
    console.log(`📊 Notifications before cleanup: ${beforeCount}`);

    // Run cleanup
    console.log('\n🧹 Running expired notification cleanup...');
    const result = await NotificationService.cleanupExpiredDeadlineNotifications();
    console.log(`   ✅ Deleted ${result.deletedCount} expired notifications`);

    // Check notification count after cleanup
    const afterCount = await Notification.countDocuments();
    console.log(`📊 Notifications after cleanup: ${afterCount}`);

    if (afterCount < beforeCount) {
      console.log('✅ Expired notification cleanup working correctly!');
    } else {
      console.log('⚠️ No notifications were cleaned up');
    }

    // Show remaining notifications
    const remainingNotifications = await Notification.find({}).populate('exam');
    console.log('\n📋 Remaining notifications:');
    remainingNotifications.forEach(notif => {
      const isPast = notif.deadlineDate < new Date();
      console.log(`   - ${notif.exam?.name}: ${notif.type} - ${notif.deadlineDate.toLocaleDateString()} ${isPast ? '(PAST)' : '(FUTURE)'}`);
    });

  } catch (error) {
    console.error('❌ Error during testing:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n🔚 Test completed');
  }
}

// Run the test
testExpiredNotificationCleanup();