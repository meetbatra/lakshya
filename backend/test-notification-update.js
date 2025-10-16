const mongoose = require('mongoose');
const NotificationService = require('./services/notificationService');
const Notification = require('./models/Notification');
const ExamDeadline = require('./models/ExamDeadline');
const Exam = require('./models/Exam');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lakshya', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function testNotificationUpdates() {
  try {
    console.log('🧪 Testing Notification Update and Cleanup Functionality');
    console.log('==================================================');

    // Step 1: Check initial notifications
    const initialNotifications = await Notification.find({}).populate('exam');
    console.log(`\n📊 Initial notification count: ${initialNotifications.length}`);
    
    if (initialNotifications.length > 0) {
      console.log('\n📋 Current notifications:');
      initialNotifications.forEach(notif => {
        console.log(`   - ${notif.exam?.name}: ${notif.type} (${notif.daysRemaining} days) - ${notif.deadlineDate.toLocaleDateString()}`);
      });
    }

    // Step 2: Test expired notification cleanup
    console.log('\n🧹 Testing expired notification cleanup...');
    const expiredResult = await NotificationService.cleanupExpiredDeadlineNotifications();
    console.log(`   ✅ Deleted ${expiredResult.deletedCount} expired notifications`);

    // Step 3: Run the notification creation/update process
    console.log('\n🔄 Running notification creation/update process...');
    await NotificationService.createExamDeadlineNotifications();

    // Step 4: Check notifications after update
    const updatedNotifications = await Notification.find({}).populate('exam');
    console.log(`\n📊 Updated notification count: ${updatedNotifications.length}`);
    
    if (updatedNotifications.length > 0) {
      console.log('\n📋 Updated notifications:');
      updatedNotifications.forEach(notif => {
        console.log(`   - ${notif.exam?.name}: ${notif.type} (${notif.daysRemaining} days) - ${notif.deadlineDate.toLocaleDateString()}`);
        console.log(`     Title: "${notif.title}"`);
        console.log(`     Message: "${notif.message}"`);
        console.log(`     Priority: ${notif.priority}`);
        console.log(`     Updated: ${notif.updatedAt?.toLocaleString() || 'Not updated'}`);
        console.log('');
      });
    }

    // Step 5: Test running the process again to see if it updates instead of duplicates
    console.log('\n🔄 Running notification process again to test update logic...');
    await NotificationService.createExamDeadlineNotifications();

    const finalNotifications = await Notification.find({}).populate('exam');
    console.log(`\n📊 Final notification count: ${finalNotifications.length}`);
    
    if (finalNotifications.length === updatedNotifications.length) {
      console.log('   ✅ No duplicates created - update logic working correctly!');
    } else {
      console.log('   ❌ Duplicates detected - update logic needs fixing');
    }

    // Step 6: Show some exam deadlines for context
    console.log('\n📅 Available exam deadlines for reference:');
    const examDeadlines = await ExamDeadline.find({}).populate('exam').limit(5);
    examDeadlines.forEach(deadline => {
      console.log(`   - ${deadline.exam?.name}:`);
      if (deadline.applicationEndDate) console.log(`     Application: ${deadline.applicationEndDate.toLocaleDateString()}`);
      if (deadline.examDate) console.log(`     Exam: ${deadline.examDate.toLocaleDateString()}`);
      if (deadline.admitCardDate) console.log(`     Admit Card: ${deadline.admitCardDate.toLocaleDateString()}`);
      if (deadline.resultDate) console.log(`     Result: ${deadline.resultDate.toLocaleDateString()}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error during testing:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n🔚 Test completed');
  }
}

// Run the test
testNotificationUpdates();