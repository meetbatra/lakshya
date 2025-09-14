const mongoose = require('mongoose');
const Quiz = require('../../models/Quiz');
require('dotenv').config();

const class12PCBQuizData = {
  title: "PCB Field Recommendation Quiz",
  description: "Discover your ideal field within PCB - Medical Sciences, Veterinary Sciences, Biotechnology, Agriculture, or Nursing & Healthcare.",
  targetClass: "12",
  stream: "science_pcb",
  purpose: "field_recommendation",
  estimatedTime: "10-15 minutes",
  questions: [
    {
      id: 1,
      question: "Which subject excites you the most?",
      options: [
        "Human anatomy and physiology",
        "Environmental science and ecosystems",
        "Animal biology and behavior",
        "Laboratory experiments in biology",
        "Health sciences and patient care"
      ]
    },
    {
      id: 2,
      question: "What type of work environment appeals to you?",
      options: [
        "Hospitals and clinics",
        "Research laboratories",
        "Farms and agricultural fields",
        "Veterinary hospitals",
        "Community health centers"
      ]
    },
    {
      id: 3,
      question: "Which career path seems most appealing?",
      options: [
        "Doctor or surgeon",
        "Biotechnologist",
        "Nurse or physiotherapist",
        "Veterinarian",
        "Agricultural scientist"
      ]
    },
    {
      id: 4,
      question: "Which activity do you enjoy more?",
      options: [
        "Studying medicines and treatments",
        "Working with plants and crops",
        "Caring for animals",
        "Assisting patients with recovery",
        "Studying genes and microorganisms"
      ]
    },
    {
      id: 5,
      question: "What motivates you the most?",
      options: [
        "Helping sick people recover",
        "Protecting the environment",
        "Improving food production",
        "Discovering new cures using science",
        "Caring for animals' health"
      ]
    },
    {
      id: 6,
      question: "Which subject do you find easiest?",
      options: [
        "Botany",
        "Microbiology",
        "Zoology",
        "Physiology",
        "Public health"
      ]
    },
    {
      id: 7,
      question: "Which extracurricular would you choose?",
      options: [
        "Volunteering at a hospital",
        "Working at an animal shelter",
        "Joining an environmental club",
        "Interning in a research lab",
        "Community health awareness program"
      ]
    },
    {
      id: 8,
      question: "What kind of problems do you want to solve?",
      options: [
        "Animal diseases",
        "Human illnesses",
        "Food security and sustainability",
        "Genetic disorders",
        "Public health challenges"
      ]
    },
    {
      id: 9,
      question: "Which project excites you most?",
      options: [
        "Developing eco-friendly farming methods",
        "Working on gene editing",
        "Designing better patient care systems",
        "Studying wildlife diseases",
        "Testing new medicines"
      ]
    },
    {
      id: 10,
      question: "How would you like to contribute to society?",
      options: [
        "Protecting natural resources",
        "Caring for sick people",
        "Advancing biotech innovations",
        "Treating and saving animals",
        "Improving public healthcare systems"
      ]
    },
    {
      id: 11,
      question: "Which skill do you think you're strongest at?",
      options: [
        "Compassion and empathy",
        "Scientific research and lab work",
        "Observation of nature",
        "Animal handling",
        "Patient support and care"
      ]
    },
    {
      id: 12,
      question: "If you could choose one achievement, what would it be?",
      options: [
        "Inventing a life-saving drug",
        "Creating sustainable farming techniques",
        "Becoming a leading doctor",
        "Transforming biotechnology research",
        "Becoming a renowned veterinarian"
      ]
    }
  ]
};

const initClass12PCBQuiz = async () => {
  try {
    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState === 0) {
      console.log('Connected to MongoDB');
      const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lakshya';
      await mongoose.connect(mongoURI);
    }

    // Check if PCB quiz already exists
    const existingQuiz = await Quiz.findOne({ 
      targetClass: "12", 
      stream: "science_pcb",
      purpose: "field_recommendation" 
    });

    if (existingQuiz) {
      console.log('Class 12 PCB quiz already exists, skipping...');
      return;
    }

    // Create new quiz
    const quiz = new Quiz(class12PCBQuizData);
    await quiz.save();
    
    console.log('✅ Class 12 PCB field recommendation quiz created successfully');
    return quiz;
  } catch (error) {
    console.error('❌ Error creating Class 12 PCB quiz:', error);
    throw error;
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('🔌 MongoDB disconnected');
    }
  }
};

module.exports = { initClass12PCBQuiz };