const mongoose = require('mongoose');
const QuizQuestion = require('./models/QuizQuestion');
const Exam = require('./models/Exam');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

async function addMoreQuestions() {
  try {
    console.log('🌱 Adding more questions to make quizzes more viable...');

    // Get JEE Main exam for reference
    const jeeExam = await Exam.findOne({ name: "Joint Entrance Examination Main" });
    if (!jeeExam) {
      console.log('❌ JEE Main exam not found.');
      return;
    }

    // More Physics Questions
    const physicsQuestions = [
      {
        question: "The acceleration due to gravity on the moon is approximately:",
        options: [
          { text: "1.6 m/s²", isCorrect: true },
          { text: "9.8 m/s²", isCorrect: false },
          { text: "3.7 m/s²", isCorrect: false },
          { text: "0.6 m/s²", isCorrect: false }
        ],
        explanation: "The acceleration due to gravity on the moon is approximately 1.6 m/s², which is about 1/6th of Earth's gravity.",
        subject: "Physics",
        topic: "Gravitation",
        difficulty: "Easy",
        exam: jeeExam._id
      },
      {
        question: "Which of the following is a vector quantity?",
        options: [
          { text: "Speed", isCorrect: false },
          { text: "Distance", isCorrect: false },
          { text: "Velocity", isCorrect: true },
          { text: "Time", isCorrect: false }
        ],
        explanation: "Velocity is a vector quantity because it has both magnitude and direction, unlike speed which is scalar.",
        subject: "Physics",
        topic: "Vectors",
        difficulty: "Easy",
        exam: jeeExam._id
      },
      {
        question: "The unit of electric current is:",
        options: [
          { text: "Volt", isCorrect: false },
          { text: "Ampere", isCorrect: true },
          { text: "Ohm", isCorrect: false },
          { text: "Watt", isCorrect: false }
        ],
        explanation: "Ampere (A) is the SI unit of electric current, named after André-Marie Ampère.",
        subject: "Physics",
        topic: "Current Electricity",
        difficulty: "Easy",
        exam: jeeExam._id
      },
      {
        question: "In simple harmonic motion, the acceleration is maximum when:",
        options: [
          { text: "Velocity is maximum", isCorrect: false },
          { text: "Displacement is zero", isCorrect: false },
          { text: "Displacement is maximum", isCorrect: true },
          { text: "Both velocity and displacement are zero", isCorrect: false }
        ],
        explanation: "In SHM, acceleration is proportional to displacement and opposite in direction. Maximum displacement gives maximum acceleration.",
        subject: "Physics",
        topic: "Simple Harmonic Motion",
        difficulty: "Medium",
        exam: jeeExam._id
      }
    ];

    // More Chemistry Questions
    const chemistryQuestions = [
      {
        question: "The atomic number of carbon is:",
        options: [
          { text: "4", isCorrect: false },
          { text: "6", isCorrect: true },
          { text: "8", isCorrect: false },
          { text: "12", isCorrect: false }
        ],
        explanation: "Carbon has atomic number 6, meaning it has 6 protons in its nucleus.",
        subject: "Chemistry",
        topic: "Atomic Structure",
        difficulty: "Easy",
        exam: jeeExam._id
      },
      {
        question: "Which of the following is a noble gas?",
        options: [
          { text: "Nitrogen", isCorrect: false },
          { text: "Oxygen", isCorrect: false },
          { text: "Helium", isCorrect: true },
          { text: "Hydrogen", isCorrect: false }
        ],
        explanation: "Helium is a noble gas (Group 18) with complete outer electron shell, making it chemically inert.",
        subject: "Chemistry",
        topic: "Periodic Table",
        difficulty: "Easy",
        exam: jeeExam._id
      },
      {
        question: "The pH of pure water at 25°C is:",
        options: [
          { text: "0", isCorrect: false },
          { text: "7", isCorrect: true },
          { text: "14", isCorrect: false },
          { text: "1", isCorrect: false }
        ],
        explanation: "Pure water has pH 7 at 25°C, which is considered neutral (neither acidic nor basic).",
        subject: "Chemistry",
        topic: "Acids and Bases",
        difficulty: "Easy",
        exam: jeeExam._id
      },
      {
        question: "Which type of bond is present in methane (CH₄)?",
        options: [
          { text: "Ionic bond", isCorrect: false },
          { text: "Covalent bond", isCorrect: true },
          { text: "Metallic bond", isCorrect: false },
          { text: "Hydrogen bond", isCorrect: false }
        ],
        explanation: "Methane has covalent bonds formed by sharing of electrons between carbon and hydrogen atoms.",
        subject: "Chemistry",
        topic: "Chemical Bonding",
        difficulty: "Medium",
        exam: jeeExam._id
      }
    ];

    // More Mathematics Questions
    const mathQuestions = [
      {
        question: "The value of sin(90°) is:",
        options: [
          { text: "0", isCorrect: false },
          { text: "1", isCorrect: true },
          { text: "-1", isCorrect: false },
          { text: "1/2", isCorrect: false }
        ],
        explanation: "sin(90°) = 1. This is a fundamental trigonometric value.",
        subject: "Mathematics",
        topic: "Trigonometry",
        difficulty: "Easy",
        exam: jeeExam._id
      },
      {
        question: "The derivative of x² with respect to x is:",
        options: [
          { text: "x", isCorrect: false },
          { text: "2x", isCorrect: true },
          { text: "x²", isCorrect: false },
          { text: "2x²", isCorrect: false }
        ],
        explanation: "Using the power rule: d/dx(xⁿ) = nxⁿ⁻¹, so d/dx(x²) = 2x¹ = 2x.",
        subject: "Mathematics",
        topic: "Differential Calculus",
        difficulty: "Easy",
        exam: jeeExam._id
      },
      {
        question: "If log₁₀(100) = x, then x equals:",
        options: [
          { text: "1", isCorrect: false },
          { text: "2", isCorrect: true },
          { text: "10", isCorrect: false },
          { text: "100", isCorrect: false }
        ],
        explanation: "log₁₀(100) = log₁₀(10²) = 2, since 10² = 100.",
        subject: "Mathematics",
        topic: "Logarithms",
        difficulty: "Easy",
        exam: jeeExam._id
      },
      {
        question: "The roots of the equation x² - 5x + 6 = 0 are:",
        options: [
          { text: "2, 3", isCorrect: true },
          { text: "1, 6", isCorrect: false },
          { text: "-2, -3", isCorrect: false },
          { text: "0, 5", isCorrect: false }
        ],
        explanation: "Factoring: x² - 5x + 6 = (x-2)(x-3) = 0, so x = 2 or x = 3.",
        subject: "Mathematics",
        topic: "Quadratic Equations",
        difficulty: "Medium",
        exam: jeeExam._id
      }
    ];

    // More Biology Questions
    const biologyQuestions = [
      {
        question: "DNA stands for:",
        options: [
          { text: "Deoxyribonucleic Acid", isCorrect: true },
          { text: "Deoxyribose Nucleic Acid", isCorrect: false },
          { text: "Diribonucleic Acid", isCorrect: false },
          { text: "Dinucleic Acid", isCorrect: false }
        ],
        explanation: "DNA stands for Deoxyribonucleic Acid, the molecule that carries genetic information.",
        subject: "Biology",
        topic: "Molecular Biology",
        difficulty: "Easy",
        exam: jeeExam._id
      },
      {
        question: "The longest bone in the human body is:",
        options: [
          { text: "Humerus", isCorrect: false },
          { text: "Tibia", isCorrect: false },
          { text: "Femur", isCorrect: true },
          { text: "Radius", isCorrect: false }
        ],
        explanation: "The femur (thigh bone) is the longest and strongest bone in the human body.",
        subject: "Biology",
        topic: "Human Anatomy",
        difficulty: "Easy",
        exam: jeeExam._id
      },
      {
        question: "Photosynthesis occurs in which part of the plant cell?",
        options: [
          { text: "Nucleus", isCorrect: false },
          { text: "Mitochondria", isCorrect: false },
          { text: "Chloroplasts", isCorrect: true },
          { text: "Ribosomes", isCorrect: false }
        ],
        explanation: "Photosynthesis occurs in chloroplasts, which contain chlorophyll and are primarily found in leaf cells.",
        subject: "Biology",
        topic: "Plant Physiology",
        difficulty: "Easy",
        exam: jeeExam._id
      },
      {
        question: "Which of the following is NOT a function of the liver?",
        options: [
          { text: "Detoxification", isCorrect: false },
          { text: "Bile production", isCorrect: false },
          { text: "Insulin production", isCorrect: true },
          { text: "Protein synthesis", isCorrect: false }
        ],
        explanation: "Insulin is produced by the pancreas, not the liver. The liver performs detoxification, bile production, and protein synthesis.",
        subject: "Biology",
        topic: "Human Physiology",
        difficulty: "Medium",
        exam: jeeExam._id
      }
    ];

    // Combine all questions
    const allNewQuestions = [
      ...physicsQuestions,
      ...chemistryQuestions,
      ...mathQuestions,
      ...biologyQuestions
    ];

    // Insert new questions
    await QuizQuestion.insertMany(allNewQuestions);
    console.log(`✅ Successfully added ${allNewQuestions.length} more questions!`);

    // Show updated summary
    console.log('\\n📊 Updated Question Summary:');
    const subjects = await QuizQuestion.aggregate([
      { $group: { _id: { subject: '$subject', difficulty: '$difficulty' }, count: { $sum: 1 } } },
      { $sort: { '_id.subject': 1, '_id.difficulty': 1 } }
    ]);
    
    subjects.forEach(item => {
      console.log(`   ${item._id.subject} (${item._id.difficulty}): ${item.count} questions`);
    });

    console.log('\\n🎯 New Quiz Recommendations:');
    const totalBySubject = await QuizQuestion.aggregate([
      { $group: { _id: '$subject', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    const subjectTotals = {};
    totalBySubject.forEach(item => {
      subjectTotals[item._id] = item.count;
    });
    
    const jeeTotal = ['Physics', 'Chemistry', 'Mathematics'].reduce((sum, subject) => sum + (subjectTotals[subject] || 0), 0);
    const neetTotal = ['Physics', 'Chemistry', 'Biology'].reduce((sum, subject) => sum + (subjectTotals[subject] || 0), 0);
    
    console.log(`   JEE (PCM): ${jeeTotal} questions available`);
    console.log(`   NEET (PCB): ${neetTotal} questions available`);

  } catch (error) {
    console.error('❌ Error adding questions:', error);
  } finally {
    console.log('\\n🔚 Database connection closed');
    mongoose.connection.close();
  }
}

addMoreQuestions();