const mongoose = require('mongoose');
const Quiz = require('./models/Quiz');

require('dotenv').config();

async function checkAndCleanQuizzes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lakshya');
    console.log('Connected to MongoDB');
    
    const quizzes = await Quiz.find({}, 'title targetClass stream purpose createdAt').sort({ createdAt: 1 });
    
    console.log('Current quizzes in database:');
    console.log('==========================================');
    quizzes.forEach((quiz, index) => {
      console.log(`${index + 1}. ID: ${quiz._id}`);
      console.log(`   Title: ${quiz.title}`);
      console.log(`   Class: ${quiz.targetClass} | Stream: ${quiz.stream || 'N/A'} | Purpose: ${quiz.purpose}`);
      console.log(`   Created: ${quiz.createdAt}`);
      console.log('---');
    });
    
    console.log(`Total quizzes found: ${quizzes.length}`);
    
    // Group quizzes by their key characteristics
    const quizGroups = {};
    quizzes.forEach(quiz => {
      const key = `${quiz.targetClass}-${quiz.stream || 'none'}-${quiz.purpose}`;
      if (!quizGroups[key]) {
        quizGroups[key] = [];
      }
      quizGroups[key].push(quiz);
    });
    
    console.log('\nQuiz groups (potential duplicates):');
    console.log('==========================================');
    Object.keys(quizGroups).forEach(key => {
      const group = quizGroups[key];
      console.log(`${key}: ${group.length} quiz(s)`);
      if (group.length > 1) {
        console.log('  ⚠️  DUPLICATES FOUND!');
        group.forEach((quiz, index) => {
          console.log(`    ${index + 1}. ${quiz._id} (${quiz.title}) - ${quiz.createdAt}`);
        });
      }
    });
    
    // Remove duplicates - keep the latest one for each group
    console.log('\nRemoving duplicates...');
    for (const key of Object.keys(quizGroups)) {
      const group = quizGroups[key];
      if (group.length > 1) {
        // Sort by creation date, keep the latest (last in sorted array)
        group.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        const toDelete = group.slice(0, -1); // All except the last one
        
        console.log(`Deleting ${toDelete.length} duplicate(s) for ${key}:`);
        for (const quiz of toDelete) {
          console.log(`  Deleting: ${quiz._id} (${quiz.title})`);
          await Quiz.findByIdAndDelete(quiz._id);
        }
        console.log(`  Keeping: ${group[group.length - 1]._id} (${group[group.length - 1].title})`);
      }
    }
    
    // Final count
    const finalQuizzes = await Quiz.find({}, 'title targetClass stream purpose');
    console.log(`\nCleanup complete! Final quiz count: ${finalQuizzes.length}`);
    console.log('Remaining quizzes:');
    finalQuizzes.forEach((quiz, index) => {
      console.log(`${index + 1}. ${quiz.title} (Class ${quiz.targetClass}, ${quiz.stream || 'No stream'}, ${quiz.purpose})`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

checkAndCleanQuizzes();