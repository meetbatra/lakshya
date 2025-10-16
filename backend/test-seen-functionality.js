const mongoose = require('mongoose');
const Exam = require('./models/Exam');
const ExamDeadline = require('./models/ExamDeadline');
const Notification = require('./models/Notification');
const User = require('./models/User');
require('dotenv').config();

async function testSeenFunctionality() {
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
    
    console.log(`\n🧪 Testing seen functionality for ${user.name} (${user.stream})`);
    
    // Get all notifications for this user
    const result = await Notification.getUserNotifications(user._id, user.stream);
    
    console.log(`\n📊 Initial State:`);
    console.log(`   - Found ${result.notifications.length} notifications`);
    console.log(`   - Unread count: ${result.unreadCount}`);
    console.log(`   - Unseen count: ${result.unseenCount}`);
    
    console.log(`\n📋 Notification Status:`);
    result.notifications.forEach((notif, index) => {
      console.log(`   ${index + 1}. ${notif.title}`);
      console.log(`      Read: ${notif.isRead}, Seen: ${notif.isSeen}`);
    });
    
    // Test marking all as seen
    if (result.notifications.length > 0) {
      console.log(`\n👁️ Marking all notifications as seen...`);
      const seenCount = await Notification.markAllAsSeen(user._id, user.stream);
      console.log(`   ✅ Marked ${seenCount} notifications as seen`);
      
      // Check the updated state
      const updatedResult = await Notification.getUserNotifications(user._id, user.stream);
      console.log(`\n📊 After Marking as Seen:`);
      console.log(`   - Unread count: ${updatedResult.unreadCount}`);
      console.log(`   - Unseen count: ${updatedResult.unseenCount}`);
      
      console.log(`\n📋 Updated Notification Status:`);
      updatedResult.notifications.forEach((notif, index) => {
        console.log(`   ${index + 1}. ${notif.title}`);
        console.log(`      Read: ${notif.isRead}, Seen: ${notif.isSeen}`);
      });
      
      // Test marking one as read
      if (updatedResult.notifications.length > 0) {
        const firstNotif = updatedResult.notifications[0];
        console.log(`\n✅ Marking first notification as read...`);
        await Notification.markAsRead(firstNotif._id, user._id);
        
        const finalResult = await Notification.getUserNotifications(user._id, user.stream);
        console.log(`\n📊 Final State:`);
        console.log(`   - Unread count: ${finalResult.unreadCount}`);
        console.log(`   - Unseen count: ${finalResult.unseenCount}`);
        
        console.log(`\n📋 Final Notification Status:`);
        finalResult.notifications.forEach((notif, index) => {
          console.log(`   ${index + 1}. ${notif.title}`);
          console.log(`      Read: ${notif.isRead}, Seen: ${notif.isSeen}`);
        });
      }
    }
    
    console.log('\n✅ Seen functionality test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDisconnected from MongoDB');
  }
}

testSeenFunctionality();