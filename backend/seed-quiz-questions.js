const mongoose = require('mongoose');
const QuizQuestion = require('./models/QuizQuestion');
const Exam = require('./models/Exam');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

async function seedQuizQuestions() {
  try {
    console.log('🌱 Seeding quiz questions...');

    // Get JEE Main exam for reference
    const jeeExam = await Exam.findOne({ name: "Joint Entrance Examination Main" });
    if (!jeeExam) {
      console.log('❌ JEE Main exam not found. Please create it first.');
      console.log('Available exams:', await Exam.find({}, 'name').limit(5));
      return;
    }

    console.log(`✅ Found exam: ${jeeExam.name}`);

    // Sample Physics Questions
    const physicsQuestions = [
      {
        question: "A ball is thrown vertically upward with an initial velocity of 20 m/s. What is the maximum height reached? (g = 10 m/s²)",
        options: [
          { text: "10 m", isCorrect: false },
          { text: "20 m", isCorrect: true },
          { text: "40 m", isCorrect: false },
          { text: "400 m", isCorrect: false }
        ],
        subject: "Physics",
        topic: "Kinematics",
        difficulty: "Easy",
        explanation: "Using v² = u² - 2gh, at maximum height v = 0, so h = u²/2g = 400/20 = 20 m"
      },
      {
        question: "The force between two point charges is 10 N when they are 2 m apart. What will be the force when they are 4 m apart?",
        options: [
          { text: "2.5 N", isCorrect: true },
          { text: "5 N", isCorrect: false },
          { text: "20 N", isCorrect: false },
          { text: "40 N", isCorrect: false }
        ],
        subject: "Physics",
        topic: "Electrostatics",
        difficulty: "Medium",
        explanation: "Force follows inverse square law: F ∝ 1/r². When distance doubles, force becomes 1/4th = 10/4 = 2.5 N"
      },
      {
        question: "A spring of spring constant k is compressed by x. The potential energy stored is:",
        options: [
          { text: "kx", isCorrect: false },
          { text: "½kx²", isCorrect: true },
          { text: "kx²", isCorrect: false },
          { text: "½kx", isCorrect: false }
        ],
        subject: "Physics",
        topic: "Simple Harmonic Motion",
        difficulty: "Easy",
        explanation: "Elastic potential energy in a spring is given by U = ½kx²"
      },
      {
        question: "In Young's double slit experiment, the fringe width is 0.5 mm. If the distance between the slits is doubled, the new fringe width will be:",
        options: [
          { text: "0.25 mm", isCorrect: true },
          { text: "0.5 mm", isCorrect: false },
          { text: "1.0 mm", isCorrect: false },
          { text: "2.0 mm", isCorrect: false }
        ],
        subject: "Physics",
        topic: "Wave Optics",
        difficulty: "Hard",
        explanation: "Fringe width β = λD/d. When d is doubled, β becomes half = 0.5/2 = 0.25 mm"
      }
    ];

    // Sample Chemistry Questions
    const chemistryQuestions = [
      {
        question: "What is the molecular formula of benzene?",
        options: [
          { text: "C₆H₆", isCorrect: true },
          { text: "C₆H₁₂", isCorrect: false },
          { text: "C₆H₁₄", isCorrect: false },
          { text: "C₅H₆", isCorrect: false }
        ],
        subject: "Chemistry",
        topic: "Aromatic Compounds",
        difficulty: "Easy",
        explanation: "Benzene has 6 carbon atoms and 6 hydrogen atoms, hence C₆H₆"
      },
      {
        question: "Which of the following is the strongest acid?",
        options: [
          { text: "HCl", isCorrect: false },
          { text: "HNO₃", isCorrect: false },
          { text: "HClO₄", isCorrect: true },
          { text: "H₂SO₄", isCorrect: false }
        ],
        subject: "Chemistry",
        topic: "Acids and Bases",
        difficulty: "Medium",
        explanation: "HClO₄ (perchloric acid) is one of the strongest acids with complete dissociation"
      },
      {
        question: "The hybridization of carbon in methane (CH₄) is:",
        options: [
          { text: "sp", isCorrect: false },
          { text: "sp²", isCorrect: false },
          { text: "sp³", isCorrect: true },
          { text: "sp³d", isCorrect: false }
        ],
        subject: "Chemistry",
        topic: "Chemical Bonding",
        difficulty: "Easy",
        explanation: "Carbon in CH₄ forms 4 sigma bonds, requiring sp³ hybridization"
      }
    ];

    // Sample Mathematics Questions
    const mathQuestions = [
      {
        question: "If log₂(x) = 3, then x equals:",
        options: [
          { text: "6", isCorrect: false },
          { text: "8", isCorrect: true },
          { text: "9", isCorrect: false },
          { text: "16", isCorrect: false }
        ],
        subject: "Mathematics",
        topic: "Logarithms",
        difficulty: "Easy",
        explanation: "log₂(x) = 3 means 2³ = x, so x = 8"
      },
      {
        question: "The derivative of sin(x) with respect to x is:",
        options: [
          { text: "cos(x)", isCorrect: true },
          { text: "-cos(x)", isCorrect: false },
          { text: "sin(x)", isCorrect: false },
          { text: "-sin(x)", isCorrect: false }
        ],
        subject: "Mathematics",
        topic: "Differential Calculus",
        difficulty: "Easy",
        explanation: "d/dx[sin(x)] = cos(x) is a fundamental derivative formula"
      },
      {
        question: "The sum of first n natural numbers is:",
        options: [
          { text: "n(n-1)/2", isCorrect: false },
          { text: "n(n+1)/2", isCorrect: true },
          { text: "n²", isCorrect: false },
          { text: "n(n+1)", isCorrect: false }
        ],
        subject: "Mathematics",
        topic: "Sequences and Series",
        difficulty: "Medium",
        explanation: "Sum = 1+2+3+...+n = n(n+1)/2 using arithmetic progression formula"
      }
    ];

    // Combine all questions
    const allQuestions = [
      ...physicsQuestions.map(q => ({ ...q, exam: jeeExam._id, streams: ['PCM'] })),
      ...chemistryQuestions.map(q => ({ ...q, exam: jeeExam._id, streams: ['PCM', 'PCB'] })),
      ...mathQuestions.map(q => ({ ...q, exam: jeeExam._id, streams: ['PCM'] }))
    ];

    // Clear existing questions for this exam
    await QuizQuestion.deleteMany({ exam: jeeExam._id });
    console.log('🗑️ Cleared existing questions');

    // Insert new questions
    const insertedQuestions = await QuizQuestion.insertMany(allQuestions);
    
    console.log(`✅ Successfully seeded ${insertedQuestions.length} quiz questions!`);
    
    // Show summary
    const summary = await QuizQuestion.aggregate([
      { $match: { exam: jeeExam._id } },
      { $group: { 
          _id: { subject: '$subject', difficulty: '$difficulty' }, 
          count: { $sum: 1 } 
        }},
      { $sort: { '_id.subject': 1, '_id.difficulty': 1 } }
    ]);
    
    console.log('\n📊 Question Summary:');
    summary.forEach(item => {
      console.log(`   ${item._id.subject} (${item._id.difficulty}): ${item.count} questions`);
    });

  } catch (error) {
    console.error('❌ Error seeding questions:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n🔚 Database connection closed');
  }
}

// Run the seeding
seedQuizQuestions();