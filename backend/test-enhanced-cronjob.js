const mongoose = require('mongoose');
const NotificationService = require('./services/notificationService');
const Notification = require('./models/Notification');
const Exam = require('./models/Exam');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lakshya');

async function testCronJobFunctionality() {
  try {
    console.log('🧪 Testing Enhanced Cron Job Functionality');
    console.log('==========================================');

    // Create some expired notifications for testing
    const testExam = await Exam.findOne();
    if (!testExam) {
      console.log('❌ No exam found for testing');
      return;
    }

    console.log('🎯 Creating test expired notifications...');
    
    // Create 2 expired notifications
    const pastDates = [
      new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)  // 2 days ago
    ];

    for (let i = 0; i < pastDates.length; i++) {
      const expiredNotification = new Notification({
        exam: testExam._id,
        examDeadline: testExam._id,
        type: 'application_deadline',
        title: `Expired Test Notification ${i + 1}`,
        message: `This notification should be deleted (${i + 1})`,
        deadlineDate: pastDates[i],
        daysRemaining: -Math.ceil((Date.now() - pastDates[i]) / (1000 * 60 * 60 * 24)),
        priority: 'medium',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      });

      await expiredNotification.save();
      console.log(`   ✅ Created expired notification ${i + 1} with deadline: ${pastDates[i].toLocaleDateString()}`);
    }

    // Check notification count before
    const beforeCount = await Notification.countDocuments();
    console.log(`\n📊 Total notifications before cron job: ${beforeCount}`);

    // Simulate the cron job execution
    console.log('\n🔄 Simulating cron job execution...');
    console.log('🔔 Running exam deadline notifications check and cleanup...');
    
    await NotificationService.createExamDeadlineNotifications();
    
    console.log('✅ Exam deadline notifications and cleanup processed successfully');

    // Check notification count after
    const afterCount = await Notification.countDocuments();
    console.log(`\n📊 Total notifications after cron job: ${afterCount}`);

    const cleanedCount = beforeCount - afterCount;
    if (cleanedCount > 0) {
      console.log(`🧹 Successfully cleaned up ${cleanedCount} expired notifications`);
    }

    // Show current notifications
    console.log('\n📋 Current notifications:');
    const currentNotifications = await Notification.find({}).populate('exam').sort({ deadlineDate: 1 });
    
    currentNotifications.forEach(notif => {
      const isPast = notif.deadlineDate < new Date();
      const statusIcon = isPast ? '🔴' : '🟢';
      console.log(`   ${statusIcon} ${notif.exam?.name}: ${notif.type} - ${notif.deadlineDate.toLocaleDateString()} (${notif.daysRemaining} days)`);
    });

    // Verify no expired notifications remain
    const expiredCount = await Notification.countDocuments({
      deadlineDate: { $lt: new Date() }
    });

    if (expiredCount === 0) {
      console.log('\n✅ All expired notifications successfully cleaned up!');
    } else {
      console.log(`\n⚠️ ${expiredCount} expired notifications still remain`);
    }

  } catch (error) {
    console.error('❌ Error during testing:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n🔚 Test completed');
  }
}

// Run the test
testCronJobFunctionality();