const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
require('dotenv').config();

// Class 10 Quiz Data - Properly formatted for our schema
const class10Quiz = {
  title: "Class 10th Stream Recommendation Quiz",
  description: "Discover your ideal stream based on your interests, strengths, and career aspirations. This comprehensive assessment will help you choose between Science (PCM/PCB), Commerce, or Arts streams.",
  targetClass: "10",
  // No stream field for class 10 (it's for stream selection, not field recommendation)
  purpose: "stream_selection",
  questions: [
    {
      question: "Which subject do you enjoy the most in school?",
      options: [
        "Mathematics",
        "Biology", 
        "Economics / Business Studies",
        "History / Literature"
      ]
    },
    {
      question: "What type of problems do you like solving?",
      options: [
        "Logical and numerical puzzles",
        "Understanding living things & health",
        "Money, trade, and business-related problems", 
        "Creative, social, or philosophical questions"
      ]
    },
    {
      question: "Which activity excites you the most?",
      options: [
        "Building machines, coding, or solving equations",
        "Doing lab experiments on plants/animals",
        "Managing a budget, analyzing markets",
        "Writing stories, drawing, or performing arts"
      ]
    },
    {
      question: "Which strength describes you best?",
      options: [
        "Analytical and logical thinker",
        "Good memory and observation skills", 
        "Practical and business-minded",
        "Imaginative and expressive"
      ]
    },
    {
      question: "How do you usually approach a challenge?",
      options: [
        "Break it into formulas and steps",
        "Research and observe carefully",
        "Think of profit/loss and outcomes",
        "Use creativity and originality"
      ]
    },
    {
      question: "Which career appeals to you most?",
      options: [
        "Engineer / Scientist",
        "Doctor / Biologist",
        "Entrepreneur / CA / Banker", 
        "Lawyer / Journalist / Designer"
      ]
    },
    {
      question: "Which subject feels easiest to you?",
      options: [
        "Mathematics / Physics",
        "Biology / Chemistry",
        "Business Studies / Accounting",
        "Literature / Social Studies"
      ]
    },
    {
      question: "What do your friends usually ask you for help in?",
      options: [
        "Math problems",
        "Science experiments / biology diagrams",
        "Money calculations / business ideas",
        "Essays, projects, or creative activities"
      ]
    },
    {
      question: "Which type of book/article do you prefer reading?",
      options: [
        "Science & technology magazines",
        "Health & environment journals",
        "Business & finance news",
        "Literature, art, or history"
      ]
    },
    {
      question: "If you had to pick a school club, which one would it be?",
      options: [
        "Robotics / Math Club",
        "Science Club (Biology, Nature)",
        "Business / Entrepreneurship Club",
        "Drama / Literature / Arts Club"
      ]
    },
    {
      question: "Which subject do you find least interesting?",
      options: [
        "Biology (I dislike memorization)",
        "Math (I dislike formulas)",
        "History (I dislike dates/events)",
        "Accounting (I dislike numbers/money)"
      ]
    },
    {
      question: "What kind of work do you want to do in the future?",
      options: [
        "Invent something new / design systems",
        "Help people through medicine / research life", 
        "Manage businesses, money, or startups",
        "Express creativity, influence society, or tell stories"
      ]
    }
  ]
};

// Database connection and initialization
async function initializeClass10Quiz() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lakshya');
    console.log('Connected to MongoDB');

    // Check if quiz already exists
    const existingQuiz = await Quiz.findOne({ 
      targetClass: "10", 
      purpose: "stream-selection" 
    });

    if (existingQuiz) {
      console.log('Class 10 quiz already exists:', existingQuiz.title);
      console.log('Quiz ID:', existingQuiz._id);
      return existingQuiz;
    }

    // Create new quiz
    const newQuiz = new Quiz(class10Quiz);
    await newQuiz.save();

    console.log('✅ Class 10 quiz created successfully!');
    console.log('Quiz ID:', newQuiz._id);
    console.log('Title:', newQuiz.title);
    console.log('Questions:', newQuiz.questions.length);
    console.log('Purpose:', newQuiz.purpose);
    console.log('Target Class:', newQuiz.targetClass);

    return newQuiz;

  } catch (error) {
    console.error('❌ Error initializing Class 10 quiz:', error.message);
    if (error.errors) {
      Object.keys(error.errors).forEach(key => {
        console.error(`  - ${key}: ${error.errors[key].message}`);
      });
    }
    throw error;
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the initialization if this file is executed directly
if (require.main === module) {
  initializeClass10Quiz()
    .then(() => {
      console.log('Initialization completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Initialization failed:', error);
      process.exit(1);
    });
}

module.exports = { initializeClass10Quiz, class10Quiz };