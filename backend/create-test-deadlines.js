const mongoose = require('mongoose');
const Exam = require('./models/Exam');
const ExamDeadline = require('./models/ExamDeadline');
const User = require('./models/User');
require('dotenv').config();

// Script to add test exam deadlines with short deadlines (under 3 days)
async function addTestDeadlines() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Create test exams if they don't exist
    const testExams = [
      {
        name: 'JEE Main 2025',
        shortName: 'JEE',
        description: 'Joint Entrance Examination - Main',
        streams: ['science_pcm'],
        eligibility: 'Class 12 passed with PCM',
        examMonth: 'January'
      },
      {
        name: 'NEET 2025',
        shortName: 'NEET',
        description: 'National Eligibility cum Entrance Test',
        streams: ['science_pcb'],
        eligibility: 'Class 12 passed with PCB',
        examMonth: 'May'
      },
      {
        name: 'CLAT 2025',
        shortName: 'CLAT',
        description: 'Common Law Admission Test',
        streams: ['arts', 'commerce'],
        eligibility: 'Class 12 passed',
        examMonth: 'December'
      },
      {
        name: 'GATE 2025',
        shortName: 'GATE',
        description: 'Graduate Aptitude Test in Engineering',
        streams: ['science_pcm'],
        eligibility: 'BE/B.Tech final year or passed',
        examMonth: 'February'
      }
    ];
    
    const createdExams = [];
    for (const examData of testExams) {
      let exam = await Exam.findOne({ shortName: examData.shortName });
      if (!exam) {
        exam = await Exam.create(examData);
        console.log(`✅ Created exam: ${exam.name}`);
      } else {
        console.log(`📍 Found existing exam: ${exam.name}`);
      }
      createdExams.push(exam);
    }
    
    // Create exam deadlines with short deadlines (1-3 days from now)
    const currentDate = new Date();
    
    const deadlineData = [
      {
        exam: createdExams[0]._id, // JEE Main
        applicationStartDate: new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        applicationEndDate: new Date(currentDate.getTime() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        examDate: new Date(currentDate.getTime() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        admitCardDate: new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        resultDate: new Date(currentDate.getTime() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
        year: 2025,
        notes: 'Test deadline for JEE Main 2025 - urgent notifications'
      },
      {
        exam: createdExams[1]._id, // NEET
        applicationStartDate: new Date(currentDate.getTime() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
        applicationEndDate: new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        examDate: new Date(currentDate.getTime() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
        admitCardDate: new Date(currentDate.getTime() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
        resultDate: new Date(currentDate.getTime() + 55 * 24 * 60 * 60 * 1000), // 55 days from now
        year: 2025,
        notes: 'Test deadline for NEET 2025 - medium priority notifications'
      },
      {
        exam: createdExams[2]._id, // CLAT
        applicationStartDate: new Date(currentDate.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        applicationEndDate: new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        examDate: new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        admitCardDate: new Date(currentDate.getTime() + 1 * 24 * 60 * 60 * 1000), // 1 day from now (HIGH PRIORITY)
        resultDate: new Date(currentDate.getTime() + 35 * 24 * 60 * 60 * 1000), // 35 days from now
        year: 2025,
        notes: 'Test deadline for CLAT 2025 - high priority notifications'
      },
      {
        exam: createdExams[3]._id, // GATE
        applicationStartDate: new Date(currentDate.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        applicationEndDate: new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        examDate: new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        admitCardDate: new Date(currentDate.getTime() + 0.5 * 24 * 60 * 60 * 1000), // 12 hours from now (URGENT!)
        resultDate: new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        year: 2025,
        notes: 'Test deadline for GATE 2025 - URGENT notifications for testing'
      }
    ];
    
    // Create exam deadlines
    for (const deadline of deadlineData) {
      let examDeadline = await ExamDeadline.findOne({ 
        exam: deadline.exam, 
        year: deadline.year 
      });
      
      if (!examDeadline) {
        examDeadline = await ExamDeadline.create(deadline);
        const exam = await Exam.findById(deadline.exam);
        console.log(`✅ Created deadline for: ${exam.name} ${deadline.year}`);
        console.log(`   - Application deadline: ${deadline.applicationEndDate.toLocaleDateString()} (${Math.ceil((deadline.applicationEndDate - currentDate) / (1000 * 60 * 60 * 24))} days)`);
        console.log(`   - Exam date: ${deadline.examDate.toLocaleDateString()} (${Math.ceil((deadline.examDate - currentDate) / (1000 * 60 * 60 * 24))} days)`);
        console.log(`   - Admit card: ${deadline.admitCardDate.toLocaleDateString()} (${Math.ceil((deadline.admitCardDate - currentDate) / (1000 * 60 * 60 * 24))} days)`);
      } else {
        const exam = await Exam.findById(deadline.exam);
        console.log(`📍 Found existing deadline for: ${exam.name} ${deadline.year}`);
      }
    }
    
    // Create some test users if they don't exist
    const testUsers = [
      {
        name: 'Arjun Sharma',
        email: 'arjun@test.com',
        password: 'testpass123',
        class: '12',
        state: 'Delhi',
        stream: 'science_pcm',
        field: 'engineering_technology'
      },
      {
        name: 'Priya Patel',
        email: 'priya@test.com',
        password: 'testpass123',
        class: '12',
        state: 'Gujarat',
        stream: 'science_pcb',
        field: 'medicine'
      },
      {
        name: 'Rahul Singh',
        email: 'rahul@test.com',
        password: 'testpass123',
        class: '12',
        state: 'Maharashtra',
        stream: 'arts',
        field: 'law_arts'
      }
    ];
    
    for (const userData of testUsers) {
      let user = await User.findOne({ email: userData.email });
      if (!user) {
        user = await User.create(userData);
        console.log(`✅ Created test user: ${user.name} (${user.stream})`);
      } else {
        console.log(`📍 Found existing user: ${user.name}`);
      }
    }
    
    console.log('\n🎉 Test exam deadlines and users created successfully!');
    console.log('\n📋 Summary of urgent deadlines (within 3 days):');
    
    // Show upcoming deadlines
    const upcomingDeadlines = await ExamDeadline.getUpcomingDeadlines(3);
    for (const deadline of upcomingDeadlines) {
      const exam = deadline.exam;
      console.log(`\n📅 ${exam.name}:`);
      
      const deadlines = [
        { type: 'application_deadline', date: deadline.applicationEndDate },
        { type: 'exam_date', date: deadline.examDate },
        { type: 'admit_card', date: deadline.admitCardDate },
        { type: 'result_date', date: deadline.resultDate }
      ];
      
      deadlines.forEach(d => {
        if (d.date) {
          const days = Math.ceil((d.date - currentDate) / (1000 * 60 * 60 * 24));
          if (days >= 0 && days <= 3) {
            const priority = days <= 1 ? '🔴 URGENT' : days <= 3 ? '🟡 HIGH' : '🟢 MEDIUM';
            console.log(`   ${priority} ${d.type}: ${d.date.toLocaleDateString()} (${days} days)`);
          }
        }
      });
    }
    
    console.log('\n✨ These deadlines will trigger notifications when the cron job runs!');
    
  } catch (error) {
    console.error('❌ Error creating test deadlines:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run the script
addTestDeadlines();