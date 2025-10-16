const mongoose = require('mongoose');
const Exam = require('./models/Exam');
const ExamDeadline = require('./models/ExamDeadline');
const Notification = require('./models/Notification');
const User = require('./models/User');
require('dotenv').config();

async function testCompleteSeenSystem() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lakshya');
    console.log('Connected to MongoDB');
    
    // Get test users with different streams
    const users = await User.find({ email: { $regex: '@test.com$' } }).sort({ name: 1 });
    
    if (users.length === 0) {
      console.log('❌ No test users found!');
      return;
    }
    
    console.log(`\n🧪 Testing complete seen system with ${users.length} test users\n`);
    
    for (const user of users) {
      console.log(`\n👤 Testing for ${user.name} (${user.stream}):`);
      console.log('='.repeat(50));
      
      // 1. Get initial state
      const initialResult = await Notification.getUserNotifications(user._id, user.stream);
      console.log(`\n📊 Initial State:`);
      console.log(`   - Notifications: ${initialResult.notifications.length}`);
      console.log(`   - Unread count: ${initialResult.unreadCount}`);
      console.log(`   - Unseen count: ${initialResult.unseenCount}`);
      
      if (initialResult.notifications.length > 0) {
        console.log(`\n📋 Notification Details:`);
        initialResult.notifications.forEach((notif, index) => {
          const status = !notif.isSeen ? '🔵 UNSEEN' : !notif.isRead ? '⚪ SEEN' : '✅ READ';
          console.log(`   ${index + 1}. ${status} ${notif.title}`);
        });
        
        // 2. Simulate opening notification center (mark all as seen)
        console.log(`\n👁️ Simulating opening notification center...`);
        const seenCount = await Notification.markAllAsSeen(user._id, user.stream);
        console.log(`   ✅ Marked ${seenCount} notifications as seen`);
        
        // 3. Check state after seeing
        const seenResult = await Notification.getUserNotifications(user._id, user.stream);
        console.log(`\n📊 After Opening Notification Center:`);
        console.log(`   - Unread count: ${seenResult.unreadCount}`);
        console.log(`   - Unseen count: ${seenResult.unseenCount}`);
        
        // 4. Simulate marking one as read
        if (seenResult.notifications.length > 0) {
          const firstNotif = seenResult.notifications[0];
          console.log(`\n✅ Marking "${firstNotif.title}" as read...`);
          await Notification.markAsRead(firstNotif._id, user._id);
          
          // 5. Final state
          const finalResult = await Notification.getUserNotifications(user._id, user.stream);
          console.log(`\n📊 Final State:`);
          console.log(`   - Unread count: ${finalResult.unreadCount}`);
          console.log(`   - Unseen count: ${finalResult.unseenCount}`);
          
          console.log(`\n📋 Final Status Summary:`);
          finalResult.notifications.forEach((notif, index) => {
            const status = !notif.isSeen ? '🔵 UNSEEN' : !notif.isRead ? '⚪ SEEN' : '✅ READ';
            console.log(`   ${index + 1}. ${status} ${notif.title}`);
          });
        }
      } else {
        console.log(`   ℹ️ No notifications for this user's stream`);
      }
    }
    
    console.log('\n🎉 Complete seen system test completed successfully!');
    console.log('\n💡 Visual Status Legend:');
    console.log('   🔵 UNSEEN   - Blue background with border (high visibility)');
    console.log('   ⚪ SEEN     - White background (normal visibility)');
    console.log('   ✅ READ     - Light gray background (subtle visibility)');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDisconnected from MongoDB');
  }
}

testCompleteSeenSystem();