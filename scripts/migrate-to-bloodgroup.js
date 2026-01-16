#!/usr/bin/env node

/**
 * Firebase Donor Database Migration Script
 * Converts donors from university/department structure to blood group structure
 * Old Structure: /donors/{university}/{department}/{donorId}
 * New Structure: /donors/{bloodGroup}/donors/{donorId}
 * 
 * Usage: 
 * - On Linux/Mac: 
 *   export GOOGLE_APPLICATION_CREDENTIALS=path/to/serviceAccountKey.json
 *   node migrate-to-bloodgroup.js
 * 
 * - On Windows PowerShell:
 *   $env:GOOGLE_APPLICATION_CREDENTIALS = "path\to\serviceAccountKey.json"
 *   node migrate-to-bloodgroup.js
 * 
 * WARNING: This script will modify your Firestore database. 
 * Please backup your data before running this script.
 */

const admin = require('firebase-admin');

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

const BLOOD_GROUPS = [
  'O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'
];

async function migrateData() {
  console.log('🚀 Starting migration to blood group structure...\n');
  
  const batch = db.batch();
  let migratedCount = 0;
  let failedCount = 0;
  let totalDonors = 0;
  
  try {
    // Step 1: Fetch all donors from old structure
    console.log('📖 Reading donors from old structure...');
    const donorsRef = db.collection('donors');
    const universitiesDocs = await donorsRef.get();
    
    console.log(`📚 Found ${universitiesDocs.docs.length} university collections\n`);
    
    // Step 2: Migrate each donor
    for (const universityDoc of universitiesDocs.docs) {
      const universityName = universityDoc.id;
      console.log(`Processing university: ${universityName}`);
      
      // Get all departments under this university
      const departmentsRefs = await universityDoc.ref.getCollections();
      
      for (const deptRef of departmentsRefs) {
        const departmentName = deptRef.id;
        
        // Get all donors in this department
        const donorsDocs = await deptRef.get();
        console.log(`  📂 ${departmentName}: ${donorsDocs.docs.length} donors`);
        
        for (const donorDoc of donorsDocs.docs) {
          totalDonors++;
          try {
            const donorData = donorDoc.data();
            const bloodGroup = donorData.bloodGroup;
            
            if (!bloodGroup) {
              console.log(`    ⚠️ Donor ${donorDoc.id} has no blood group, skipping...`);
              failedCount++;
              continue;
            }
            
            if (!BLOOD_GROUPS.includes(bloodGroup)) {
              console.log(`    ⚠️ Invalid blood group "${bloodGroup}" for donor ${donorDoc.id}, skipping...`);
              failedCount++;
              continue;
            }
            
            // Create blood group document if needed
            const bgDocRef = db.collection('donors').doc(bloodGroup);
            batch.set(bgDocRef, {
              bloodGroup: bloodGroup,
              createdAt: admin.firestore.FieldValue.serverTimestamp(),
            }, { merge: true });
            
            // Create new donor document in blood group subcollection
            const newDonorRef = bgDocRef.collection('donors').doc(donorDoc.id);
            batch.set(newDonorRef, {
              ...donorData,
              bloodGroup: bloodGroup,
              migratedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            
            // Delete old document
            batch.delete(donorDoc.ref);
            
            migratedCount++;
            
            // Commit batch every 500 operations (Firestore limit)
            if ((migratedCount + failedCount) % 500 === 0) {
              console.log(`    Writing batch (${migratedCount} migrated so far)...`);
              await batch.commit();
            }
          } catch (error) {
            console.error(`    ❌ Error migrating donor ${donorDoc.id}:`, error.message);
            failedCount++;
          }
        }
      }
    }
    
    // Final batch commit
    if (migratedCount + failedCount > 0) {
      console.log('\n📝 Writing final batch...');
      await batch.commit();
    }
    
    console.log('\n✅ Migration completed!');
    console.log(`📊 Statistics:`);
    console.log(`   Total donors processed: ${totalDonors}`);
    console.log(`   ✅ Successfully migrated: ${migratedCount}`);
    console.log(`   ❌ Failed: ${failedCount}`);
    
    // Update stats document
    console.log('\n📈 Updating stats document...');
    const statsRef = db.collection('stats').doc('global');
    const statsSnap = await statsRef.get();
    
    if (statsSnap.exists) {
      console.log('Rebuilding stats from new structure...');
      const bloodGroupStats = {};
      let totalAvailable = 0;
      let totalDonorsCount = 0;
      
      for (const bloodGroup of BLOOD_GROUPS) {
        const donorsSnap = await db.collection('donors').doc(bloodGroup).collection('donors').get();
        const total = donorsSnap.size;
        const available = donorsSnap.docs.filter(d => d.data().isAvailable === true).length;
        
        bloodGroupStats[bloodGroup] = total;
        totalDonorsCount += total;
        totalAvailable += available;
        
        console.log(`   ${bloodGroup}: ${total} total, ${available} available`);
      }
      
      await statsRef.update({
        totalDonors: totalDonorsCount,
        availableDonors: totalAvailable,
        byBloodGroup: bloodGroupStats,
        migratedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    
    console.log('\n🎉 Migration successful!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateData().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
