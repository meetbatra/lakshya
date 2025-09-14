const mongoose = require('mongoose');
const Quiz = require('../../models/Quiz');

/**
 * Class 12 Arts Field Recommendation Quiz Data
 * Helps students discover their ideal field within Arts stream
 * Fields: Civil Services, Psychology & Counseling, Media & Journalism, 
 *         Law & Legal Studies, Creative Arts & Design, Social Sciences & Research
 */

const artsQuizData = {
  title: "Arts Field Recommendation Quiz",
  description: "Discover your ideal field within Arts - Civil Services, Psychology & Counseling, Media & Journalism, Law & Legal Studies, Creative Arts & Design, or Social Sciences & Research.",
  targetClass: "12",
  stream: "arts",
  purpose: "field_recommendation",
  duration: 10, // minutes
  questions: [
    {
      questionNumber: 1,
      question: "Which subject do you enjoy the most?",
      options: [
        "Political Science",
        "Painting or Designing", 
        "History & Society",
        "Psychology",
        "Media Studies",
        "Legal Studies"
      ]
    },
    {
      questionNumber: 2,
      question: "Which activity excites you most?",
      options: [
        "Writing articles or reporting news",
        "Preparing for competitive exams",
        "Understanding how people think",
        "Debating social issues",
        "Creating art or design projects",
        "Reading about law and justice"
      ]
    },
    {
      questionNumber: 3,
      question: "What kind of work environment do you imagine yourself in?",
      options: [
        "A courtroom",
        "An art studio",
        "A research institute",
        "A newsroom or TV studio",
        "A psychologist's clinic",
        "Government administrative office"
      ]
    },
    {
      questionNumber: 4,
      question: "Which career appeals to you most?",
      options: [
        "Civil Servant (IAS, IPS)",
        "Artist or Designer",
        "Journalist or Anchor",
        "Psychologist",
        "Lawyer",
        "Sociologist"
      ]
    },
    {
      questionNumber: 5,
      question: "Which subject do you find easiest?",
      options: [
        "History & Polity",
        "Sketching or Creative Writing",
        "Psychology concepts",
        "Media & Communication",
        "Legal reasoning",
        "Analyzing society and culture"
      ]
    },
    {
      questionNumber: 6,
      question: "How do you prefer solving problems?",
      options: [
        "By researching and analyzing social structures",
        "By observing and guiding human behavior",
        "By drafting legal arguments",
        "By using creativity and imagination",
        "By investigating and reporting facts",
        "By applying strategy and policy-making"
      ]
    },
    {
      questionNumber: 7,
      question: "Which extracurricular would you choose?",
      options: [
        "Debating society",
        "Art and design club",
        "Mock parliament",
        "Psychology workshops",
        "Campus newspaper or radio",
        "Model United Nations"
      ]
    },
    {
      questionNumber: 8,
      question: "What motivates you the most?",
      options: [
        "Helping people with mental health",
        "Serving the country",
        "Creating social change",
        "Designing impactful artwork",
        "Exposing truth to the public",
        "Fighting for justice"
      ]
    },
    {
      questionNumber: 9,
      question: "Which aptitude do you think is your strongest?",
      options: [
        "Empathy and listening",
        "Logical reasoning",
        "Creativity and expression",
        "Communication and storytelling",
        "Leadership and policy-making",
        "Research and analysis"
      ]
    },
    {
      questionNumber: 10,
      question: "If you could choose one project, what would it be?",
      options: [
        "Publishing an investigative report",
        "Organizing a mental health awareness campaign",
        "Preparing for UPSC or state services",
        "Creating a public art exhibition",
        "Drafting a mock legal case",
        "Conducting a sociology survey"
      ]
    },
    {
      questionNumber: 11,
      question: "Which global challenge excites you to solve?",
      options: [
        "Media integrity and truth",
        "Justice and equality",
        "Cultural preservation",
        "Mental health awareness",
        "Policy and governance",
        "Innovation in arts and design"
      ]
    },
    {
      questionNumber: 12,
      question: "How would you like to be remembered?",
      options: [
        "As a reformist civil servant",
        "As a pioneer in media",
        "As a great artist or designer",
        "As a psychologist who helped many",
        "As a fearless lawyer",
        "As a social scientist who influenced change"
      ]
    }
  ]
};

/**
 * Initialize Class 12 Arts Field Recommendation Quiz
 * Creates or updates the quiz in the database
 */
async function initClass12ArtsQuiz() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/lakshya';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Check if quiz already exists
    const existingQuiz = await Quiz.findOne({
      targetClass: '12',
      stream: 'arts',
      purpose: 'field_recommendation'
    });

    if (existingQuiz) {
      console.log('Class 12 Arts quiz already exists, skipping...');
      return;
    }

    // Create new quiz
    const quiz = new Quiz(artsQuizData);
    await quiz.save();

    console.log('✅ Class 12 Arts field recommendation quiz created successfully');
    console.log(`Quiz ID: ${quiz._id}`);
    console.log(`Title: ${quiz.title}`);
    console.log(`Questions: ${quiz.questions.length}`);
    console.log(`Purpose: ${quiz.purpose}`);
    console.log(`Target Class: ${quiz.targetClass}`);
    console.log(`Stream: ${quiz.stream}`);

  } catch (error) {
    console.error('❌ Error creating Class 12 Arts quiz:', error.message);
    throw error;
  } finally {
    // Close MongoDB connection
    await mongoose.disconnect();
    console.log('🔌 MongoDB disconnected');
  }
}

// Export function for use in main init script
module.exports = {
  initClass12ArtsQuiz,
  artsQuizData
};

// Allow direct execution for testing
if (require.main === module) {
  initClass12ArtsQuiz()
    .then(() => {
      console.log('✅ Arts quiz initialization completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Arts quiz initialization failed:', error);
      process.exit(1);
    });
}