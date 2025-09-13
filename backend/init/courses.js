
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const Course = require('../models/Course');
const connectDB = require('../utils/database/dbConnection');

const coursesFilePath = path.join(__dirname, '../../courses.json');

async function initializeCourses() {
  try {
    await connectDB();

    const coursesData = JSON.parse(fs.readFileSync(coursesFilePath, 'utf-8'));
    if (!coursesData || coursesData.length === 0) {
      console.log(chalk.yellow('No courses found in courses.json. Skipping initialization.'));
      return;
    }

    console.log(chalk.blue(`Found ${coursesData.length} courses in courses.json. Starting initialization...`));

    for (const courseData of coursesData) {
      try {
        const existingCourse = await Course.findOne({ name: courseData.name });

        if (existingCourse) {
          console.log(chalk.gray(`Course "${courseData.name}" already exists. Skipping.`));
        } else {
          const course = new Course(courseData);
          await course.save();
          console.log(chalk.green(`Successfully added course: "${course.name}"`));
        }
      } catch (error) {
        console.error(chalk.red(`Error processing course "${courseData.name}":`), error.message);
        // Continue with the next course
      }
    }

    console.log(chalk.green.bold('\n✅ Courses initialization completed successfully!'));
  } catch (error) {
    console.error(chalk.red.bold('❌ Failed to initialize courses:'), error.message);
    process.exit(1);
  }
}

module.exports = { initializeCourses };
