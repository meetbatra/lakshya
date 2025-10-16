const mongoose = require('mongoose');
const User = require('./models/User');
const Exam = require('./models/Exam');
const ExamDeadline = require('./models/ExamDeadline');
require('dotenv').config();

async function addRealDeadlines() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lakshya');
    console.log('Connected to MongoDB');
    
    // First, clear existing exam deadlines for clean testing
    await ExamDeadline.deleteMany({});
    console.log('✅ Cleared existing exam deadlines');
    
    // Fetch real exams from the database
    const realExams = await Exam.find({}).sort({ name: 1 });
    
    if (realExams.length === 0) {
      console.log('❌ No exams found in database! Please run init-exams.js first to populate exam data.');
      return;
    }
    
    console.log(`📚 Found ${realExams.length} real exams in database:`);
    realExams.forEach(exam => {
      console.log(`   - ${exam.name} (${exam.shortName}) - Streams: ${exam.streams.join(', ')}`);
    });
    
    // Select a subset of exams for testing (different streams)
    const selectedExams = [];
    
    // Get one science_pcm exam (engineering)
    const sciencePCMExam = realExams.find(exam => exam.streams.includes('science_pcm'));
    if (sciencePCMExam) selectedExams.push(sciencePCMExam);
    
    // Get one science_pcb exam (medical)
    const sciencePCBExam = realExams.find(exam => exam.streams.includes('science_pcb') && !exam.streams.includes('science_pcm'));
    if (sciencePCBExam) selectedExams.push(sciencePCBExam);
    
    // Get one arts exam
    const artsExam = realExams.find(exam => exam.streams.includes('arts'));
    if (artsExam) selectedExams.push(artsExam);
    
    // Get one commerce exam
    const commerceExam = realExams.find(exam => exam.streams.includes('commerce'));
    if (commerceExam) selectedExams.push(commerceExam);
    
    // If we don't have enough variety, add more exams
    while (selectedExams.length < 4 && selectedExams.length < realExams.length) {
      const remainingExams = realExams.filter(exam => !selectedExams.find(selected => selected._id.toString() === exam._id.toString()));
      if (remainingExams.length > 0) {
        selectedExams.push(remainingExams[0]);
      } else {
        break;
      }
    }
    
    console.log(`\n🎯 Selected ${selectedExams.length} exams for testing deadlines:`);
    selectedExams.forEach((exam, index) => {
      console.log(`   ${index + 1}. ${exam.name} (${exam.shortName}) - Streams: ${exam.streams.join(', ')}`);
    });
    
    // Create exam deadlines with short timeframes for testing notifications
    const currentDate = new Date();
    const deadlineData = [];
    
    selectedExams.forEach((exam, index) => {
      // Create different urgency levels for testing
      const baseDelay = index + 1; // 1, 2, 3, 4 days
      
      deadlineData.push({
        exam: exam._id,
        applicationStartDate: new Date(currentDate.getTime() - (10 + index * 5) * 24 * 60 * 60 * 1000), // Staggered start dates
        applicationEndDate: new Date(currentDate.getTime() + baseDelay * 24 * 60 * 60 * 1000), // 1-4 days from now
        examDate: new Date(currentDate.getTime() + (15 + index * 5) * 24 * 60 * 60 * 1000), // 15-30 days from now
        admitCardDate: new Date(currentDate.getTime() + (5 + index * 2) * 24 * 60 * 60 * 1000), // 5-11 days from now
        resultDate: new Date(currentDate.getTime() + (45 + index * 10) * 24 * 60 * 60 * 1000), // 45-75 days from now
        year: 2025,
        notes: `Real deadline for ${exam.shortName} 2025${baseDelay <= 2 ? ' - URGENT for testing' : ''}`
      });
    });
    
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
      },
      {
        name: 'Sneha Agarwal',
        email: 'sneha@test.com',
        password: 'testpass123',
        class: '12',
        state: 'Rajasthan',
        stream: 'commerce',
        field: 'business_management'
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
    
    console.log('\n🎉 Real exam deadlines and test users created successfully!');
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
    console.log('\n🔍 To see which notifications are created for different streams:');
    console.log('   - Science PCM students will see engineering exam notifications');
    console.log('   - Science PCB students will see medical exam notifications');
    console.log('   - Arts students will see law/humanities exam notifications');
    console.log('   - Commerce students will see business/management exam notifications');
    
  } catch (error) {
    console.error('❌ Error creating real deadlines:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run the script
addRealDeadlines();