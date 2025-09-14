const mongoose = require('mongoose');
const Quiz = require('../../models/Quiz');
require('dotenv').config();

// Replaced with user-provided PCM Field Recommendation Quiz definition
// Stream requested as science_pcm -> normalized to schema enum science-pcm
const class12PCMQuiz = {
  title: 'PCM Field Recommendation Quiz',
  description: 'Identify your best-fit field within PCM (Engineering, Computer/IT, Architecture, Defence, or Pure Sciences) based on your interests and motivations.',
  targetClass: '12',
  stream: 'science_pcm',
  purpose: 'field_recommendation',
  questions: [
    { question: 'Which subject do you enjoy the most?', options: [ 'Computer Science', 'Mathematics (problem solving)', 'General Knowledge & Strategy', 'Physics (Engineering & machines)', 'Drawing & Design' ] },
    { question: 'Which activity excites you most?', options: [ 'Adventure training, discipline, and leadership', 'Solving abstract math/physics problems', 'Building robots, circuits, or cars', 'Exploring new coding projects', 'Sketching buildings or designing structures' ] },
    { question: 'What kind of work environment do you imagine yourself in?', options: [ 'Tech company or startup', 'A factory, lab, or engineering workshop', 'Architecture studio with sketches & models', 'Army base, flying jets, or naval ships', 'University or research lab' ] },
    { question: 'Which career appeals to you most?', options: [ 'Pilot / Defence Officer', 'Scientist / Mathematician', 'Architect / Urban Planner', 'Mechanical Engineer / Civil Engineer', 'Software Engineer / Data Scientist' ] },
    { question: 'Which subject do you find easiest?', options: [ 'Coding / Algorithms', 'Maths (theory-based)', 'Drawing / Geometry', 'GK / Strategy / Leadership', 'Physics (applied)' ] },
    { question: 'How do you prefer solving problems?', options: [ 'By designing practical solutions', 'By writing algorithms or programs', 'By using discipline & tactical thinking', 'By imagining creative structures', 'By exploring theories & formulas' ] },
    { question: 'Which extracurricular would you choose?', options: [ 'Math/Science Olympiad', 'NCC / Scouts', 'Robotics club', 'Design/Art club', 'Coding/Tech club' ] },
    { question: 'What motivates you the most?', options: [ 'Serving the nation', 'Building things that people use', 'Designing creative spaces', 'Innovating in technology', 'Discovering new knowledge' ] },
    { question: 'Which aptitude do you think is your strongest?', options: [ 'Analytical + Coding', 'Theoretical + Conceptual', 'Creative + Visual', 'Logical + Practical', 'Discipline + Leadership' ] },
    { question: 'If you could choose one project, what would it be?', options: [ 'Research quantum physics', 'Develop an AI app', 'Design a smart city', 'Join a defence training camp', 'Build a bridge or machine' ] },
    { question: 'Which type of challenge excites you most?', options: [ 'Designing futuristic infrastructure', 'Cracking logical puzzles with equations', 'Developing advanced software', 'Strategic drills and survival missions', 'Inventing scientific theories' ] },
    { question: 'How would you like to be remembered?', options: [ 'As a defender of the nation', 'As a world-class scientist', 'As a tech innovator', 'As a great engineer', 'As a visionary architect' ] },
  ]
};

async function initializeClass12PCMQuiz() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lakshya');
    console.log('Connected to MongoDB');

    const existing = await Quiz.findOne({ targetClass: '12', stream: 'science-pcm', purpose: 'field-recommendation' });
    if (existing) {
      console.log('Class 12 PCM quiz already exists:', existing.title);
      console.log('Quiz ID:', existing._id);
      return existing;
    }

    const newQuiz = new Quiz(class12PCMQuiz);
    await newQuiz.save();

    console.log('✅ Class 12 PCM quiz created successfully!');
    console.log('Quiz ID:', newQuiz._id);
    console.log('Title:', newQuiz.title);
    console.log('Questions:', newQuiz.questions.length);
    return newQuiz;
  } catch (err) {
    console.error('❌ Error initializing Class 12 PCM quiz:', err.message);
    if (err.errors) {
      Object.keys(err.errors).forEach(k => console.error(`  - ${k}: ${err.errors[k].message}`));
    }
    throw err;
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

if (require.main === module) {
  initializeClass12PCMQuiz()
    .then(() => { console.log('Initialization completed'); process.exit(0); })
    .catch(e => { console.error('Initialization failed:', e); process.exit(1); });
}

module.exports = { initializeClass12PCMQuiz, class12PCMQuiz };
