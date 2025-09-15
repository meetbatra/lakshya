const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lakshya';

// Mapping from old field values to new field values
const fieldMapping = {
  // Science PCM fields
  'engineering': 'engineering_technology',
  'architecture': 'architecture_design',
  'pure_sciences': 'pure_sciences_research',
  'computer_science': 'computer_it',
  
  // Science PCB fields
  'dentistry': 'allied_health',
  'pharmacy': 'allied_health',
  'nursing': 'allied_health',
  // 'medicine' stays the same
  // 'biotechnology' stays the same
  
  // Commerce fields
  'ca': 'finance_accounting',
  'cs': 'finance_accounting',
  'bcom': 'business_management',
  'bba': 'business_management',
  'economics': 'economics_analytics',
  
  // Arts fields
  'ba': 'social_sciences',
  'journalism': 'journalism_media',
  'sociology': 'social_sciences',
  'literature': 'fine_arts_design'
  // 'psychology' stays the same
};

async function fixUserFields() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all users with old field values
    const usersToUpdate = await User.find({
      field: { $in: Object.keys(fieldMapping) }
    });

    console.log(`Found ${usersToUpdate.length} users with old field values`);

    if (usersToUpdate.length === 0) {
      console.log('No users need field updates');
      return;
    }

    // Update each user
    for (const user of usersToUpdate) {
      const oldField = user.field;
      const newField = fieldMapping[oldField];
      
      if (newField) {
        await User.findByIdAndUpdate(user._id, { field: newField });
        console.log(`Updated user ${user.email}: ${oldField} → ${newField}`);
      }
    }

    console.log('✅ Successfully updated all user field values');

  } catch (error) {
    console.error('❌ Error fixing user fields:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

fixUserFields();