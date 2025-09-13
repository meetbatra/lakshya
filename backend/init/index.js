const { initializeClass10Quiz } = require('./class10-quiz');

/**
 * Main initialization script for all quizzes
 * Run this script to populate the database with initial quiz data
 */
async function initializeAllQuizzes() {
  console.log('🎯 Lakshya Quiz Database Initialization');
  console.log('=====================================\n');

  try {
    // Initialize Class 10 Quiz
    console.log('📚 Initializing Class 10 Stream Selection Quiz...');
    await initializeClass10Quiz();
    
    // TODO: Add Class 12 quiz initializations here
    // await initializeClass12SciencePCMQuiz();
    // await initializeClass12SciencePCBQuiz();
    // await initializeClass12CommerceQuiz();
    // await initializeClass12ArtsQuiz();
    
    console.log('\n🎉 All quizzes initialized successfully!');
    console.log('💡 You can now use these quizzes in your application.');
    
  } catch (error) {
    console.error('❌ Initialization failed:', error.message);
    process.exit(1);
  }
}

// Usage instructions
function showUsage() {
  console.log('📖 Usage Instructions:');
  console.log('======================');
  console.log('');
  console.log('1. Make sure MongoDB is running');
  console.log('2. Set MONGODB_URI in your .env file (optional)');
  console.log('3. Run: node init/index.js');
  console.log('');
  console.log('Environment Variables:');
  console.log('- MONGODB_URI: MongoDB connection string (default: mongodb://localhost:27017/lakshya)');
  console.log('');
  console.log('What this script does:');
  console.log('- Creates Class 10 Stream Selection Quiz (12 questions)');
  console.log('- Sets up proper schema validation');
  console.log('- Handles duplicate entries (updates if exists)');
  console.log('- Provides detailed logging and error handling');
}

// Check if this script is being run directly
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showUsage();
  } else {
    initializeAllQuizzes();
  }
}

module.exports = {
  initializeAllQuizzes,
  showUsage
};