import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  setDoc,
  doc,
  addDoc,
  updateDoc,
  increment,
  getDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { DEPARTMENT_SHORT_FORMS, BLOOD_GROUPS } from '../config/constants';
import { getDepartmentDisplayName, getDepartmentShortForm } from '../utils/departmentHelper';

const FirebaseContext = createContext();

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export const FirebaseProvider = ({ children }) => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    byBloodGroup: {},
  });

  // Collection references
  const volunteersCollection = collection(db, 'volunteers');
  const eventsCollection = collection(db, 'events');
  const blogsCollection = collection(db, 'blogs');
  const successStoriesCollection = collection(db, 'successStories');
  const galleryCollection = collection(db, 'gallery');
  const faqCollection = collection(db, 'faq');
  const testimonialsCollection = collection(db, 'testimonials');
  const availabilityRequestsCollection = collection(db, 'availabilityRequests');
  const statsRef = doc(db, 'stats', 'global');

  // Fetch stats from /stats/global document
  const fetchStats = async () => {
    try {
      console.log('📊 Fetching stats from /stats/global...');
      const statsSnap = await getDoc(statsRef);
      
      if (statsSnap.exists()) {
        const globalStats = statsSnap.data();
        console.log('✅ Stats fetched:', globalStats);
        setStats({
          total: globalStats.totalDonors || 0,
          available: globalStats.availableDonors || 0,
          byBloodGroup: globalStats.byBloodGroup || {},
        });
        return globalStats;
      } else {
        // Initialize stats if doesn't exist
        console.log('⚠️ Stats document not found, initializing...');
        const initialStats = {
          totalDonors: 0,
          availableDonors: 0,
          byBloodGroup: Object.fromEntries(BLOOD_GROUPS.map(bg => [bg, 0])),
          createdAt: new Date().toISOString(),
        };
        await setDoc(statsRef, initialStats);
        setStats({
          total: 0,
          available: 0,
          byBloodGroup: initialStats.byBloodGroup,
        });
        return initialStats;
      }
    } catch (err) {
      console.error('❌ Error fetching stats:', err);
      return null;
    }
  };

  // Fetch all donors from blood group structure: /donors/{bloodGroup}/donors/{donorId}
  const fetchDonors = async () => {
    try {
      setLoading(true);
      console.log('=== FETCHING DONORS FROM BLOOD GROUP STRUCTURE ===');
      console.log('Structure: /donors/{bloodGroup}/donors/{donorId}');
      
      const donorsRef = collection(db, 'donors');
      const bloodGroupDocs = await getDocs(donorsRef);
      const donorsList = [];

      console.log('🩸 Blood groups found:', bloodGroupDocs.docs.length);

      for (const bloodGroupDoc of bloodGroupDocs.docs) {
        const bloodGroup = bloodGroupDoc.id;
        console.log(`\n📍 Processing blood group: ${bloodGroup}`);
        
        try {
          // Get all donors under this blood group
          const donorsSubCollection = collection(bloodGroupDoc.ref, 'donors');
          const donorDocs = await getDocs(donorsSubCollection);
          
          if (donorDocs.docs.length > 0) {
            console.log(`   💉 ${bloodGroup}: ${donorDocs.docs.length} donors`);

            donorDocs.forEach((donorDoc) => {
              const donorData = {
                id: donorDoc.id,
                bloodGroup: bloodGroup,
                ...donorDoc.data(),
              };
              donorsList.push(donorData);
            });
          }
        } catch (err) {
          console.log(`   ⏭️  No donors found under ${bloodGroup}`);
        }
      }

      console.log(`\n✅ Total donors fetched: ${donorsList.length}`);
      setDonors(donorsList);
      
      // Fetch stats separately
      await fetchStats();
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('❌ Error fetching donors:', err);
    } finally {
      setLoading(false);
    }
  };

  

  // Add a new donor with blood group structure: /donors/{bloodGroup}/donors/{donorId}
  const addDonor = async (donorData) => {
    try {
      const bloodGroup = donorData.bloodGroup || 'O+';
      
      // Sanitize function for IDs
      const sanitizeId = (str) => str.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase().slice(0, 64);
      
      // Generate unique donor ID (using email as primary key since it's unique)
      let donorId = donorData.email ? sanitizeId(donorData.email) : `donor_${Date.now()}`;
      let finalDonorId = donorId;

      // Check for duplicate IDs in this blood group
      const donorSubCollectionRef = collection(db, 'donors', bloodGroup, 'donors');
      const snapshot = await getDocs(donorSubCollectionRef);
      const existingIds = snapshot.docs.map(d => d.id);

      // If ID exists, append suffix with timestamp
      if (existingIds.includes(donorId)) {
        finalDonorId = `${donorId}_${Date.now()}`;
      }

      const timestampData = {
        ...donorData,
        bloodGroup: bloodGroup,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Create blood group document if doesn't exist
      const bgDocRef = doc(db, 'donors', bloodGroup);
      const bgDocSnap = await getDoc(bgDocRef);
      if (!bgDocSnap.exists()) {
        console.log(`Creating blood group document: ${bloodGroup}`);
        await setDoc(bgDocRef, { 
          bloodGroup: bloodGroup,
          createdAt: new Date().toISOString(),
        });
      }

      // Set the donor document at: /donors/{bloodGroup}/donors/{donorId}
      const donorDocRef = doc(db, 'donors', bloodGroup, 'donors', finalDonorId);
      await setDoc(donorDocRef, timestampData);

      console.log('✅ Donor added successfully:', {
        path: `donors/${bloodGroup}/donors/${finalDonorId}`,
        bloodGroup: bloodGroup,
        email: donorData.email,
      });

      // Update stats
      const isAvailable = donorData.isAvailable === 'yes' || donorData.isAvailable === true;
      
      const statsUpdateData = {
        totalDonors: increment(1),
      };
      if (isAvailable) {
        statsUpdateData.availableDonors = increment(1);
      }
      statsUpdateData[`byBloodGroup.${bloodGroup}`] = increment(1);

      await updateDoc(statsRef, statsUpdateData);
      console.log('✅ Stats updated');

      return { success: true, id: finalDonorId };
    } catch (err) {
      console.error('❌ Error adding donor:', err);
      return { success: false, error: err.message };
    }
  };

  // Add a new volunteer
  const addVolunteer = async (volunteerData) => {
    try {
      const docRef = await addDoc(volunteersCollection, {
        ...volunteerData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return { success: true, id: docRef.id };
    } catch (err) {
      console.error('Error adding volunteer:', err);
      return { success: false, error: err.message };
    }
  };

  // Add availability request
  const addAvailabilityRequest = async (requestData) => {
    try {
      const docRef = await addDoc(availabilityRequestsCollection, {
        ...requestData,
        createdAt: new Date().toISOString(),
      });
      return { success: true, id: docRef.id };
    } catch (err) {
      console.error('Error adding availability request:', err);
      return { success: false, error: err.message };
    }
  };

  // Search donors with filters - optimized for blood group structure
  const searchDonors = (filters, limit = true) => {
    let filtered = [...donors];

    // Filter by blood group (primary filter for optimization)
    if (filters.bloodGroup) {
      filtered = filtered.filter((d) => d.bloodGroup === filters.bloodGroup);
    }

    // Filter by department
    if (filters.department) {
      const deptLower = filters.department.toLowerCase();
      filtered = filtered.filter((d) => {
        const dept = d.department?.toLowerCase() || '';
        return dept.includes(deptLower) || 
               deptLower.split(' ').some(word => dept.includes(word));
      });
    }

    // Filter by address
    if (filters.address) {
      const addressLower = filters.address.toLowerCase();
      filtered = filtered.filter((d) => {
        const current = d.currentAddress?.toLowerCase() || '';
        const permanent = d.permanentAddress?.toLowerCase() || '';
        const matchesAddress = (addr) => {
          if (!addr) return false;
          return addr.includes(addressLower) || 
                 addressLower.split(' ').some(word => addr.includes(word)) ||
                 addr.startsWith(addressLower) ||
                 addr.endsWith(addressLower) ||
                 addressLower.split(/[\s,]+/).every(word => addr.includes(word.trim()));
        };
        return matchesAddress(current) || matchesAddress(permanent);
      });
    }

    // Filter by gender
    if (filters.gender) {
      filtered = filtered.filter((d) => d.gender === filters.gender);
    }

    // Filter by availability
    if (filters.isAvailable !== undefined && filters.isAvailable !== '') {
      const available = filters.isAvailable === 'true' || filters.isAvailable === true;
      filtered = filtered.filter((d) => d.isAvailable === available);
    }

    // Filter by donation history
    if (filters.hasDonatedBefore !== undefined && filters.hasDonatedBefore !== '') {
      const donated = filters.hasDonatedBefore === 'true' || filters.hasDonatedBefore === true;
      filtered = filtered.filter((d) => d.hasDonatedBefore === donated);
    }

    // If limit is false, return all results
    if (!limit) {
      return filtered;
    }

    // Limit to 5 available donors per blood group
    const limitedByBloodGroup = {};
    const result = [];
    const MAX_PER_BLOOD_GROUP = 5;

    for (const donor of filtered) {
      const bloodGroup = donor.bloodGroup || 'Unknown';
      
      if (!limitedByBloodGroup[bloodGroup]) {
        limitedByBloodGroup[bloodGroup] = 0;
      }

      if (limitedByBloodGroup[bloodGroup] < MAX_PER_BLOOD_GROUP) {
        result.push(donor);
        limitedByBloodGroup[bloodGroup]++;
      }
    }

    return result;
  };

  // Fetch collection data
  const fetchCollection = async (collectionRef) => {
    try {
      const snapshot = await getDocs(collectionRef);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (err) {
      console.error('Error fetching collection:', err);
      return [];
    }
  };

  // Fetch events
  const fetchEvents = () => fetchCollection(eventsCollection);

  // Fetch blogs
  const fetchBlogs = () => fetchCollection(blogsCollection);

  // Fetch success stories
  const fetchSuccessStories = () => fetchCollection(successStoriesCollection);

  // Fetch gallery items
  const fetchGallery = () => fetchCollection(galleryCollection);

  // Fetch FAQs
  const fetchFAQs = () => fetchCollection(faqCollection);

  // Fetch testimonials
  const fetchTestimonials = () => fetchCollection(testimonialsCollection);

  useEffect(() => {
    // Only fetch stats on mount - donors are fetched on demand by find-donor page
    fetchStats();
    return () => {};
    // eslint-disable-next-line
  }, []);

  const value = {
    donors,
    loading,
    error,
    stats,
    fetchDonors,
    addDonor,
    addVolunteer,
    addAvailabilityRequest,
    searchDonors,
    fetchEvents,
    fetchBlogs,
    fetchSuccessStories,
    fetchGallery,
    fetchFAQs,
    fetchTestimonials,
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseContext;
