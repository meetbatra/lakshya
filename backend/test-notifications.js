const mongoose = require('mongoose');
const Exam = require('./models/Exam');
const ExamDeadline = require('./models/ExamDeadline');
const Notification = require('./models/Notification');
const User = require('./models/User');
const notificationService = require('./services/notificationService');
require('dotenv').config();

async function testNotifications() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lakshya');
    console.log('Connected to MongoDB');
    
    // Run the notification service
    console.log('🔔 Creating exam deadline notifications...');
    await notificationService.createExamDeadlineNotifications();
    console.log('✅ Notification creation completed');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
}

testNotifications();