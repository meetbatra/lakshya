const mongoose = require('mongoose');
const QuizQuestion = require('./models/QuizQuestion');
const Exam = require('./models/Exam');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

async function addBiologyQuestions() {
  try {
    console.log('🧬 Adding Biology questions...');

    // Get JEE Main exam for reference
    const jeeExam = await Exam.findOne({ name: "Joint Entrance Examination Main" });
    if (!jeeExam) {
      console.log('❌ JEE Main exam not found.');
      return;
    }

    // Biology Questions for JEE/NEET
    const biologyQuestions = [
      {
        question: "Which of the following is the powerhouse of the cell?",
        options: [
          { text: "Nucleus", isCorrect: false },
          { text: "Mitochondria", isCorrect: true },
          { text: "Ribosome", isCorrect: false },
          { text: "Endoplasmic Reticulum", isCorrect: false }
        ],
        explanation: "Mitochondria are called the powerhouse of the cell because they produce ATP (energy) through cellular respiration.",
        subject: "Biology",
        topic: "Cell Biology",
        difficulty: "Easy",
        exam: jeeExam._id,
        stream: "science_pcb"
      },
      {
        question: "What is the process by which plants make their own food?",
        options: [
          { text: "Respiration", isCorrect: false },
          { text: "Photosynthesis", isCorrect: true },
          { text: "Transpiration", isCorrect: false },
          { text: "Germination", isCorrect: false }
        ],
        explanation: "Photosynthesis is the process by which plants convert light energy into chemical energy (glucose) using carbon dioxide and water.",
        subject: "Biology",
        topic: "Plant Physiology",
        difficulty: "Easy",
        exam: jeeExam._id,
        stream: "science_pcb"
      },
      {
        question: "Which blood group is known as the universal donor?",
        options: [
          { text: "A", isCorrect: false },
          { text: "B", isCorrect: false },
          { text: "AB", isCorrect: false },
          { text: "O", isCorrect: true }
        ],
        explanation: "Blood group O is the universal donor because it lacks A and B antigens, making it compatible with all blood types.",
        subject: "Biology",
        topic: "Human Physiology",
        difficulty: "Easy",
        exam: jeeExam._id,
        stream: "science_pcb"
      },
      {
        question: "What is the basic unit of heredity?",
        options: [
          { text: "Chromosome", isCorrect: false },
          { text: "DNA", isCorrect: false },
          { text: "Gene", isCorrect: true },
          { text: "RNA", isCorrect: false }
        ],
        explanation: "A gene is the basic unit of heredity that carries genetic information from parents to offspring.",
        subject: "Biology",
        topic: "Genetics",
        difficulty: "Medium",
        exam: jeeExam._id,
        stream: "science_pcb"
      },
      {
        question: "Which enzyme is responsible for DNA replication?",
        options: [
          { text: "DNA ligase", isCorrect: false },
          { text: "DNA polymerase", isCorrect: true },
          { text: "RNA polymerase", isCorrect: false },
          { text: "Helicase", isCorrect: false }
        ],
        explanation: "DNA polymerase is the main enzyme responsible for synthesizing new DNA strands during replication.",
        subject: "Biology",
        topic: "Molecular Biology",
        difficulty: "Medium",
        exam: jeeExam._id,
        stream: "science_pcb"
      }
    ];

    // Insert biology questions
    await QuizQuestion.insertMany(biologyQuestions);
    console.log(`✅ Successfully added ${biologyQuestions.length} Biology questions!`);

    // Show updated summary
    console.log('\n📊 Updated Question Summary:');
    const subjects = await QuizQuestion.aggregate([
      { $group: { _id: { subject: '$subject', difficulty: '$difficulty' }, count: { $sum: 1 } } },
      { $sort: { '_id.subject': 1, '_id.difficulty': 1 } }
    ]);
    
    subjects.forEach(item => {
      console.log(`   ${item._id.subject} (${item._id.difficulty}): ${item.count} questions`);
    });

  } catch (error) {
    console.error('❌ Error adding biology questions:', error);
  } finally {
    console.log('\n🔚 Database connection closed');
    mongoose.connection.close();
  }
}

addBiologyQuestions();