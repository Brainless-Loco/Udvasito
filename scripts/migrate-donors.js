#!/usr/bin/env node

/**
 * Firebase Donor Database Migration Script
 * Converts existing donors from old naming convention to short form departments
 * 
 * Usage: 
 * - On Linux/Mac: 
 *   export GOOGLE_APPLICATION_CREDENTIALS=path/to/serviceAccountKey.json
 *   node migrate-donors.js
 * 
 * - On Windows PowerShell:
 *   $env:GOOGLE_APPLICATION_CREDENTIALS = "path\to\serviceAccountKey.json"
 *   node migrate-donors.js
 * 
 * WARNING: This script will modify your Firestore database. 
 * Please backup your data before running this script.
 */

// This script should be run in your Firebase project directory
// Install dependencies first: npm install firebase-admin

const admin = require('firebase-admin');
const path = require('path');

// Import the mapping
const DEPARTMENT_SHORT_FORMS = {
  'Accounting': 'acc',
  'Anthropology': 'ant',
  'Applied Chemistry and Chemical Engineering': 'ache',
  'Arabic': 'ara',
  'Bangla': 'ban',
  'Bangladesh Studies': 'bds',
  'Banking and Insurance': 'bi',
  'Biochemistry & Molecular Biology': 'bmb',
  'Botany': 'bot',
  'Chemistry': 'che',
  'Communication and Journalism': 'cj',
  'Computer Science & Engineering': 'cse',
  'Criminology and Police Science': 'cps',
  'Development Studies': 'dev',
  'Dramatics': 'dra',
  'Economics': 'eco',
  'Electrical & Electronic Engineering': 'eee',
  'English': 'eng',
  'Finance': 'fin',
  'Fisheries': 'fsh',
  'Forestry and Environmental Sciences': 'fes',
  'Genetic Engineering & Biotechnology': 'geb',
  'Geography and Environmental Studies': 'geo',
  'History': 'his',
  'Human Resource Management': 'hrm',
  'Institute of Education and Research': 'ier',
  'Institute of Fine Arts': 'ifa',
  'Institute of Marine Sciences': 'ims',
  'Institute of Modern Languages': 'iml',
  'International Relations': 'ir',
  'Islamic History and Culture': 'ihc',
  'Islamic Studies': 'isl',
  'JNIRCMPS': 'jni',
  'Law': 'law',
  'Management': 'mgm',
  'Marketing': 'mkt',
  'Mathematics': 'mat',
  'Microbiology': 'mic',
  'Music': 'mus',
  'Oceanography': 'oce',
  'Pali': 'pal',
  'Persian Language & Literature': 'per',
  'Pharmacy': 'pha',
  'Philosophy': 'phi',
  'Physical Education & Sports Science': 'pes',
  'Physics': 'phy',
  'Political Science': 'pol',
  'Psychology': 'psy',
  'Public Administration': 'pa',
  'Sanskrit': 'san',
  'Sociology': 'soc',
  'Soil Science': 'sls',
  'Statistics': 'sta',
  'Zoology': 'zoo',
};

// Initialize Firebase Admin SDK
// Make sure you have set GOOGLE_APPLICATION_CREDENTIALS environment variable
// pointing to your Firebase service account key JSON file
try {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin SDK');
  console.error('Make sure GOOGLE_APPLICATION_CREDENTIALS environment variable is set');
  process.exit(1);
}

const db = admin.firestore();

async function migrateData() {
  console.log('🚀 Starting donor migration...\n');
  
  try {
    const donorsRef = db.collection('donors');
    const universities = await donorsRef.get();
    
    let totalMigrated = 0;
    let totalFailed = 0;
    
    for (const uniDoc of universities.docs) {
      console.log(`📚 Processing university: ${uniDoc.id}`);
      
      const deptRef = uniDoc.ref.collection('departments');
      const departments = await deptRef.get();
      
      for (const deptDoc of departments.docs) {
        const oldDeptId = deptDoc.id;
        const donorsInDept = await deptDoc.ref.collection('donorList').get();
        
        // Check if this department needs migration
        const shortFormDept = DEPARTMENT_SHORT_FORMS[oldDeptId];
        
        if (!shortFormDept) {
          console.log(`  ⚠️  Skipping department: ${oldDeptId} (already in short form or unknown)`);
          continue;
        }
        
        console.log(`  📂 Migrating department: ${oldDeptId} → ${shortFormDept}`);
        
        // Copy donors from old path to new path
        for (const donorDoc of donorsInDept.docs) {
          try {
            const donorData = donorDoc.data();
            
            // Create new document at new path
            const newPath = `donors/${uniDoc.id}/departments/${shortFormDept}/donorList/${donorDoc.id}`;
            await db.doc(newPath).set(donorData);
            
            totalMigrated++;
          } catch (error) {
            console.error(`    ❌ Failed to migrate donor ${donorDoc.id}: ${error.message}`);
            totalFailed++;
          }
        }
        
        console.log(`  ✅ Migrated ${donorsInDept.size} donors from ${oldDeptId}`);
      }
    }
    
    console.log(`\n✨ Migration complete!`);
    console.log(`📊 Summary:`);
    console.log(`   ✅ Successfully migrated: ${totalMigrated}`);
    console.log(`   ❌ Failed to migrate: ${totalFailed}`);
    console.log(`\n⚠️  IMPORTANT: The old data is still in the database.`);
    console.log(`   You can manually delete it from the Firebase Console if the migration was successful.`);
    console.log(`   Path to delete: /donors/{university}/departments/{OLD_DEPT_NAME}/donorList/*`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
migrateData();
