const mongoose = require('mongoose');
const Course = require('./models/Course');
require('dotenv').config();

// Sample course data for testing
const sampleCourses = [
  // Commerce courses
  {
    name: "Bachelor of Business Administration",
    shortName: "BBA",
    stream: "commerce",
    field: "business_management",
    level: "undergraduate",
    duration: { years: 3, months: 0 },
    description: "A comprehensive program covering all aspects of business management including marketing, finance, HR, and operations.",
    eligibility: ["12th Commerce with minimum 50% marks"],
    careerOptions: ["Management Trainee", "Business Analyst", "Marketing Executive", "HR Manager"]
  },
  {
    name: "Bachelor of Commerce",
    shortName: "B.Com",
    stream: "commerce", 
    field: "finance_accounting",
    level: "undergraduate",
    duration: { years: 3, months: 0 },
    description: "A detailed study of commerce subjects including accounting, economics, business law, and taxation.",
    eligibility: ["12th Commerce or any stream with minimum 50% marks"],
    careerOptions: ["Accountant", "Financial Analyst", "Tax Consultant", "Auditor"]
  },
  {
    name: "Chartered Accountancy",
    shortName: "CA",
    stream: "commerce",
    field: "finance_accounting", 
    level: "undergraduate",
    duration: { years: 4, months: 6 },
    description: "Professional course in accounting, auditing, taxation, and financial management.",
    eligibility: ["12th Commerce with minimum 55% marks"],
    careerOptions: ["Chartered Accountant", "Financial Advisor", "Tax Consultant", "CFO"]
  },
  {
    name: "Bachelor of Economics",
    shortName: "B.Econ",
    stream: "commerce",
    field: "economics_analytics",
    level: "undergraduate", 
    duration: { years: 3, months: 0 },
    description: "Study of economic theory, statistics, econometrics, and economic policy.",
    eligibility: ["12th with Mathematics and minimum 50% marks"],
    careerOptions: ["Economist", "Data Analyst", "Policy Researcher", "Banking Professional"]
  },
  
  // Science PCM courses
  {
    name: "Bachelor of Technology",
    shortName: "B.Tech",
    stream: "science_pcm",
    field: "engineering_technology",
    level: "undergraduate",
    duration: { years: 4, months: 0 },
    description: "Engineering degree in various specializations like Computer Science, Mechanical, Electrical, Civil, etc.",
    eligibility: ["12th PCM with minimum 75% marks", "JEE Main qualification"],
    careerOptions: ["Software Engineer", "Mechanical Engineer", "Civil Engineer", "Data Scientist"]
  },
  {
    name: "Bachelor of Computer Applications",
    shortName: "BCA",
    stream: "science_pcm",
    field: "computer_it",
    level: "undergraduate",
    duration: { years: 3, months: 0 },
    description: "Computer programming, software development, database management, and IT fundamentals.",
    eligibility: ["12th with Mathematics and minimum 50% marks"],
    careerOptions: ["Software Developer", "System Analyst", "Web Developer", "IT Consultant"]
  },
  {
    name: "Bachelor of Architecture",
    shortName: "B.Arch",
    stream: "science_pcm", 
    field: "architecture_design",
    level: "undergraduate",
    duration: { years: 5, months: 0 },
    description: "Design and construction of buildings, urban planning, and architectural theory.",
    eligibility: ["12th PCM with minimum 50% marks", "NATA qualification"],
    careerOptions: ["Architect", "Urban Planner", "Interior Designer", "Landscape Architect"]
  },

  // Science PCB courses  
  {
    name: "Bachelor of Medicine and Bachelor of Surgery",
    shortName: "MBBS",
    stream: "science_pcb",
    field: "medicine",
    level: "undergraduate",
    duration: { years: 5, months: 6 },
    description: "Medical degree for becoming a doctor, includes internship and clinical training.",
    eligibility: ["12th PCB with minimum 50% marks", "NEET qualification"],
    careerOptions: ["Doctor", "Surgeon", "Medical Researcher", "Public Health Officer"]
  },
  {
    name: "Bachelor of Dental Surgery", 
    shortName: "BDS",
    stream: "science_pcb",
    field: "medicine",
    level: "undergraduate",
    duration: { years: 5, months: 0 },
    description: "Dental medicine degree covering oral health, dental surgery, and orthodontics.",
    eligibility: ["12th PCB with minimum 50% marks", "NEET qualification"],
    careerOptions: ["Dentist", "Oral Surgeon", "Orthodontist", "Dental Researcher"]
  },
  {
    name: "Bachelor of Physiotherapy",
    shortName: "BPT",
    stream: "science_pcb",
    field: "allied_health",
    level: "undergraduate", 
    duration: { years: 4, months: 6 },
    description: "Physical therapy, rehabilitation medicine, and movement science.",
    eligibility: ["12th PCB with minimum 50% marks"],
    careerOptions: ["Physiotherapist", "Sports Therapist", "Rehabilitation Specialist", "Clinical Researcher"]
  },

  // Arts courses
  {
    name: "Bachelor of Arts in Psychology",
    shortName: "BA Psychology", 
    stream: "arts",
    field: "psychology_counseling",
    level: "undergraduate",
    duration: { years: 3, months: 0 },
    description: "Study of human behavior, mental processes, and psychological theories.",
    eligibility: ["12th in any stream with minimum 50% marks"],
    careerOptions: ["Psychologist", "Counselor", "HR Professional", "Social Worker"]
  },
  {
    name: "Bachelor of Journalism and Mass Communication",
    shortName: "BJMC",
    stream: "arts",
    field: "media_journalism",
    level: "undergraduate",
    duration: { years: 3, months: 0 },
    description: "Media studies, journalism, communication theory, and digital media.",
    eligibility: ["12th in any stream with minimum 50% marks"],
    careerOptions: ["Journalist", "News Anchor", "Content Writer", "Digital Marketer"]
  },
  {
    name: "Bachelor of Laws",
    shortName: "LLB",
    stream: "arts", 
    field: "law_legal_studies",
    level: "undergraduate",
    duration: { years: 3, months: 0 },
    description: "Legal studies covering constitutional law, criminal law, civil law, and legal procedures.",
    eligibility: ["Graduation in any field"],
    careerOptions: ["Lawyer", "Legal Advisor", "Judge", "Legal Researcher"]
  }
];

