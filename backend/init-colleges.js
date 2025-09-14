const { initializeColleges } = require('./init/colleges');

/**
 * Standalone script to initialize only colleges data
 * Run this script to populate the database with colleges from colleges.json
 */
async function main() {
  console.log('🏛️ Lakshya Colleges Database Initialization');
  console.log('===========================================\n');

  try {
    await initializeColleges();
    console.log('\n🎉 Colleges initialization completed successfully!');
    console.log('💡 You can now use the colleges data in your application.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Colleges initialization failed:', error.message);
    process.exit(1);
  }
}

// Check if this script is being run directly
if (require.main === module) {
  main();
}

module.exports = {
  main
};