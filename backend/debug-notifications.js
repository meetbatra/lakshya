const mongoose = require('mongoose');
const Notification = require('./models/Notification');
const User = require('./models/User');
const Exam = require('./models/Exam');
const ExamDeadline = require('./models/ExamDeadline');

// Simple script to check if notifications exist for users
async function checkNotifications() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lakshya');
    console.log('Connected to MongoDB');
    
    // Get all users
    const users = await User.find().select('name email stream');
    console.log(`📊 Found ${users.length} users in database:`);
    users.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - ${user.stream}`);
    });
    
    // Get all notifications
    const notifications = await Notification.find()
      .populate('userId', 'name email')
      .populate('exam', 'name')
      .sort({ createdAt: -1 });
    
    console.log(`\n🔔 Found ${notifications.length} notifications in database:`);
    
    if (notifications.length === 0) {
      console.log('❌ No notifications found! This is likely the issue.');
      return;
    }
    
    // Group notifications by user
    const notificationsByUser = {};
    notifications.forEach(notif => {
      const userId = notif.userId?._id?.toString() || 'unknown';
      if (!notificationsByUser[userId]) {
        notificationsByUser[userId] = [];
      }
      notificationsByUser[userId].push(notif);
    });
    
    console.log('\n📋 Notifications by user:');
    Object.keys(notificationsByUser).forEach(userId => {
      const userNotifs = notificationsByUser[userId];
      const userName = userNotifs[0]?.userId?.name || 'Unknown User';
      console.log(`\n👤 ${userName} (${userId}):`);
      
      userNotifs.forEach((notif, index) => {
        const priority = notif.priority === 'high' ? '🔴' : notif.priority === 'medium' ? '🟡' : '🟢';
        const examName = notif.exam?.name || 'Unknown Exam';
        console.log(`  ${index + 1}. ${priority} ${examName} - ${notif.type} (${notif.daysRemaining} days)`);
      });
    });
    
    // Check recent notifications (last 24 hours)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const recentNotifications = await Notification.find({
      createdAt: { $gte: yesterday }
    });
    
    console.log(`\n⏰ Recent notifications (last 24 hours): ${recentNotifications.length}`);
    
    if (recentNotifications.length === 0) {
      console.log('⚠️  No recent notifications. Cron job might not be running or no upcoming deadlines.');
    }
    
  } catch (error) {
    console.error('❌ Error checking notifications:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run the check
checkNotifications();