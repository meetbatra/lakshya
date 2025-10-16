const mongoose = require('mongoose');
const QuizService = require('./services/dailyQuizService');
const User = require('./models/User');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

async function testDailyQuizSystem() {
  try {
    console.log('🧪 Testing Daily Quiz System');
    console.log('============================');

    // Find a PCM user for testing
    console.log('🔍 Looking for PCM user...');
    const testUser = await User.findOne({ stream: 'science_pcm' });
    if (!testUser) {
      console.log('❌ No PCM user found for testing');
      return;
    }    console.log(`👤 Testing with user: ${testUser.name} (${testUser.stream})`);

    // Test 1: Get today's quiz config
    console.log('\n1️⃣ Testing daily quiz configuration...');
    const config = QuizService.getDailyQuizConfig();
    console.log(`   📅 Today's config: ${config.description}`);
    console.log(`   📚 Subjects: ${config.subjects.join(', ')}`);
    console.log(`   🎯 Difficulty: ${config.difficulty || 'Mixed'}`);
    console.log(`   📝 Questions: ${config.questionCount}`);
    console.log(`   ⏱️ Time limit: ${config.timeLimit} seconds`);

    // Test 2: Get quiz status
    console.log('\n2️⃣ Testing quiz status...');
    const statusResult = await QuizService.getQuizStatus(testUser._id);
    if (statusResult.success) {
      const status = statusResult.data;
      console.log(`   📊 Has attempted today: ${status.hasAttemptedToday}`);
      console.log(`   🔥 Current streak: ${status.streak} days`);
      console.log(`   ✅ Can attempt: ${status.canAttempt}`);
    } else {
      console.log(`   ❌ Error getting status: ${statusResult.message}`);
    }

    // Test 3: Generate daily quiz
    console.log('\n3️⃣ Testing daily quiz generation...');
    const quizResult = await QuizService.generateDailyQuiz(testUser._id);
    
    if (quizResult.success) {
      const quiz = quizResult.data;
      console.log(`   ✅ Quiz generated successfully!`);
      console.log(`   🆔 Quiz ID: ${quiz.quizId}`);
      console.log(`   📚 Exam: ${quiz.exam.name}`);
      console.log(`   📝 Questions: ${quiz.questions.length}`);
      console.log(`   ⏱️ Time limit: ${quiz.timeLimit} seconds`);
      
      console.log('\n   📋 Sample questions:');
      quiz.questions.slice(0, 3).forEach((q, index) => {
        console.log(`      ${index + 1}. ${q.subject} (${q.difficulty}): ${q.question.substring(0, 50)}...`);
      });

      // Test 4: Simulate quiz submission
      console.log('\n4️⃣ Testing quiz submission...');
      
      // Create sample answers (randomly selecting options)
      const answers = quiz.questions.map(q => ({
        questionId: q._id,
        selectedOptionId: q.options[Math.floor(Math.random() * q.options.length)]._id,
        timeTaken: Math.floor(Math.random() * 60) + 10 // 10-70 seconds per question
      }));

      const submissionData = {
        quizId: quiz.quizId,
        examId: quiz.exam._id,
        answers: answers,
        startTime: new Date(Date.now() - 10 * 60 * 1000), // Started 10 minutes ago
        endTime: new Date()
      };

      const submitResult = await QuizService.submitQuiz(testUser._id, submissionData);
      
      if (submitResult.success) {
        const results = submitResult.data.results;
        console.log(`   ✅ Quiz submitted successfully!`);
        console.log(`   🎯 Score: ${results.correctAnswers}/${results.totalQuestions} (${results.percentage}%)`);
        console.log(`   ⏱️ Time taken: ${Math.floor(results.totalTimeTaken / 60)}:${results.totalTimeTaken % 60} minutes`);
        console.log(`   🔥 New streak: ${submitResult.data.streak} days`);
        console.log(`   💬 Message: ${submitResult.data.message}`);
        
        if (results.subjectPerformance.length > 0) {
          console.log('\n   📊 Subject-wise performance:');
          results.subjectPerformance.forEach(subject => {
            console.log(`      ${subject.subject}: ${subject.correctAnswers}/${subject.totalQuestions} (${subject.percentage}%)`);
          });
        }
      } else {
        console.log(`   ❌ Quiz submission failed: ${submitResult.message}`);
      }

      // Test 5: Try to attempt again (should fail)
      console.log('\n5️⃣ Testing duplicate attempt prevention...');
      const duplicateResult = await QuizService.generateDailyQuiz(testUser._id);
      if (!duplicateResult.success && duplicateResult.code === 'ALREADY_ATTEMPTED') {
        console.log(`   ✅ Duplicate attempt correctly prevented: ${duplicateResult.message}`);
      } else {
        console.log(`   ❌ Duplicate attempt prevention failed`);
      }

    } else {
      console.log(`   ❌ Quiz generation failed: ${quizResult.message}`);
    }

    // Test 6: Get analytics
    console.log('\n6️⃣ Testing analytics...');
    const analyticsResult = await QuizService.getUserAnalytics(testUser._id, 30);
    if (analyticsResult.success) {
      const analytics = analyticsResult.data;
      console.log(`   📊 Total quizzes: ${analytics.overall.totalQuizzes}`);
      console.log(`   📈 Average score: ${Math.round(analytics.overall.averageScore)}%`);
      console.log(`   🔥 Current streak: ${analytics.streak} days`);
      
      if (analytics.subjects.length > 0) {
        console.log('\n   📚 Subject analytics:');
        analytics.subjects.forEach(subject => {
          console.log(`      ${subject.subject}: ${subject.averagePercentage}% avg (${subject.quizCount} quizzes)`);
        });
      }
    } else {
      console.log(`   ❌ Analytics failed: ${analyticsResult.message}`);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n🔚 Test completed');
  }
}

// Run the test
testDailyQuizSystem();