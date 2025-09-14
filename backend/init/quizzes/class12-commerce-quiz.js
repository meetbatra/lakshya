const mongoose = require('mongoose');
const Quiz = require('../../models/Quiz');
require('dotenv').config();

const class12CommerceQuizData = {
  title: "Commerce Field Recommendation Quiz",
  description: "Discover your ideal field within Commerce - Business Management, Finance & Accounting, Economics & Analytics, Law & Commerce, or Entrepreneurship.",
  targetClass: "12",
  stream: "commerce",
  purpose: "field_recommendation",
  estimatedTime: "10-15 minutes",
  questions: [
    {
      id: 1,
      question: "Which subject do you enjoy the most?",
      options: [
        "Economics",
        "Business Studies",
        "Accounting",
        "Law",
        "Marketing & Innovation"
      ]
    },
    {
      id: 2,
      question: "Which activity excites you most?",
      options: [
        "Managing teams",
        "Analyzing markets",
        "Starting a new venture",
        "Balancing budgets",
        "Studying rules and policies"
      ]
    },
    {
      id: 3,
      question: "What kind of work environment do you imagine yourself in?",
      options: [
        "Corporate office",
        "Law firm",
        "Startup workspace",
        "Bank/Finance company",
        "Policy research center"
      ]
    },
    {
      id: 4,
      question: "Which career appeals to you most?",
      options: [
        "Manager/HR Head",
        "Economist",
        "Entrepreneur",
        "Chartered Accountant",
        "Corporate Lawyer"
      ]
    },
    {
      id: 5,
      question: "Which subject do you find easiest?",
      options: [
        "Market Research",
        "Corporate Law",
        "Statistics & Data",
        "Accounts",
        "Management Theories"
      ]
    },
    {
      id: 6,
      question: "How do you prefer solving problems?",
      options: [
        "By analyzing financial data",
        "By negotiating contracts",
        "By creating business strategies",
        "By innovating and experimenting",
        "By interpreting economic trends"
      ]
    },
    {
      id: 7,
      question: "Which extracurricular would you choose?",
      options: [
        "Stock market club",
        "Debating society",
        "Business plan competition",
        "Student council leadership",
        "Data analytics workshop"
      ]
    },
    {
      id: 8,
      question: "What motivates you the most?",
      options: [
        "Financial independence",
        "Policy & justice",
        "Leading organizations",
        "Building businesses",
        "Solving economic problems"
      ]
    },
    {
      id: 9,
      question: "Which aptitude do you think is your strongest?",
      options: [
        "Leadership",
        "Risk-taking",
        "Numerical skills",
        "Legal reasoning",
        "Analytical thinking"
      ]
    },
    {
      id: 10,
      question: "If you could choose one project, what would it be?",
      options: [
        "Launching a startup",
        "Auditing a company",
        "Drafting a policy paper",
        "Running a college fest",
        "Publishing market research"
      ]
    },
    {
      id: 11,
      question: "Which global challenge excites you to solve?",
      options: [
        "Financial literacy",
        "Corporate fraud",
        "Youth unemployment",
        "Business scalability",
        "Economic inequality"
      ]
    },
    {
      id: 12,
      question: "How would you like to be remembered?",
      options: [
        "As a successful entrepreneur",
        "As a top corporate manager",
        "As a leading economist",
        "As a respected CA",
        "As a corporate lawyer"
      ]
    }
  ]
};

const initClass12CommerceQuiz = async () => {
  try {
    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState === 0) {
      console.log('Connected to MongoDB');
      const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lakshya';
      await mongoose.connect(mongoURI);
    }

    // Check if Commerce quiz already exists
    const existingQuiz = await Quiz.findOne({ 
      targetClass: "12", 
      stream: "commerce",
      purpose: "field_recommendation" 
    });

    if (existingQuiz) {
      console.log('Class 12 Commerce quiz already exists, skipping...');
      return;
    }

    // Create new quiz
    const quiz = new Quiz(class12CommerceQuizData);
    await quiz.save();
    
    console.log('✅ Class 12 Commerce field recommendation quiz created successfully');
    return quiz;
  } catch (error) {
    console.error('❌ Error creating Class 12 Commerce quiz:', error);
    throw error;
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('🔌 MongoDB disconnected');
    }
  }
};

module.exports = { initClass12CommerceQuiz };