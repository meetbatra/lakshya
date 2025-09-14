const { initializeClass10Quiz } = require('./class10-quiz');
const { initializeCourses } = require('./courses');
const { initializeClass12PCMQuiz } = require('./quizzes/class12-pcm-quiz');
const { initClass12PCBQuiz } = require('./quizzes/class12-pcb-quiz');
const { initClass12CommerceQuiz } = require('./quizzes/class12-commerce-quiz');
const { initClass12ArtsQuiz } = require('./quizzes/class12-arts-quiz');

/**
 * Main initialization script for all data
 * Run this script to populate the database with initial data
 */
async function initializeAll() {
  console.log('🎯 Lakshya Database Initialization');
  console.log('=====================================\n');

  try {
    // Initialize Courses
    console.log('📚 Initializing Courses...');
    await initializeCourses();
    console.log('\n-------------------------------------\n');

  // Initialize Class 10 Quiz
  console.log('📚 Initializing Class 10 Stream Selection Quiz...');
  await initializeClass10Quiz();

  // Initialize Class 12 PCM Quiz
  console.log('📚 Initializing Class 12 PCM Field Recommendation Quiz...');
  await initializeClass12PCMQuiz();

  // Initialize Class 12 PCB Quiz
  console.log('📚 Initializing Class 12 PCB Field Recommendation Quiz...');
  await initClass12PCBQuiz();

  // Initialize Class 12 Commerce Quiz
  console.log('📚 Initializing Class 12 Commerce Field Recommendation Quiz...');
  await initClass12CommerceQuiz();

  // Initialize Class 12 Arts Quiz
  console.log('📚 Initializing Class 12 Arts Field Recommendation Quiz...');
  await initClass12ArtsQuiz();
    
    console.log('\n🎉 All data initialized successfully!');
    console.log('💡 You can now use this data in your application.');
    
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
  console.log('- Populates the database with courses from courses.json');
  console.log('- Creates Class 10 Stream Selection Quiz (12 questions)');
  console.log('- Creates Class 12 PCM Field Recommendation Quiz (12 questions)');
  console.log('- Creates Class 12 PCB Field Recommendation Quiz (12 questions)');
  console.log('- Creates Class 12 Commerce Field Recommendation Quiz (12 questions)');
  console.log('- Creates Class 12 Arts Field Recommendation Quiz (12 questions)');
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
    initializeAll();
  }
}

module.exports = {
  initializeAll,
  showUsage
};
