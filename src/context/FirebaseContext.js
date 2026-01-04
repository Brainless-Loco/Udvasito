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

  // Fetch all donors from new structure: /donors/{uniName}/{deptShortForm}/{donorId}
  const fetchDonors = async () => {
    try {
      setLoading(true);
      console.log('=== FETCHING DONORS FROM NEW STRUCTURE ===');
      console.log('Structure: /donors/{uniName}/{deptShortForm}/{donorId}');
      
      const donorsRef = collection(db, 'donors');
      const uniDocs = await getDocs(donorsRef);
      const donorsList = [];

      console.log('📚 Universities found:', uniDocs.docs.length);

      for (const uniDoc of uniDocs.docs) {
        const uniName = uniDoc.id;
        console.log(`\n📍 Processing university: ${uniName}`);
        
        // Get all department collections under this university
        // Department collections are stored directly under the university document
        const departmentShortForms = Object.values(DEPARTMENT_SHORT_FORMS);

        console.log(`   Checking ${departmentShortForms.length} possible departments...`);

        for (const deptShortForm of departmentShortForms) {
          try {
            const deptRef = collection(uniDoc.ref, deptShortForm);
            const donorDocs = await getDocs(deptRef);
            
            if (donorDocs.docs.length > 0) {
              const fullDepartmentName = getDepartmentDisplayName(deptShortForm);
              console.log(`   📂 ${deptShortForm} (${fullDepartmentName}): ${donorDocs.docs.length} donors`);

              donorDocs.forEach((donorDoc) => {
                const donorData = {
                  id: donorDoc.id,
                  university: uniName,
                  department: fullDepartmentName,
                  departmentShortForm: deptShortForm,
                  ...donorDoc.data(),
                };
                donorsList.push(donorData);
              });
            }
          } catch (err) {
            // Department collection might not exist, skip
            // console.log(`   ⏭️  Department ${deptShortForm} not found`);
          }
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

  // Real-time listener for donors
  const subscribeToDonors = () => {
    // Using a polling approach since Firestore doesn't support real-time listeners across collections
    // Poll every 30 seconds instead of 5 to reduce server load and re-renders
    const interval = setInterval(() => {
      fetchDonors();
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  };

  // Add a new donor with new structure: /donors/{uniName}/{deptShortForm}/{donorId}
  const addDonor = async (donorData) => {
    try {
      const university = donorData.institution === 'Other' ? donorData.otherInstitution : donorData.institution;
      const department = donorData.department === 'Other' ? donorData.otherDepartment : donorData.department;

      // Use university name directly as document ID (sanitized)
      const sanitizeId = (str) => str.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase().slice(0, 64);
      const uniName = sanitizeId(university);
      
      // Use short form for department
      const deptShortForm = getDepartmentShortForm(department);

      // Generate donor ID (using student ID or timestamp)
      let donorId = donorData.studentId ? sanitizeId(donorData.studentId) : `donor_${Date.now()}`;
      let finalDonorId = donorId;

      // Check for duplicate IDs in this department
      const deptRef = collection(db, 'donors', uniName, deptShortForm);
      const snapshot = await getDocs(deptRef);
      const existingIds = snapshot.docs.map(d => d.id);

      // If ID exists, append suffix
      if (existingIds.includes(donorId)) {
        let counter = 2;
        while (existingIds.includes(`${donorId}-${counter}`)) {
          counter++;
        }
        finalDonorId = `${donorId}-${counter}`;
      }

      const timestampData = {
        ...donorData,
        university,
        department, // Store full department name
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Create university document if doesn't exist
      const uniDocRef = doc(db, 'donors', uniName);
      const uniDocSnap = await getDoc(uniDocRef);
      if (!uniDocSnap.exists()) {
        console.log(`Creating university document: ${uniName}`);
        await setDoc(uniDocRef, { 
          name: university,
          createdAt: new Date().toISOString(),
        });
      }

      // Set the donor document at: /donors/{uniName}/{deptShortForm}/{donorId}
      const donorDocRef = doc(db, 'donors', uniName, deptShortForm, finalDonorId);
      await setDoc(donorDocRef, timestampData);

      console.log('✅ Donor added successfully:', {
        path: `donors/${uniName}/${deptShortForm}/${finalDonorId}`,
        fullDepartmentName: department,
      });

      // Update stats
      const bloodGroup = donorData.bloodGroup || 'O+';
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

  // Search donors with filters
  const searchDonors = (filters) => {
    let filtered = [...donors];

    if (filters.bloodGroup) {
      filtered = filtered.filter((d) => d.bloodGroup === filters.bloodGroup);
    }
    if (filters.department) {
      const deptLower = filters.department.toLowerCase();
      filtered = filtered.filter((d) => {
        const dept = d.department?.toLowerCase() || '';
        // Check if department includes, starts with, or ends with the search term
        return dept.includes(deptLower) || 
               deptLower.split(' ').some(word => dept.includes(word));
      });
    }
    if (filters.address) {
      const addressLower = filters.address.toLowerCase();
      filtered = filtered.filter((d) => {
        const current = d.currentAddress?.toLowerCase() || '';
        const permanent = d.permanentAddress?.toLowerCase() || '';
        // Check prefix, suffix, contains, and word matching
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
    if (filters.gender) {
      filtered = filtered.filter((d) => d.gender === filters.gender);
    }
    if (filters.isAvailable !== undefined && filters.isAvailable !== '') {
      const available = filters.isAvailable === 'true' || filters.isAvailable === true;
      filtered = filtered.filter((d) => d.isAvailable === available);
    }
    if (filters.hasDonatedBefore !== undefined && filters.hasDonatedBefore !== '') {
      const donated = filters.hasDonatedBefore === 'true' || filters.hasDonatedBefore === true;
      filtered = filtered.filter((d) => d.hasDonatedBefore === donated);
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

      // Only add donor if we haven't reached the limit for their blood group
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
    // Fetch donors immediately on mount
    fetchDonors();
    // Don't set up polling - fetch on demand only to prevent continuous fetching
    // Users can refresh manually or data updates when they perform actions
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
