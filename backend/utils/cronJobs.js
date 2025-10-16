const cron = require('node-cron');
const NotificationService = require('../services/notificationService');

class CronJobs {
  /**
   * Initialize all cron jobs
   */
  static init() {
    console.log('🕐 Initializing cron jobs...');
    
    // Run exam deadline notifications every day at midnight
    this.scheduleExamDeadlineCheck();
    
    // Clean up old notifications every Sunday at 2 AM
    this.scheduleNotificationCleanup();
    
    console.log('✅ Cron jobs initialized successfully');
  }

  /**
   * Schedule exam deadline notifications check and cleanup
   * Runs every 3 minutes for testing (change to '0 0 * * *' for daily at midnight in production)
   */
  static scheduleExamDeadlineCheck() {
    cron.schedule('*/3 * * * *', async () => {
      try {
        console.log('🔔 Running exam deadline notifications check and cleanup...');
        await NotificationService.createExamDeadlineNotifications();
        console.log('✅ Exam deadline notifications and cleanup processed successfully');
      } catch (error) {
        console.error('❌ Error in exam deadline cron job:', error);
      }
    }, {
      timezone: 'Asia/Kolkata' // Adjust timezone as needed
    });

    console.log('⏰ Exam deadline notifications and cleanup scheduled (every 3 minutes for testing)');
  }

  /**
   * Schedule notification cleanup
   * Runs every Sunday at 02:00 AM
   */
  static scheduleNotificationCleanup() {
    cron.schedule('0 2 * * 0', async () => {
      try {
        console.log('🧹 Running notification cleanup...');
        const result = await NotificationService.cleanupOldNotifications();
        
        if (result.success) {
          console.log(`✅ ${result.message}`);
        } else {
          console.error('❌ Failed to cleanup notifications:', result.message);
        }
      } catch (error) {
        console.error('❌ Error in notification cleanup cron job:', error);
      }
    }, {
      timezone: 'Asia/Kolkata'
    });

    console.log('🧹 Notification cleanup scheduled (weekly on Sunday at 2 AM)');
  }

  /**
   * Schedule a one-time job for testing (runs in 1 minute)
   */
  static scheduleTestJob() {
    const now = new Date();
    const testTime = new Date(now.getTime() + 60000); // 1 minute from now
    const minutes = testTime.getMinutes();
    const hours = testTime.getHours();
    
    cron.schedule(`${minutes} ${hours} * * *`, async () => {
      try {
        console.log('🧪 Running test exam deadline notifications...');
        const result = await NotificationService.createExamDeadlineNotifications();
        
        if (result.success) {
          console.log(`✅ Test job completed: ${result.message}`);
        } else {
          console.error('❌ Test job failed:', result.message);
        }
      } catch (error) {
        console.error('❌ Error in test cron job:', error);
      }
    }, {
      timezone: 'Asia/Kolkata'
    });

    console.log(`🧪 Test job scheduled for ${testTime.toLocaleTimeString()}`);
  }

  /**
   * Stop all cron jobs
   */
  static stopAll() {
    cron.getTasks().forEach((task) => {
      task.stop();
    });
    console.log('🛑 All cron jobs stopped');
  }

  /**
   * Get status of all cron jobs
   */
  static getStatus() {
    const tasks = cron.getTasks();
    console.log(`📊 Active cron jobs: ${tasks.size}`);
    
    tasks.forEach((task, name) => {
      console.log(`  - ${name}: ${task.isRunning() ? 'Running' : 'Stopped'}`);
    });
  }
}

module.exports = CronJobs;