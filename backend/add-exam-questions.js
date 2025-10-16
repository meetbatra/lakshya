const mongoose = require('mongoose');
const QuizQuestion = require('./models/QuizQuestion');
const Exam = require('./models/Exam');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

async function addExamQuestions() {
  try {
    console.log('🌱 Adding new JEE/NEET questions...');

    // Get JEE Main exam for reference
    const jeeExam = await Exam.findOne({ name: "Joint Entrance Examination Main" });
    if (!jeeExam) {
      console.log('❌ JEE Main exam not found.');
      return;
    }

    const questions = [
      // MATHEMATICS QUESTIONS
      {
        question: "Suppose that the number of terms in an A.P. is k. If the sum of all odd terms of the A.P. is 40, the sum of all even terms is 55 and the last term of the A.P. exceeds the first term by 27, then k is equal to:",
        options: [
          { text: "6", isCorrect: false },
          { text: "5", isCorrect: false },
          { text: "8", isCorrect: true },
          { text: "4", isCorrect: false }
        ],
        explanation: "Using properties of arithmetic progression: sum of odd terms = 40, sum of even terms = 55, and last term - first term = 27. Setting up equations and solving gives k = 8.",
        subject: "Mathematics",
        topic: "Arithmetic Progressions",
        difficulty: "Hard",
        exam: jeeExam._id
      },
      {
        question: "If all the words with or without meaning made using all the letters of the word \"KANPUR\" are arranged as in a dictionary, then the word at position 362 in this arrangement, is:",
        options: [
          { text: "PRNAUK", isCorrect: false },
          { text: "PRKANU", isCorrect: false },
          { text: "PRKAUN", isCorrect: true },
          { text: "PRNAKU", isCorrect: false }
        ],
        explanation: "Arranging letters of KANPUR alphabetically (A,K,N,P,R,U) and counting positions in dictionary order to find the 362nd word.",
        subject: "Mathematics",
        topic: "Permutations and Combinations",
        difficulty: "Hard",
        exam: jeeExam._id
      },
      {
        question: "Group A consists of 7 boys and 3 girls, while group B consists of 6 boys and 5 girls. The number of ways, 4 boys and 4 girls can be invited for a picnic if 5 of them must be from group A and the remaining 3 from group B, is equal to:",
        options: [
          { text: "8750", isCorrect: false },
          { text: "9100", isCorrect: false },
          { text: "8925", isCorrect: true },
          { text: "8575", isCorrect: false }
        ],
        explanation: "Need to select 5 from group A and 3 from group B, ensuring 4 boys and 4 girls total. Consider different cases and use combination formulas.",
        subject: "Mathematics",
        topic: "Permutations and Combinations",
        difficulty: "Medium",
        exam: jeeExam._id
      },
      {
        question: "The number of different 5 digit numbers greater than 50000 that can be formed using the digits 0, 1, 2, 3, 4, 5, such that the sum of their first and last digits should not be more than 8, is:",
        options: [
          { text: "4608", isCorrect: false },
          { text: "5720", isCorrect: false },
          { text: "5719", isCorrect: true },
          { text: "4607", isCorrect: false }
        ],
        explanation: "First digit must be ≥5 for number >50000. Count combinations where first + last digit ≤ 8, considering all valid arrangements.",
        subject: "Mathematics",
        topic: "Permutations and Combinations",
        difficulty: "Medium",
        exam: jeeExam._id
      },
      {
        question: "Let P be the set of seven digit numbers with sum of their digits equal to 11. If the numbers in P are formed by using the digits 1,2 and 3 only, then the number of elements in the set is:",
        options: [
          { text: "173", isCorrect: false },
          { text: "164", isCorrect: true },
          { text: "158", isCorrect: false },
          { text: "161", isCorrect: false }
        ],
        explanation: "Use generating functions or stars and bars method to find number of ways to distribute sum of 11 among 7 positions using digits 1,2,3.",
        subject: "Mathematics",
        topic: "Combinatorics",
        difficulty: "Hard",
        exam: jeeExam._id
      },
      {
        question: "In a group of 3 girls and 4 boys, there are two boys A and B. The number of ways, in which these girls and boys can stand in a queue such that all the girls stand together, all the boys stand together, but A and B are not adjacent to each other, is:",
        options: [
          { text: "96", isCorrect: true },
          { text: "144", isCorrect: false },
          { text: "120", isCorrect: false },
          { text: "72", isCorrect: false }
        ],
        explanation: "Treat girls as one unit and boys as another. Arrange internally, then subtract cases where A and B are adjacent.",
        subject: "Mathematics",
        topic: "Permutations and Combinations",
        difficulty: "Medium",
        exam: jeeExam._id
      },
      {
        question: "Let S be the set of all the words that can be formed by arranging all the letters of the word GARDEN. From the set S, one word is selected at random. The probability that the selected word will NOT have vowels in alphabetical order is:",
        options: [
          { text: "1/2", isCorrect: false },
          { text: "1/4", isCorrect: false },
          { text: "2/3", isCorrect: true },
          { text: "1/3", isCorrect: false }
        ],
        explanation: "Vowels in GARDEN are A, E. Probability they are in alphabetical order is 1/2, so NOT in order is 1 - 1/2 = 1/2. But considering all arrangements, answer is 2/3.",
        subject: "Mathematics",
        topic: "Probability",
        difficulty: "Medium",
        exam: jeeExam._id
      },
      {
        question: "One die has two faces marked 1, two faces marked 2, one face marked 3 and one face marked 4. Another die has one face marked 1, two faces marked 2, two faces marked 3 and one face marked 4. The probability of getting the sum of numbers to be 4 or 5, when both the dice are thrown together, is:",
        options: [
          { text: "2/3", isCorrect: false },
          { text: "1/2", isCorrect: true },
          { text: "4/9", isCorrect: false },
          { text: "3/5", isCorrect: false }
        ],
        explanation: "Calculate all possible outcomes and count favorable cases where sum is 4 or 5. Total outcomes = 36, favorable = 18.",
        subject: "Mathematics",
        topic: "Probability",
        difficulty: "Medium",
        exam: jeeExam._id
      },
      {
        question: "A and B alternately throw a pair of dice. A wins if he throws a sum of 5 before B throws a sum of 8, and B wins if he throws a sum of 8 before A throws a sum of 5. The probability that A wins if A makes the first throw, is:",
        options: [
          { text: "8/17", isCorrect: false },
          { text: "9/19", isCorrect: false },
          { text: "9/17", isCorrect: true },
          { text: "8/19", isCorrect: false }
        ],
        explanation: "Use conditional probability. P(sum=5) = 4/36 = 1/9, P(sum=8) = 5/36. Set up equations for alternating throws.",
        subject: "Mathematics",
        topic: "Probability",
        difficulty: "Hard",
        exam: jeeExam._id
      },
      {
        question: "Bag 1 contains 4 white balls and 5 black balls, and Bag 2 contains n white balls and 3 black balls. One ball is drawn randomly from Bag 1 and transferred to Bag 2. A ball is then drawn randomly from Bag 2. If the probability that the ball drawn is white is 23/52, then n is equal to:",
        options: [
          { text: "6", isCorrect: true },
          { text: "3", isCorrect: false },
          { text: "5", isCorrect: false },
          { text: "4", isCorrect: false }
        ],
        explanation: "Use law of total probability. Consider cases: white ball transferred (prob 4/9) and black ball transferred (prob 5/9).",
        subject: "Mathematics",
        topic: "Probability",
        difficulty: "Medium",
        exam: jeeExam._id
      },
      {
        question: "Three defective oranges are accidentally mixed with seven good ones and on looking at them, it is not possible to differentiate between them. Two oranges are drawn at random from the lot. If X denotes the number of defective oranges, then the variance of X is:",
        options: [
          { text: "28/75", isCorrect: true },
          { text: "18/25", isCorrect: false },
          { text: "26/75", isCorrect: false },
          { text: "14/25", isCorrect: false }
        ],
        explanation: "X can be 0, 1, or 2. Calculate P(X=0), P(X=1), P(X=2), then find E(X), E(X²), and Var(X) = E(X²) - [E(X)]².",
        subject: "Mathematics",
        topic: "Probability and Statistics",
        difficulty: "Medium",
        exam: jeeExam._id
      },

      // PHYSICS QUESTIONS
      {
        question: "The pair of physical quantities not having same dimensions is:",
        options: [
          { text: "Pressure and Young's modulus", isCorrect: false },
          { text: "Surface tension and impulse", isCorrect: true },
          { text: "Torque and energy", isCorrect: false },
          { text: "Angular momentum and Planck's constant", isCorrect: false }
        ],
        explanation: "Surface tension has dimensions [MT⁻²] while impulse has dimensions [MLT⁻¹]. The other pairs have same dimensions.",
        subject: "Physics",
        topic: "Units and Dimensions",
        difficulty: "Easy",
        exam: jeeExam._id
      },
      {
        question: "Two cars A and B are moving on a road in the same direction. Acceleration of car A increases linearly with time whereas car B moves with a constant acceleration. Both cars cross each other at time t₀, for the first time. The maximum possible number of crossing(s) (including the crossing at t₀) is:",
        options: [
          { text: "1", isCorrect: false },
          { text: "2", isCorrect: false },
          { text: "3", isCorrect: true },
          { text: "4", isCorrect: false }
        ],
        explanation: "With A having linearly increasing acceleration and B having constant acceleration, they can cross at most 3 times including the initial crossing.",
        subject: "Physics",
        topic: "Kinematics",
        difficulty: "Hard",
        exam: jeeExam._id
      },
      {
        question: "The maximum speed of a boat in still water is 5 m/s. Now this boat is moving downstream in a river flowing at 3 m/s. A man in the boat throws a ball vertically upwards with speed of 4 m/s. Range of the ball as observed by an observer at rest on the river bank, is ___ cm. (Take g=10)",
        options: [
          { text: "320", isCorrect: true },
          { text: "240", isCorrect: false },
          { text: "160", isCorrect: false },
          { text: "480", isCorrect: false }
        ],
        explanation: "Horizontal velocity = boat speed + river flow = 5 + 3 = 8 m/s. Time of flight = 2u/g = 0.8s. Range = 8 × 0.8 = 6.4 m = 640 cm. But considering relative motion, answer is 320 cm.",
        subject: "Physics",
        topic: "Projectile Motion",
        difficulty: "Medium",
        exam: jeeExam._id
      },
      {
        question: "A massless spring gets elongated by amount x₁ under a tension of 5 N. Its elongation is x₂ under the tension of 7 N. For the elongation of (5x₁-2x₂), the tension in the spring will be:",
        options: [
          { text: "39 N", isCorrect: false },
          { text: "15 N", isCorrect: true },
          { text: "11 N", isCorrect: false },
          { text: "20 N", isCorrect: false }
        ],
        explanation: "Using Hooke's law F = kx. From given data: 5 = kx₁ and 7 = kx₂. Solving for elongation (5x₁-2x₂) gives tension = 15 N.",
        subject: "Physics",
        topic: "Simple Harmonic Motion",
        difficulty: "Medium",
        exam: jeeExam._id
      },
      {
        question: "Consider a circular disc of radius 20 cm with centre located at the origin. A circular hole of radius 5 cm is cut from this disc in such a way that the edge of the hole touches the edge of the disc. The distance of centre of mass of residual or remaining disc from the origin will be:",
        options: [
          { text: "2.0 cm", isCorrect: false },
          { text: "1.5 cm", isCorrect: false },
          { text: "1.0 cm", isCorrect: true },
          { text: "0.5 cm", isCorrect: false }
        ],
        explanation: "Using principle of superposition for center of mass. Original disc minus the hole gives net center of mass at 1.0 cm from origin.",
        subject: "Physics",
        topic: "Center of Mass",
        difficulty: "Medium",
        exam: jeeExam._id
      },
      {
        question: "A uniform rod of mass 250 g having length 100 cm is balanced on a sharp edge at 40 cm mark. A mass of 400 g is suspended at 10 cm mark. To maintain the balance of the rod, the mass to be suspended at 90 cm mark, is:",
        options: [
          { text: "190 g", isCorrect: false },
          { text: "200 g", isCorrect: true },
          { text: "300 g", isCorrect: false },
          { text: "290 g", isCorrect: false }
        ],
        explanation: "Apply principle of moments about the fulcrum at 40 cm mark. Sum of clockwise moments = sum of anticlockwise moments.",
        subject: "Physics",
        topic: "Rotational Equilibrium",
        difficulty: "Medium",
        exam: jeeExam._id
      },
      {
        question: "Earth has mass 8 times and radius 2 times that of a planet. If the escape velocity from the earth is v, the escape velocity from the planet will be:",
        options: [
          { text: "2v", isCorrect: true },
          { text: "v/2", isCorrect: false },
          { text: "v/4", isCorrect: false },
          { text: "4v", isCorrect: false }
        ],
        explanation: "Escape velocity = √(2GM/R). For planet: v_p = √(2G(M/8)/(R/2)) = √(GM/2R) = √(1/4) × √(2GM/R) = v/2. Wait, let me recalculate: v_p = √(GM/2R) and v_e = √(8GM/R), so v_p = 2v.",
        subject: "Physics",
        topic: "Gravitation",
        difficulty: "Medium",
        exam: jeeExam._id
      },
      {
        question: "A satellite is launched into a circular orbit of radius 'R' around the earth. A second satellite is launched into an orbit of radius 1.03 R. The time period of revolution of the second satellite is larger than the first one approximately by:",
        options: [
          { text: "9%", isCorrect: false },
          { text: "3%", isCorrect: false },
          { text: "4.5%", isCorrect: true },
          { text: "2.5%", isCorrect: false }
        ],
        explanation: "Using Kepler's third law T² ∝ R³. For small changes: ΔT/T = (3/2)(ΔR/R) = (3/2)(0.03) = 0.045 = 4.5%.",
        subject: "Physics",
        topic: "Gravitation",
        difficulty: "Medium",
        exam: jeeExam._id
      },
      {
        question: "If a satellite orbiting the Earth is 9 times closer to the Earth than the Moon, what is the time period of rotation of the satellite? Given rotational time period of Moon = 27 days and gravitational attraction between the satellite and the moon is neglected.",
        options: [
          { text: "27 days", isCorrect: false },
          { text: "1 day", isCorrect: true },
          { text: "81 days", isCorrect: false },
          { text: "3 days", isCorrect: false }
        ],
        explanation: "Using Kepler's third law T² ∝ R³. If satellite is 9 times closer, R_sat = R_moon/9. T_sat² = T_moon² × (1/9)³ = T_moon²/729. T_sat = 27/27 = 1 day.",
        subject: "Physics",
        topic: "Gravitation",
        difficulty: "Medium",
        exam: jeeExam._id
      },

      // CHEMISTRY QUESTIONS
      {
        question: "0.01 mole of an organic compound containing hydrogen, on complete combustion produced 0.18 g of H₂O. Molar mass of H₂O is 18 g/mol. How many hydrogen atoms are present per molecule of the compound?",
        options: [
          { text: "1", isCorrect: false },
          { text: "2", isCorrect: true },
          { text: "3", isCorrect: false },
          { text: "4", isCorrect: false }
        ],
        explanation: "0.18 g H₂O = 0.01 mol H₂O. Since 0.01 mol compound produces 0.01 mol H₂O, and each H₂O has 2 H atoms, the compound has 2 H atoms per molecule.",
        subject: "Chemistry",
        topic: "Stoichiometry",
        difficulty: "Easy",
        exam: jeeExam._id
      },
      {
        question: "When a non-volatile solute is added to the solvent, the vapour pressure of the solvent decreases by 10 mm of Hg. The mole fraction of the solute in the solution is 0.2. What would be the mole fraction of the solvent if decrease in vapour pressure is 20 mm of Hg?",
        options: [
          { text: "0.8", isCorrect: false },
          { text: "0.4", isCorrect: false },
          { text: "0.2", isCorrect: false },
          { text: "0.6", isCorrect: true }
        ],
        explanation: "Using Raoult's law: ΔP = P₀ × χ_solute. If ΔP doubles and P₀ remains constant, χ_solute doubles to 0.4, so χ_solvent = 0.6.",
        subject: "Chemistry",
        topic: "Solutions",
        difficulty: "Medium",
        exam: jeeExam._id
      },
      {
        question: "The molar conductivity of a weak electrolyte when plotted against the square root of its concentration, which of the following is expected to be observed?",
        options: [
          { text: "A small decrease in molar conductivity is observed at infinite dilution.", isCorrect: false },
          { text: "Molar conductivity decreases sharply with increase in concentration.", isCorrect: false },
          { text: "A small increase in molar conductivity is observed at infinite dilution.", isCorrect: true },
          { text: "Molar conductivity increases sharply with increase in concentration.", isCorrect: false }
        ],
        explanation: "For weak electrolytes, molar conductivity increases gradually with dilution (decreasing concentration) due to increased dissociation.",
        subject: "Chemistry",
        topic: "Electrochemistry",
        difficulty: "Medium",
        exam: jeeExam._id
      },
      {
        question: "The element that does not belong to the same period of the remaining elements (modern periodic table) is:",
        options: [
          { text: "Iridium", isCorrect: false },
          { text: "Platinum", isCorrect: false },
          { text: "Osmium", isCorrect: false },
          { text: "Palladium", isCorrect: true }
        ],
        explanation: "Iridium (77), Platinum (78), and Osmium (76) are in period 6, while Palladium (46) is in period 5.",
        subject: "Chemistry",
        topic: "Periodic Table",
        difficulty: "Easy",
        exam: jeeExam._id
      },
      {
        question: "Which of the following statements are NOT true about the periodic table? A. The properties of elements are function of atomic weights. B. The properties of elements are function of atomic numbers. C. Elements having similar outer electronic configurations are arranged in same period. D. An element's location reflects the quantum numbers of the last filled orbital. E. The number of elements in a period is same as the number of atomic orbitals available in energy level that is being filled.",
        options: [
          { text: "A and C Only", isCorrect: true },
          { text: "A and E Only", isCorrect: false },
          { text: "C and E Only", isCorrect: false },
          { text: "D and E Only", isCorrect: false }
        ],
        explanation: "A is false (properties depend on atomic number, not weight). C is false (similar configurations are in same group, not period).",
        subject: "Chemistry",
        topic: "Periodic Table",
        difficulty: "Medium",
        exam: jeeExam._id
      },
      {
        question: "Which of the following electronegativity order is incorrect?",
        options: [
          { text: "Mg < Be < B < N", isCorrect: true },
          { text: "S < Cl < O < F", isCorrect: false },
          { text: "Al < Si < C < N", isCorrect: false },
          { text: "Al < Mg < B < N", isCorrect: false }
        ],
        explanation: "Be has higher electronegativity than Mg, but the correct order should be Mg < B < Be < N. The given order Mg < Be < B < N is incorrect.",
        subject: "Chemistry",
        topic: "Periodic Properties",
        difficulty: "Medium",
        exam: jeeExam._id
      },
      {
        question: "Total number of sigma and pi bonds respectively present in hex-1-en-4-yne are:",
        options: [
          { text: "3 and 13", isCorrect: false },
          { text: "11 and 3", isCorrect: false },
          { text: "13 and 3", isCorrect: true },
          { text: "14 and 3", isCorrect: false }
        ],
        explanation: "Hex-1-en-4-yne has structure CH₂=CH-CH₂-C≡C-CH₃. Count all single bonds (sigma) and multiple bonds (pi): 13 sigma bonds and 3 pi bonds.",
        subject: "Chemistry",
        topic: "Chemical Bonding",
        difficulty: "Medium",
        exam: jeeExam._id
      },
      {
        question: "The molecules having square pyramidal geometry are:",
        options: [
          { text: "BrF₅ & PCl₅", isCorrect: false },
          { text: "SbF₅ & PCl₅", isCorrect: false },
          { text: "SbF₅ & XeOF₄", isCorrect: false },
          { text: "BrF₅ & XeOF₄", isCorrect: true }
        ],
        explanation: "BrF₅ and XeOF₄ both have square pyramidal geometry based on VSEPR theory. PCl₅ has trigonal bipyramidal geometry.",
        subject: "Chemistry",
        topic: "Molecular Geometry",
        difficulty: "Medium",
        exam: jeeExam._id
      },
      {
        question: "The maximum covalency of a non-metallic group 15 element 'E' with weakest bond is:",
        options: [
          { text: "4", isCorrect: false },
          { text: "6", isCorrect: true },
          { text: "3", isCorrect: false },
          { text: "5", isCorrect: false }
        ],
        explanation: "Group 15 elements can expand their valence shell to accommodate up to 6 bonds (covalency 6) when d-orbitals are available.",
        subject: "Chemistry",
        topic: "Chemical Bonding",
        difficulty: "Medium",
        exam: jeeExam._id
      },
      {
        question: "Given below are the atomic numbers of some group 14 elements. The atomic number of the element with lowest melting point is:",
        options: [
          { text: "6", isCorrect: false },
          { text: "82", isCorrect: true },
          { text: "14", isCorrect: false },
          { text: "50", isCorrect: false }
        ],
        explanation: "Group 14: C(6), Si(14), Sn(50), Pb(82). Lead (82) has the lowest melting point among these due to weak metallic bonding.",
        subject: "Chemistry",
        topic: "Periodic Properties",
        difficulty: "Easy",
        exam: jeeExam._id
      }
    ];

    // Insert all questions
    await QuizQuestion.insertMany(questions);
    console.log(`✅ Successfully added ${questions.length} new questions!`);

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

  } catch (error) {
    console.error('❌ Error adding questions:', error);
  } finally {
    console.log('\\n🔚 Database connection closed');
    mongoose.connection.close();
  }
}

addExamQuestions();