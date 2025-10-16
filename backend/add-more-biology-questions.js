const mongoose = require('mongoose');
const QuizQuestion = require('./models/QuizQuestion');
const Exam = require('./models/Exam');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

async function addMoreBiologyQuestions() {
  try {
    console.log('🌱 Adding new Biology questions for NEET...');

    // Get JEE Main exam for reference (we'll use the same exam reference)
    const jeeExam = await Exam.findOne({ name: "Joint Entrance Examination Main" });
    if (!jeeExam) {
      console.log('❌ JEE Main exam not found.');
      return;
    }

    const biologyQuestions = [
      {
        question: "The process of copying genetic information from one strand of DNA into RNA is called:",
        options: [
          { text: "Translation", isCorrect: false },
          { text: "Transcription", isCorrect: true },
          { text: "Replication", isCorrect: false },
          { text: "Transduction", isCorrect: false }
        ],
        explanation: "Transcription is the process where genetic information from DNA is copied into RNA by RNA polymerase. Translation converts RNA to proteins, replication copies DNA, and transduction is gene transfer by viruses.",
        subject: "Biology",
        topic: "Molecular Biology",
        difficulty: "Easy",
        exam: jeeExam._id
      },
      {
        question: "Which of the following is not a function of the liver?",
        options: [
          { text: "Production of urea", isCorrect: false },
          { text: "Storage of glycogen", isCorrect: false },
          { text: "Production of digestive enzymes", isCorrect: true },
          { text: "Detoxification", isCorrect: false }
        ],
        explanation: "The liver produces urea, stores glycogen, and detoxifies harmful substances. However, digestive enzymes are primarily produced by the pancreas, not the liver. The liver produces bile, not digestive enzymes.",
        subject: "Biology",
        topic: "Human Physiology",
        difficulty: "Easy",
        exam: jeeExam._id
      },
      {
        question: "The shape of guard cells changes due to:",
        options: [
          { text: "Absorption of potassium ions", isCorrect: true },
          { text: "Loss of carbon dioxide from the intercellular spaces", isCorrect: false },
          { text: "Movement of water into the subsidiary cells", isCorrect: false },
          { text: "Breakdown of starch into sugar", isCorrect: false }
        ],
        explanation: "Guard cells change shape due to the absorption of potassium ions (K+), which causes water to enter the cells by osmosis, making them turgid and opening the stomata. This is the primary mechanism of stomatal opening and closing.",
        subject: "Biology",
        topic: "Plant Physiology",
        difficulty: "Medium",
        exam: jeeExam._id
      },
      {
        question: "Which of the following is the first stable product of photosynthesis in C₄ plants?",
        options: [
          { text: "3-Phosphoglyceric acid", isCorrect: false },
          { text: "Oxaloacetic acid", isCorrect: true },
          { text: "Pyruvic acid", isCorrect: false },
          { text: "Malic acid", isCorrect: false }
        ],
        explanation: "In C₄ plants, CO₂ is first fixed by PEP carboxylase to form oxaloacetic acid (OAA), a 4-carbon compound. This is the first stable product. In C₃ plants, 3-PGA is the first stable product.",
        subject: "Biology",
        topic: "Plant Physiology",
        difficulty: "Medium",
        exam: jeeExam._id
      },
      {
        question: "Which of the following statements is correct regarding lysosomes?",
        options: [
          { text: "They are membrane-less organelles", isCorrect: false },
          { text: "They are formed by the Golgi apparatus", isCorrect: true },
          { text: "They contain RNA", isCorrect: false },
          { text: "They are responsible for protein synthesis", isCorrect: false }
        ],
        explanation: "Lysosomes are membrane-bound organelles formed by the Golgi apparatus. They contain digestive enzymes and are responsible for cellular digestion and waste removal, not protein synthesis.",
        subject: "Biology",
        topic: "Cell Biology",
        difficulty: "Easy",
        exam: jeeExam._id
      },
      {
        question: "Which one of the following organisms reproduces sexually only once in its lifetime?",
        options: [
          { text: "Bamboo", isCorrect: true },
          { text: "Mango", isCorrect: false },
          { text: "Papaya", isCorrect: false },
          { text: "Neem", isCorrect: false }
        ],
        explanation: "Bamboo exhibits semelparous reproduction, reproducing sexually only once in its lifetime (after 50-100 years) and then dying. The other plants show iteroparous reproduction, reproducing multiple times.",
        subject: "Biology",
        topic: "Plant Reproduction",
        difficulty: "Medium",
        exam: jeeExam._id
      },
      {
        question: "The site of fertilization in human females is:",
        options: [
          { text: "Cervix", isCorrect: false },
          { text: "Uterus", isCorrect: false },
          { text: "Vagina", isCorrect: false },
          { text: "Fallopian tube", isCorrect: true }
        ],
        explanation: "Fertilization in humans occurs in the fallopian tube (oviduct), specifically in the ampulla region. The fertilized egg then travels to the uterus for implantation.",
        subject: "Biology",
        topic: "Human Reproduction",
        difficulty: "Easy",
        exam: jeeExam._id
      },
      {
        question: "Which of the following pairs is correctly matched?",
        options: [
          { text: "Glycolysis – Mitochondria", isCorrect: false },
          { text: "Krebs cycle – Cytoplasm", isCorrect: false },
          { text: "Electron transport system – Inner mitochondrial membrane", isCorrect: true },
          { text: "Calvin cycle – Thylakoid membrane", isCorrect: false }
        ],
        explanation: "The electron transport system occurs in the inner mitochondrial membrane. Glycolysis occurs in cytoplasm, Krebs cycle in mitochondrial matrix, and Calvin cycle in chloroplast stroma.",
        subject: "Biology",
        topic: "Cellular Respiration",
        difficulty: "Medium",
        exam: jeeExam._id
      },
      {
        question: "Which among the following is a secondary pollutant?",
        options: [
          { text: "Sulphur dioxide", isCorrect: false },
          { text: "Carbon monoxide", isCorrect: false },
          { text: "Ozone", isCorrect: true },
          { text: "Nitrogen dioxide", isCorrect: false }
        ],
        explanation: "Ozone (O₃) is a secondary pollutant formed by the reaction of primary pollutants (NOx and hydrocarbons) in the presence of sunlight. SO₂, CO, and NO₂ are primary pollutants directly emitted from sources.",
        subject: "Biology",
        topic: "Environmental Biology",
        difficulty: "Medium",
        exam: jeeExam._id
      },
      {
        question: "Which one of the following statements is true about Mendel's experiments?",
        options: [
          { text: "He studied only one trait at a time in monohybrid crosses.", isCorrect: false },
          { text: "He used pure lines obtained after several generations of self-pollination.", isCorrect: true },
          { text: "He used Pisum sativum having only red and white flowers.", isCorrect: false },
          { text: "He observed blending inheritance in F₁ generation.", isCorrect: false }
        ],
        explanation: "Mendel used pure breeding lines (true breeding) obtained after several generations of self-pollination. He studied multiple traits, used various flower colors including purple and white, and observed discrete inheritance, not blending.",
        subject: "Biology",
        topic: "Genetics",
        difficulty: "Medium",
        exam: jeeExam._id
      }
    ];

    // Insert all biology questions
    await QuizQuestion.insertMany(biologyQuestions);
    console.log(`✅ Successfully added ${biologyQuestions.length} new Biology questions!`);

    // Show updated summary
    console.log('\\n📊 Updated Question Summary:');
    const subjects = await QuizQuestion.aggregate([
      { $group: { _id: { subject: '$subject', difficulty: '$difficulty' }, count: { $sum: 1 } } },
      { $sort: { '_id.subject': 1, '_id.difficulty': 1 } }
    ]);
    
    subjects.forEach(item => {
      console.log(`   ${item._id.subject} (${item._id.difficulty}): ${item.count} questions`);
    });

    console.log('\\n🎯 Updated Quiz Recommendations:');
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

    console.log('\\n🧬 Biology Topics Coverage:');
    const biologyTopics = await QuizQuestion.aggregate([
      { $match: { subject: 'Biology' } },
      { $group: { _id: '$topic', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    biologyTopics.forEach(topic => {
      console.log(`   ${topic._id}: ${topic.count} questions`);
    });

  } catch (error) {
    console.error('❌ Error adding Biology questions:', error);
  } finally {
    console.log('\\n🔚 Database connection closed');
    mongoose.connection.close();
  }
}

addMoreBiologyQuestions();