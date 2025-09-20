const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const Exam = require('./models/Exam');
require('dotenv').config();

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lakshya');
    console.log(chalk.green(`✅ MongoDB Connected: ${conn.connection.host}`));
  } catch (error) {
    console.error(chalk.red('❌ Database connection error:'), error.message);
    process.exit(1);
  }
};

// Function to initialize exam data
async function initializeExamData() {
  try {
    console.log(chalk.blue('🚀 Starting exam data initialization...\n'));

    // Connect to database
    await connectDB();

    // Check if exams.json exists
    const examsFilePath = path.join(__dirname, '..', 'exams.json');
    if (!fs.existsSync(examsFilePath)) {
      console.log(chalk.red('❌ exams.json file not found!'));
      console.log(chalk.yellow(`   Looking for: ${examsFilePath}`));
      process.exit(1);
    }

    // Load exam data from JSON file
    const examsData = JSON.parse(fs.readFileSync(examsFilePath, 'utf-8'));
    
    if (!examsData || examsData.length === 0) {
      console.log(chalk.yellow('⚠️  No exam data found in exams.json'));
      process.exit(0);
    }

    console.log(chalk.blue(`📄 Found ${examsData.length} exams in exams.json\n`));

    // Step 1: Remove all existing exams
    console.log(chalk.yellow('🗑️  Removing all existing exams from database...'));
    const deleteResult = await Exam.deleteMany({});
    console.log(chalk.green(`✅ Removed ${deleteResult.deletedCount} existing exams\n`));

    // Step 2: Insert new exam data
    console.log(chalk.blue('📥 Importing new exam data...\n'));
    
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < examsData.length; i++) {
      const examData = examsData[i];
      
      try {
        // Create new exam instance
        const exam = new Exam(examData);
        
        // Validate the exam data
        await exam.validate();
        
        // Save to database
        await exam.save();
        
        successCount++;
        console.log(chalk.green(`✅ [${i + 1}/${examsData.length}] Added: "${exam.name}"`));
        
      } catch (error) {
        errorCount++;
        console.log(chalk.red(`❌ [${i + 1}/${examsData.length}] Failed to add "${examData.name || 'Unknown'}": ${error.message}`));
      }
    }

    // Step 3: Final summary
    console.log(chalk.blue('\n📊 Import Summary:'));
    console.log(chalk.blue('================'));
    console.log(chalk.green(`✅ Successfully imported: ${successCount} exams`));
    
    if (errorCount > 0) {
      console.log(chalk.red(`❌ Failed to import: ${errorCount} exams`));
    }
    
    console.log(chalk.blue(`📋 Total processed: ${examsData.length} exams`));

    // Verify the data in database
    const totalExamsInDB = await Exam.countDocuments();
    console.log(chalk.blue(`🗄️  Total exams now in database: ${totalExamsInDB}`));

    if (successCount === examsData.length && totalExamsInDB === examsData.length) {
      console.log(chalk.green('\n🎉 Exam data initialization completed successfully!'));
    } else {
      console.log(chalk.yellow('\n⚠️  Exam data initialization completed with some issues.'));
    }

  } catch (error) {
    console.error(chalk.red('\n❌ Initialization failed:'), error.message);
    if (process.env.NODE_ENV === 'development') {
      console.error(chalk.gray('Stack trace:'), error.stack);
    }
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log(chalk.gray('\n🔌 Database connection closed.'));
  }
}

// Additional utility functions
async function clearAllExams() {
  try {
    await connectDB();
    
    console.log(chalk.yellow('🗑️  Clearing all exams from database...'));
    const deleteResult = await Exam.deleteMany({});
    console.log(chalk.green(`✅ Removed ${deleteResult.deletedCount} exams from database`));
    
    await mongoose.connection.close();
  } catch (error) {
    console.error(chalk.red('❌ Error clearing exams:'), error.message);
    process.exit(1);
  }
}

async function showExamStats() {
  try {
    await connectDB();
    
    const totalExams = await Exam.countDocuments();
    const examsByStream = await Exam.aggregate([
      { $unwind: '$streams' },
      { $group: { _id: '$streams', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log(chalk.blue('📊 Current Exam Statistics:'));
    console.log(chalk.blue('==========================='));
    console.log(chalk.green(`Total exams: ${totalExams}`));
    console.log(chalk.blue('\nExams by stream:'));
    
    examsByStream.forEach(stream => {
      console.log(chalk.cyan(`  ${stream._id}: ${stream.count} exams`));
    });
    
    await mongoose.connection.close();
  } catch (error) {
    console.error(chalk.red('❌ Error getting exam stats:'), error.message);
    process.exit(1);
  }
}

// Handle command line arguments
const command = process.argv[2];

switch (command) {
  case 'clear':
    clearAllExams();
    break;
  case 'stats':
    showExamStats();
    break;
  case 'init':
  default:
    initializeExamData();
    break;
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log(chalk.yellow('\n⚠️  Process interrupted. Cleaning up...'));
  await mongoose.connection.close();
  process.exit(0);
});

module.exports = { initializeExamData, clearAllExams, showExamStats };