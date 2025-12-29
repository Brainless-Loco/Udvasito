import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../config/firebase';

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
  const donorsCollection = collection(db, 'donors');
  const volunteersCollection = collection(db, 'volunteers');
  const eventsCollection = collection(db, 'events');
  const blogsCollection = collection(db, 'blogs');
  const successStoriesCollection = collection(db, 'successStories');
  const galleryCollection = collection(db, 'gallery');
  const faqCollection = collection(db, 'faq');
  const testimonialsCollection = collection(db, 'testimonials');

  // Fetch all donors
  const fetchDonors = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(donorsCollection);
      const donorsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDonors(donorsList);
      calculateStats(donorsList);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching donors:', err);
    } finally {
      setLoading(false);
    }
  };

  // Real-time listener for donors
  const subscribeToDonors = () => {
    const unsubscribe = onSnapshot(
      donorsCollection,
      (snapshot) => {
        const donorsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDonors(donorsList);
        calculateStats(donorsList);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return unsubscribe;
  };

  // Calculate statistics
  const calculateStats = (donorsList) => {
    const byBloodGroup = {};
    let available = 0;

    donorsList.forEach((donor) => {
      const bg = donor.bloodGroup;
      byBloodGroup[bg] = (byBloodGroup[bg] || 0) + 1;
      if (donor.isAvailable) available++;
    });

    setStats({
      total: donorsList.length,
      available,
      byBloodGroup,
    });
  };

  // Add a new donor
  const addDonor = async (donorData) => {
    try {
      const docRef = await addDoc(donorsCollection, {
        ...donorData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return { success: true, id: docRef.id };
    } catch (err) {
      console.error('Error adding donor:', err);
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

  // Search donors with filters
  const searchDonors = (filters) => {
    let filtered = [...donors];

    if (filters.bloodGroup) {
      filtered = filtered.filter((d) => d.bloodGroup === filters.bloodGroup);
    }
    if (filters.department) {
      filtered = filtered.filter((d) =>
        d.department?.toLowerCase().includes(filters.department.toLowerCase())
      );
    }
    if (filters.address) {
      filtered = filtered.filter(
        (d) =>
          d.currentAddress?.toLowerCase().includes(filters.address.toLowerCase()) ||
          d.permanentAddress?.toLowerCase().includes(filters.address.toLowerCase())
      );
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

    return filtered;
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
    const unsubscribe = subscribeToDonors();
    return () => unsubscribe();
  }, []);

  const value = {
    donors,
    loading,
    error,
    stats,
    fetchDonors,
    addDonor,
    addVolunteer,
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
