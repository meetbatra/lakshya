const mongoose = require('mongoose');
const Exam = require('./models/Exam');
const ExamDeadline = require('./models/ExamDeadline');
const Notification = require('./models/Notification');
const User = require('./models/User');
require('dotenv').config();

async function testNoPagination() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lakshya');
    console.log('Connected to MongoDB');
    
    // Test with one of our test users
    const user = await User.findOne({ email: 'arjun@test.com' });
    if (!user) {
      console.log('❌ Test user not found!');
      return;
    }
    
    console.log(`\n🧪 Testing notifications for ${user.name} (${user.stream})`);
    
    // Test the getUserNotifications method directly
    const result = await Notification.getUserNotifications(user._id, user.stream);
    
    console.log(`\n📊 Results:`);
    console.log(`   - Found ${result.notifications.length} notifications`);
    console.log(`   - Unread count: ${result.unreadCount}`);
    console.log(`   - No pagination object: ${!result.pagination ? '✅' : '❌'}`);
    
    console.log(`\n📋 Notifications:`);
    result.notifications.forEach((notif, index) => {
      console.log(`   ${index + 1}. ${notif.title}`);
      console.log(`      Exam: ${notif.examName} (${notif.examShortName})`);
      console.log(`      Priority: ${notif.priority}`);
      console.log(`      Read: ${notif.isRead}`);
      console.log(`      Created: ${notif.createdAt.toLocaleDateString()}`);
    });
    
    console.log('\n✅ No pagination test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDisconnected from MongoDB');
  }
}

testNoPagination();