async function initializeCourseData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lakshya');
    console.log('Connected to MongoDB');

    // Clear existing courses (optional - comment out if you want to keep existing data)
    // await Course.deleteMany({});
    // console.log('Cleared existing course data');

    // Check if courses already exist
    const existingCourses = await Course.find({});
    console.log(`Found ${existingCourses.length} existing courses`);

    // Insert sample courses
    let insertedCount = 0;
    for (const courseData of sampleCourses) {
      try {
        const existingCourse = await Course.findOne({ name: courseData.name });
        if (!existingCourse) {
          const course = new Course(courseData);
          await course.save();
          console.log(`✅ Created course: ${courseData.name}`);
          insertedCount++;
        } else {
          console.log(`⏭️  Course already exists: ${courseData.name}`);
        }
      } catch (error) {
        console.error(`❌ Error creating course ${courseData.name}:`, error.message);
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`- Total sample courses: ${sampleCourses.length}`);
    console.log(`- New courses created: ${insertedCount}`);
    console.log(`- Total courses in database: ${(await Course.find({})).length}`);

    // Test course queries
    console.log(`\n🧪 Testing course queries:`);
    
    const commerceCourses = await Course.find({ stream: 'commerce' });
    console.log(`- Commerce courses: ${commerceCourses.length}`);
    
    const businessCourses = await Course.find({ field: 'business_management' });
    console.log(`- Business Management courses: ${businessCourses.length}`);
    
    const pcmCourses = await Course.find({ stream: 'science_pcm' });
    console.log(`- Science PCM courses: ${pcmCourses.length}`);

  } catch (error) {
    console.error('❌ Error initializing course data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run the initialization if this file is executed directly
if (require.main === module) {
  initializeCourseData()
    .then(() => {
      console.log('Course data initialization completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Course data initialization failed:', error);
      process.exit(1);
    });
}

module.exports = { initializeCourseData, sampleCourses };