const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const College = require('../models/College');
const connectDB = require('../utils/database/dbConnection');
require('dotenv').config()

const collegesFilePath = path.join(__dirname, '../../colleges.json');

async function initializeColleges() {
  try {
    await connectDB();

    const collegesData = JSON.parse(fs.readFileSync(collegesFilePath, 'utf-8'));
    if (!collegesData || collegesData.length === 0) {
      console.log(chalk.yellow('No colleges found in colleges.json. Skipping initialization.'));
      return;
    }

    console.log(chalk.blue(`Found ${collegesData.length} colleges in colleges.json. Starting initialization...`));

    let addedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const collegeData of collegesData) {
      try {
        // Check if college already exists by name and location
        const existingCollege = await College.findOne({ 
          name: collegeData.name,
          'location.city': collegeData.location.city,
          'location.state': collegeData.location.state
        });

        if (existingCollege) {
          console.log(chalk.gray(`College "${collegeData.name}" in ${collegeData.location.city}, ${collegeData.location.state} already exists. Skipping.`));
          skippedCount++;
        } else {
          const college = new College(collegeData);
          await college.save();
          console.log(chalk.green(`Successfully added college: "${college.name}" in ${college.location.city}, ${college.location.state}`));
          addedCount++;
        }
      } catch (error) {
        console.error(chalk.red(`Error processing college "${collegeData.name}":`), error.message);
        errorCount++;
        // Continue with the next college
      }
    }

    console.log(chalk.green.bold('\n✅ Colleges initialization completed!'));
    console.log(chalk.blue(`📊 Summary:`));
    console.log(chalk.green(`   ✅ Added: ${addedCount} colleges`));
    console.log(chalk.yellow(`   ⏭️  Skipped: ${skippedCount} colleges (already exist)`));
    if (errorCount > 0) {
      console.log(chalk.red(`   ❌ Errors: ${errorCount} colleges`));
    }
    console.log(chalk.blue(`   📝 Total processed: ${collegesData.length} colleges`));

  } catch (error) {
    console.error(chalk.red('Failed to initialize colleges:'), error.message);
    throw error;
  }
}

module.exports = {
  initializeColleges
};