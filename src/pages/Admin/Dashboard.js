import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Chip from '@mui/material/Chip';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DownloadIcon from '@mui/icons-material/Download';

import {
    Dashboard as DashboardIcon,
    Logout as LogoutIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    CheckCircle as CheckIcon,
    Cancel as CancelIcon,
    People as PeopleIcon,
    School as SchoolIcon,
    Notifications as NotificationsIcon,
    Bloodtype as BloodtypeIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, updateDoc, deleteDoc, doc, getDoc, increment, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { getDepartmentDisplayName } from '../../utils/departmentHelper';
import { DEPARTMENT_SHORT_FORMS } from '../../config/constants';
import Swal from 'sweetalert2';
import RequestTrendChart from '../../components/Admin/RequestTrendChart';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [donors, setDonors] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);
    const [editDialog, setEditDialog] = useState(false);
    const [selectedDonor, setSelectedDonor] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [sortConfig, setSortConfig] = useState({ key: 'fullName', direction: 'asc' });
    const [filters, setFilters] = useState({
        searchName: '',
        university: '',
        department: '',
        bloodGroup: '',
        gender: '',
        isAvailable: '',
        hasDonatedBefore: '',
    });
    const [stats, setStats] = useState({
        totalDonors: 0,
        availableDonors: 0,
        pendingRequests: 0,
        totalUniversities: 0,
        universityStats: {},
        departmentStats: {},
    });

    // Check authentication on mount
    useEffect(() => {
        const adminAuth = localStorage.getItem('adminAuth');
        if (!adminAuth) {
            navigate('/special/admin');
            return;
        }

        try {
            const authData = JSON.parse(adminAuth);
            
            // Check if session has expired (12 hours)
            if (authData.expiryTime && new Date().getTime() > authData.expiryTime) {
                localStorage.removeItem('adminAuth');
                Swal.fire({
                    icon: 'info',
                    title: 'Session Expired',
                    text: 'Your admin session has expired. Please login again.',
                    confirmButtonColor: '#1d3557',
                });
                navigate('/special/admin');
                return;
            }

            fetchData();
        } catch (error) {
            console.error('Auth validation error:', error);
            localStorage.removeItem('adminAuth');
            navigate('/special/admin');
        }
    }, [navigate]);

    // Helper function to sanitize for ID
    const sanitizeId = (str) => str.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase().slice(0, 64);

    // Fetch all data with blood group structure
    const fetchData = async () => {
        try {
            setLoading(true);
            console.log('=== ADMIN DASHBOARD: Starting data fetch ===');
            console.log('New architecture: /donors/{bloodGroup}/donors/{donorId}');
            console.time('Dashboard Load Time');
            
            // Fetch donors organized by blood group
            const donorsRef = collection(db, 'donors');
            const bloodGroupDocs = await getDocs(donorsRef);
            console.log('🩸 Blood groups found:', bloodGroupDocs.docs.length);
            
            const allDonors = [];
            const bloodGroupStats = {};

            // Fetch all donors for all blood groups in parallel
            const allPromises = [];

            for (const bgDoc of bloodGroupDocs.docs) {
                const bloodGroup = bgDoc.id;
                bloodGroupStats[bloodGroup] = { total: 0, available: 0 };
                
                // Create promise for donors under this blood group
                const promise = getDocs(collection(bgDoc.ref, 'donors'))
                    .then(donorDocs => ({
                        bloodGroup,
                        donorDocs,
                    }))
                    .catch(() => ({
                        bloodGroup,
                        donorDocs: { docs: [] },
                    }));
                
                allPromises.push(promise);
            }

            // Wait for all queries to complete in parallel
            const results = await Promise.all(allPromises);
            
            // Process results
            for (const result of results) {
                const { bloodGroup, donorDocs } = result;
                
                if (donorDocs.docs.length > 0) {
                    console.log(`   💉 ${bloodGroup}: ${donorDocs.docs.length} donors`);

                    donorDocs.forEach((donorDocData) => {
                        const isAvailable = donorDocData.data().isAvailable === true;
                        const donorData = {
                            id: donorDocData.id,
                            bloodGroup: bloodGroup,
                            ...donorDocData.data(),
                        };
                        allDonors.push(donorData);
                        
                        // Update stats
                        bloodGroupStats[bloodGroup].total++;
                        if (isAvailable) bloodGroupStats[bloodGroup].available++;
                    });
                }
            }

            console.log('\n✅ Total donors fetched:', allDonors.length);
            console.timeEnd('Dashboard Load Time');

            // Fetch availability requests and global stats in parallel
            // eslint-disable-next-line
            const [statsData, reqDocs] = await Promise.all([
                getDoc(doc(db, 'stats', 'global')).catch(() => null),
                getDocs(collection(db, 'availabilityRequests')),
            ]);
            
            console.log('📋 Availability requests found:', reqDocs.docs.length);
            
            const allRequests = reqDocs.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setDonors(allDonors);
            setRequests(allRequests);

            // Use stats from collection if available, otherwise calculate
            let stats = {};
            if (statsData && statsData.exists()) {
                const globalStats = statsData.data();
                console.log('📊 Using stats from collection:', globalStats);
                stats = {
                    totalDonors: globalStats.totalDonors || 0,
                    availableDonors: globalStats.availableDonors || 0,
                    pendingRequests: allRequests.filter((r) => r.status === 'pending').length,
                    totalBloodGroups: Object.keys(bloodGroupStats).length,
                    bloodGroupStats,
                };
            } else {
                // Fallback: calculate stats locally
                console.log('📊 Stats collection not found, calculating locally');
                stats = {
                    totalDonors: allDonors.length,
                    availableDonors: allDonors.filter((d) => d.isAvailable === true).length,
                    pendingRequests: allRequests.filter((r) => r.status === 'pending').length,
                    totalBloodGroups: Object.keys(bloodGroupStats).length,
                    bloodGroupStats,
                };
            }
            
            console.log('📊 Stats calculated:', stats);
            setStats(stats);
            console.log('=== ADMIN DASHBOARD: Data fetch complete ===');
        } catch (error) {
            console.error('=== ERROR fetching data ===', error);
            console.error('Error details:', error.message, error.code);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load dashboard data: ' + error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    // Generate chart data for request submission trends
    const getRequestChartData = () => {
        const last30Days = {};
        const today = new Date();
        
        // Initialize last 30 days
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            last30Days[dateStr] = 0;
        }

        // Count requests by date
        requests.forEach((request) => {
            if (request.requestedAt) {
                const dateStr = new Date(request.requestedAt).toISOString().split('T')[0];
                if (last30Days.hasOwnProperty(dateStr)) {
                    last30Days[dateStr]++;
                }
            }
        });

        // Format for chart
        return {
            labels: Object.keys(last30Days).map(date => {
                const d = new Date(date);
                return `${d.getMonth() + 1}/${d.getDate()}`;
            }),
            data: Object.values(last30Days),
        };
    };

    const handleLogout = async () => {
        try {
            localStorage.removeItem('adminAuth');
            Swal.fire({
                icon: 'success',
                title: 'Logged Out',
                text: 'You have been logged out successfully.',
                confirmButtonColor: '#1d3557',
                timer: 1000,
            });
            navigate('/special/admin');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleEditDonor = (donor) => {
        setSelectedDonor(donor);
        setEditFormData(donor);
        setEditDialog(true);
    };

    const handleSaveEdit = async () => {
        try {
            const { id, bloodGroup, ...updateData } = editFormData;
            const donorRef = doc(
                db,
                'donors',
                bloodGroup,
                'donors',
                id
            );

            // Check if availability or blood group changed
            const oldIsAvailable = selectedDonor.isAvailable;
            const oldBloodGroup = selectedDonor.bloodGroup;
            const newIsAvailable = updateData.isAvailable;
            const newBloodGroup = updateData.bloodGroup;

            // If blood group changed, we need to move the donor to a new collection
            if (oldBloodGroup !== newBloodGroup) {
                // Create new donor document in new blood group
                const newBgDocRef = doc(db, 'donors', newBloodGroup);
                const newBgDocSnap = await getDoc(newBgDocRef);
                if (!newBgDocSnap.exists()) {
                    await setDoc(newBgDocRef, { 
                        bloodGroup: newBloodGroup,
                        createdAt: new Date().toISOString(),
                    });
                }

                const newDonorRef = doc(db, 'donors', newBloodGroup, 'donors', id);
                await setDoc(newDonorRef, {
                    ...updateData,
                    bloodGroup: newBloodGroup,
                    updatedAt: new Date().toISOString(),
                });

                // Delete from old blood group
                await deleteDoc(donorRef);

                // Update stats
                const statsRef = doc(db, 'stats', 'global');
                const statsUpdates = {
                    [`byBloodGroup.${oldBloodGroup}`]: increment(-1),
                    [`byBloodGroup.${newBloodGroup}`]: increment(1),
                };

                if (oldIsAvailable !== newIsAvailable) {
                    if (newIsAvailable && !oldIsAvailable) {
                        statsUpdates.availableDonors = increment(1);
                    } else if (!newIsAvailable && oldIsAvailable) {
                        statsUpdates.availableDonors = increment(-1);
                    }
                }

                await updateDoc(statsRef, statsUpdates);
            } else {
                // Same blood group, just update the document
                const statsRef = doc(db, 'stats', 'global');
                const statsUpdates = {};

                // Handle availability change
                if (oldIsAvailable !== newIsAvailable) {
                    if (newIsAvailable && !oldIsAvailable) {
                        statsUpdates.availableDonors = increment(1);
                    } else if (!newIsAvailable && oldIsAvailable) {
                        statsUpdates.availableDonors = increment(-1);
                    }
                }

                // Update donor document
                await updateDoc(donorRef, {
                    ...updateData,
                    updatedAt: new Date().toISOString(),
                });

                // Update stats if there are changes
                if (Object.keys(statsUpdates).length > 0) {
                    await updateDoc(statsRef, statsUpdates);
                }
            }

            setEditDialog(false);
            Swal.fire({
                icon: 'success',
                title: 'Updated',
                text: 'Donor information updated successfully',
                timer: 1500,
            });
            fetchData();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
            });
        }
    };

    const handleDeleteDonor = async (donor) => {
        const result = await Swal.fire({
            icon: 'warning',
            title: 'Delete Donor?',
            text: `Are you sure you want to delete ${donor.fullName}?`,
            showCancelButton: true,
            confirmButtonColor: '#e63946',
            cancelButtonColor: '#6c757d',
        });

        if (result.isConfirmed) {
            try {
                const donorRef = doc(
                    db,
                    'donors',
                    donor.bloodGroup,
                    'donors',
                    donor.id
                );

                // Prepare stats updates before deletion
                const statsRef = doc(db, 'stats', 'global');
                const statsUpdates = {
                    totalDonors: increment(-1),
                };

                // Decrement available donors if this donor was available
                if (donor.isAvailable) {
                    statsUpdates.availableDonors = increment(-1);
                }

                // Decrement blood group count
                if (donor.bloodGroup) {
                    statsUpdates[`byBloodGroup.${donor.bloodGroup}`] = increment(-1);
                }

                // Update stats first
                await updateDoc(statsRef, statsUpdates);

                // Then delete the donor
                await deleteDoc(donorRef);

                Swal.fire({
                    icon: 'success',
                    title: 'Deleted',
                    text: 'Donor deleted successfully',
                    timer: 1500,
                });
                fetchData();
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message,
                });
            }
        }
    };

    const handleApproveRequest = async (request) => {
        try {
            // Step 1: Find the donor document across all blood groups
            const BLOOD_GROUPS = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
            let donorDocRef = null;
            let donorExists = false;

            for (const bloodGroup of BLOOD_GROUPS) {
                try {
                    const donorRef = doc(db, 'donors', bloodGroup, 'donors', request.donorId);
                    const donorSnap = await getDoc(donorRef);
                    if (donorSnap.exists()) {
                        donorDocRef = donorRef;
                        donorExists = true;
                        break;
                    }
                } catch (err) {
                    // Continue searching other blood groups
                    continue;
                }
            }

            // Step 2: Check if donor document exists
            if (!donorExists) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Donor Not Found',
                    html: `
                        <div style="text-align: left;">
                            <p><strong>Donor ID:</strong> ${request.donorId}</p>
                            <p><strong>Institution:</strong> ${request.institution}</p>
                            <p><strong>Department:</strong> ${request.department}</p>
                            <br/>
                            <p style="color: #e63946; font-weight: bold;">❌ No matching donor document found in the system.</p>
                            <p style="font-size: 14px; color: #666;">The donor may have been deleted or the ID may be incorrect.</p>
                        </div>
                    `,
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#e63946',
                });
                return;
            }

            // Step 3: Update donor's availability status
            await updateDoc(donorDocRef, {
                isAvailable: request.availabilityStatus === true,
                updatedAt: new Date().toISOString(),
            });

            // Step 4: Mark request as approved
            const requestRef = doc(db, 'availabilityRequests', request.id);
            await updateDoc(requestRef, {
                status: 'approved',
                approvedAt: new Date().toISOString(),
            });

            Swal.fire({
                icon: 'success',
                title: 'Request Approved ✅',
                html: `
                    <div style="text-align: left;">
                        <p><strong>Donor ID:</strong> ${request.donorId}</p>
                        <p><strong>New Status:</strong> ${request.availabilityStatus ? '✅ Available' : '❌ Not Available'}</p>
                        <br/>
                        <p style="color: #28a745;">Donor record has been updated successfully!</p>
                    </div>
                `,
                confirmButtonColor: '#28a745',
                timer: 2000,
            });
            fetchData();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
            });
        }
    };

    const handleRejectRequest = async (request) => {
        try {
            // Step 1: Verify donor exists (optional - for informational purposes)
            const BLOOD_GROUPS = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
            let donorExists = false;

            for (const bloodGroup of BLOOD_GROUPS) {
                try {
                    const donorRef = doc(db, 'donors', bloodGroup, 'donors', request.donorId);
                    const donorSnap = await getDoc(donorRef);
                    if (donorSnap.exists()) {
                        donorExists = true;
                        break;
                    }
                } catch (err) {
                    continue;
                }
            }

            // Step 2: Mark request as rejected
            const requestRef = doc(db, 'availabilityRequests', request.id);
            await updateDoc(requestRef, {
                status: 'rejected',
                rejectedAt: new Date().toISOString(),
            });

            const statusMessage = donorExists 
                ? 'Donor record exists and remains unchanged.'
                : 'Note: No matching donor document found (may have been deleted).';

            Swal.fire({
                icon: 'success',
                title: 'Request Rejected ❌',
                html: `
                    <div style="text-align: left;">
                        <p><strong>Donor ID:</strong> ${request.donorId}</p>
                        <br/>
                        <p style="color: #666;">${statusMessage}</p>
                    </div>
                `,
                confirmButtonColor: '#e63946',
                timer: 2000,
            });
            fetchData();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
            });
        }
    };

    // Sorting function
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Filter donors
    const getFilteredDonors = () => {
        return donors.filter(donor => {
            // Search by name
            if (filters.searchName && !donor.fullName.toLowerCase().includes(filters.searchName.toLowerCase())) {
                return false;
            }
            // Filter by university
            if (filters.university && donor.university !== filters.university) {
                return false;
            }
            // Filter by department
            if (filters.department && donor.department !== filters.department) {
                return false;
            }
            // Filter by blood group
            if (filters.bloodGroup && donor.bloodGroup !== filters.bloodGroup) {
                return false;
            }
            // Filter by gender
            if (filters.gender && donor.gender !== filters.gender) {
                return false;
            }
            // Filter by availability
            if (filters.isAvailable !== '') {
                const isAvailable = filters.isAvailable === 'true';
                if (donor.isAvailable !== isAvailable) {
                    return false;
                }
            }
            // Filter by donation history
            if (filters.hasDonatedBefore !== '') {
                const hasDonated = filters.hasDonatedBefore === 'true';
                if (donor.hasDonatedBefore !== hasDonated) {
                    return false;
                }
            }
            return true;
        });
    };

    // Sort filtered donors
    const getSortedDonors = () => {
        const filtered = getFilteredDonors();
        const sorted = [...filtered].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];
            
            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
        return sorted;
    };

    // Clear all filters
    const clearFilters = () => {
        setFilters({
            searchName: '',
            university: '',
            department: '',
            bloodGroup: '',
            gender: '',
            isAvailable: '',
            hasDonatedBefore: '',
        });
    };

    // CSV export function
    const exportToCSV = (data, filename) => {
        if (data.length === 0) {
            Swal.fire('No data', 'There is no data to export', 'warning');
            return;
        }

        const headers = Object.keys(data[0]).filter(key => key !== 'id' && key !== 'departmentShortForm');
        const rows = data.map(donor =>
            headers.map(header => {
                const value = donor[header];
                if (value === null || value === undefined) return '';
                if (typeof value === 'object') return JSON.stringify(value);
                return String(value).includes(',') ? `"${value}"` : value;
            })
        );

        const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        Swal.fire('Success', 'File downloaded successfully', 'success');
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                }}
            >
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', minHeight: '100vh', pb: 4 }}>
            {/* Header */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #1d3557 0%, #457b9d 100%)',
                    color: 'white',
                    p: 3,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <DashboardIcon sx={{ fontSize: '2rem' }} />
                            <Box>
                                <Typography variant="h5" fontWeight={700}>
                                    Admin Dashboard
                                </Typography>
                                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                    UDVASITO Management System
                                </Typography>
                            </Box>
                        </Box>
                        <Tooltip title="Logout">
                            <IconButton
                                onClick={handleLogout}
                                sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                            >
                                <LogoutIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ mt: 4 }}>
                {/* Refresh Button */}
                <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={fetchData}
                        disabled={loading}
                        sx={{ color: '#1d3557', borderColor: '#1d3557' }}
                    >
                        🔄 Refresh Data
                    </Button>
                    {loading && <Typography sx={{ alignSelf: 'center', color: '#666' }}>Loading dashboard...</Typography>}
                </Box>

                {/* Stats Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box
                                        sx={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: '50%',
                                            background: '#e8f5e9',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <PeopleIcon sx={{ color: '#28a745' }} />
                                    </Box>
                                    <Box>
                                        <Typography color="text.secondary" variant="caption">
                                            Total Donors
                                        </Typography>
                                        <Typography variant="h5" fontWeight={700}>
                                            {stats.totalDonors}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box
                                        sx={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: '50%',
                                            background: '#fff3e0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <CheckIcon sx={{ color: '#ffa726' }} />
                                    </Box>
                                    <Box>
                                        <Typography color="text.secondary" variant="caption">
                                            Available Now
                                        </Typography>
                                        <Typography variant="h5" fontWeight={700}>
                                            {stats.availableDonors}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box
                                        sx={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: '50%',
                                            background: '#f3e5f5',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <NotificationsIcon sx={{ color: '#ab47bc' }} />
                                    </Box>
                                    <Box>
                                        <Typography color="text.secondary" variant="caption">
                                            Pending Requests
                                        </Typography>
                                        <Typography variant="h5" fontWeight={700}>
                                            {stats.pendingRequests}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box
                                        sx={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: '50%',
                                            background: '#e3f2fd',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <BloodtypeIcon sx={{ color: '#e63946' }} />
                                    </Box>
                                    <Box>
                                        <Typography color="text.secondary" variant="caption">
                                            Blood Groups
                                        </Typography>
                                        <Typography variant="h5" fontWeight={700}>
                                            {stats.totalBloodGroups}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Tabs */}
                <Paper sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                    <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)}>
                        <Tab label={`Donors (${donors.length})`} />
                        <Tab label={`Breakdown`} />
                        <Tab label={`Availability Requests (${requests.length})`} />
                        <Tab label="Analytics" />
                    </Tabs>

                    {/* Donors Tab */}
                    {tabValue === 0 && (
                        <Box sx={{ p: 3 }}>
                            {/* Filter Section */}
                            <Paper sx={{ p: 2, mb: 3, bgcolor: '#f5f5f5' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>
                                    🔍 Filters
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={2}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Search Name"
                                            value={filters.searchName}
                                            onChange={(e) => setFilters({ ...filters, searchName: e.target.value })}
                                            placeholder="Donor name..."
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            select
                                            label="University"
                                            value={filters.university}
                                            onChange={(e) => setFilters({ ...filters, university: e.target.value })}
                                            InputLabelProps={{ shrink: true }}
                                            SelectProps={{ native: true }}
                                        >
                                            <option value="">All Universities</option>
                                            {[...new Set(donors.map(d => d.university))].sort().map(uni => (
                                                <option key={uni} value={uni}>{uni}</option>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            select
                                            label="Department"
                                            value={filters.department}
                                            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                                            InputLabelProps={{ shrink: true }}
                                            SelectProps={{ native: true }}
                                        >
                                            <option value="">All Departments</option>
                                            {[...new Set(donors.filter(d => !filters.university || d.university === filters.university).map(d => d.department))].sort().map(dept => (
                                                <option key={dept} value={dept}>{dept}</option>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            select
                                            label="Blood Group"
                                            value={filters.bloodGroup}
                                            onChange={(e) => setFilters({ ...filters, bloodGroup: e.target.value })}
                                            InputLabelProps={{ shrink: true }}
                                            SelectProps={{ native: true }}
                                        >
                                            <option value="">All Blood Groups</option>
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                            <option value="A+">A+</option>
                                            <option value="A-">A-</option>
                                            <option value="B+">B+</option>
                                            <option value="B-">B-</option>
                                            <option value="AB+">AB+</option>
                                            <option value="AB-">AB-</option>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            select
                                            label="Gender"
                                            value={filters.gender}
                                            onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                                            InputLabelProps={{ shrink: true }}
                                            SelectProps={{ native: true }}
                                        >
                                            <option value="">All Genders</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            select
                                            label="Available"
                                            value={filters.isAvailable}
                                            onChange={(e) => setFilters({ ...filters, isAvailable: e.target.value })}
                                            InputLabelProps={{ shrink: true }}
                                            SelectProps={{ native: true }}
                                        >
                                            <option value="">All Status</option>
                                            <option value="true">Available</option>
                                            <option value="false">Unavailable</option>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            select
                                            label="Donated Before"
                                            value={filters.hasDonatedBefore}
                                            onChange={(e) => setFilters({ ...filters, hasDonatedBefore: e.target.value })}
                                            InputLabelProps={{ shrink: true }}
                                            SelectProps={{ native: true }}
                                        >
                                            <option value="">Any</option>
                                            <option value="true">Yes</option>
                                            <option value="false">No</option>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2}>
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            onClick={clearFilters}
                                            sx={{ height: '40px', color: '#e63946', borderColor: '#e63946' }}
                                        >
                                            Clear Filters
                                        </Button>
                                    </Grid>
                                </Grid>
                                <Typography variant="caption" sx={{ mt: 2, display: 'block', color: '#666' }}>
                                    Showing {getSortedDonors().length} of {donors.length} donors
                                </Typography>
                            </Paper>

                            <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    startIcon={<DownloadIcon />}
                                    onClick={() => exportToCSV(getSortedDonors(), 'donors-filtered')}
                                    sx={{ bgcolor: '#28a745' }}
                                >
                                    Download CSV (Filtered)
                                </Button>
                            </Box>
                            <TableContainer sx={{ overflowX: 'auto' }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow sx={{ background: '#f8f9fa', position: 'sticky', top: 0 }}>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={sortConfig.key === 'fullName'}
                                                    direction={sortConfig.direction}
                                                    onClick={() => handleSort('fullName')}
                                                >
                                                    <strong>Name</strong>
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={sortConfig.key === 'gender'}
                                                    direction={sortConfig.direction}
                                                    onClick={() => handleSort('gender')}
                                                >
                                                    <strong>Gender</strong>
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={sortConfig.key === 'dateOfBirth'}
                                                    direction={sortConfig.direction}
                                                    onClick={() => handleSort('dateOfBirth')}
                                                >
                                                    <strong>DOB</strong>
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={sortConfig.key === 'bloodGroup'}
                                                    direction={sortConfig.direction}
                                                    onClick={() => handleSort('bloodGroup')}
                                                >
                                                    <strong>Blood</strong>
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={sortConfig.key === 'phone'}
                                                    direction={sortConfig.direction}
                                                    onClick={() => handleSort('phone')}
                                                >
                                                    <strong>Phone</strong>
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={sortConfig.key === 'email'}
                                                    direction={sortConfig.direction}
                                                    onClick={() => handleSort('email')}
                                                >
                                                    <strong>Email</strong>
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={sortConfig.key === 'university'}
                                                    direction={sortConfig.direction}
                                                    onClick={() => handleSort('university')}
                                                >
                                                    <strong>University</strong>
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={sortConfig.key === 'department'}
                                                    direction={sortConfig.direction}
                                                    onClick={() => handleSort('department')}
                                                >
                                                    <strong>Department</strong>
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={sortConfig.key === 'hasDonatedBefore'}
                                                    direction={sortConfig.direction}
                                                    onClick={() => handleSort('hasDonatedBefore')}
                                                >
                                                    <strong>Donated</strong>
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={sortConfig.key === 'isAvailable'}
                                                    direction={sortConfig.direction}
                                                    onClick={() => handleSort('isAvailable')}
                                                >
                                                    <strong>Available</strong>
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell align="center"><strong>Actions</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {getSortedDonors().map((donor) => (
                                            <TableRow key={`${donor.university}-${donor.department}-${donor.id}`}>
                                                <TableCell sx={{ maxWidth: 150 }}>{donor.fullName}</TableCell>
                                                <TableCell>{donor.gender || 'N/A'}</TableCell>
                                                <TableCell>{donor.dateOfBirth ? new Date(donor.dateOfBirth).toLocaleDateString() : 'N/A'}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={donor.bloodGroup}
                                                        size="small"
                                                        sx={{ bgcolor: '#fee2e2', color: '#e63946', fontWeight: 600 }}
                                                    />
                                                </TableCell>
                                                <TableCell>{donor.phone || 'N/A'}</TableCell>
                                                <TableCell sx={{ maxWidth: 200 }}>{donor.email || 'N/A'}</TableCell>
                                                <TableCell sx={{ maxWidth: 120 }}>{donor.university}</TableCell>
                                                <TableCell sx={{ maxWidth: 150 }}>{donor.department}</TableCell>
                                                <TableCell>
                                                    {donor.hasDonatedBefore ? (
                                                        <Chip label="Yes" size="small" color="success" />
                                                    ) : (
                                                        <Chip label="No" size="small" />
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {donor.isAvailable ? (
                                                        <Chip label="Yes" size="small" color="success" />
                                                    ) : (
                                                        <Chip label="No" size="small" />
                                                    )}
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Tooltip title="Edit">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleEditDonor(donor)}
                                                            sx={{ color: '#457b9d' }}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleDeleteDonor(donor)}
                                                            sx={{ color: '#e63946' }}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}

                    {/* Breakdown Tab */}
                    {tabValue === 1 && (
                        <Box sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                                🩸 Blood Group Breakdown
                            </Typography>
                            <Grid container spacing={2}>
                                {Object.entries(stats.bloodGroupStats || {})
                                    .sort(([bgA], [bgB]) => bgA.localeCompare(bgB))
                                    .map(([bloodGroup, bgData]) => (
                                        <Grid item xs={12} sm={6} md={4} lg={3} key={bloodGroup}>
                                            <Card sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)', height: '100%' }}>
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                        <Box
                                                            sx={{
                                                                width: 45,
                                                                height: 45,
                                                                borderRadius: '50%',
                                                                background: '#fee2e2',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontSize: '1.2rem',
                                                                fontWeight: 'bold',
                                                                color: '#e63946',
                                                            }}
                                                        >
                                                            {bloodGroup.charAt(0)}
                                                        </Box>
                                                        <Box>
                                                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#e63946' }}>
                                                                {bloodGroup}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Blood Type
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                        <Chip
                                                            label={`${bgData.total} total`}
                                                            size="small"
                                                            sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }}
                                                        />
                                                        <Chip
                                                            label={`${bgData.available} available`}
                                                            size="small"
                                                            color="success"
                                                            variant="outlined"
                                                        />
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                            </Grid>
                        </Box>
                    )}

                    {/* Requests Tab */}
                    {tabValue === 2 && (
                        <Box sx={{ p: 3 }}>
                            <Box sx={{ mb: 2 }}>
                                <Button
                                    variant="contained"
                                    startIcon={<DownloadIcon />}
                                    onClick={() => exportToCSV(requests, 'availability-requests')}
                                    sx={{ bgcolor: '#28a745' }}
                                >
                                    Download CSV
                                </Button>
                            </Box>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ background: '#f8f9fa' }}>
                                            <TableCell><strong>Donor ID</strong></TableCell>
                                            <TableCell><strong>University</strong></TableCell>
                                            <TableCell><strong>Department</strong></TableCell>
                                            <TableCell><strong>New Status</strong></TableCell>
                                            <TableCell><strong>Request Status</strong></TableCell>
                                            <TableCell align="center"><strong>Actions</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {requests.map((request) => (
                                            <TableRow key={request.id}>
                                                <TableCell>{request.donorId}</TableCell>
                                                <TableCell>{request.institution}</TableCell>
                                                <TableCell>{request.department}</TableCell>
                                                <TableCell>
                                                    {request.availabilityStatus ? (
                                                        <Chip label="Available" size="small" color="success" />
                                                    ) : (
                                                        <Chip label="Unavailable" size="small" />
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {request.status === 'pending' ? (
                                                        <Chip label="Pending" size="small" sx={{ bgcolor: '#fff3e0', color: '#f57c00' }} />
                                                    ) : request.status === 'approved' ? (
                                                        <Chip label="Approved" size="small" color="success" />
                                                    ) : (
                                                        <Chip label="Rejected" size="small" color="error" />
                                                    )}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {request.status === 'pending' && (
                                                        <>
                                                            <Tooltip title="Approve">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleApproveRequest(request)}
                                                                    sx={{ color: '#28a745' }}
                                                                >
                                                                    <CheckIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Reject">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleRejectRequest(request)}
                                                                    sx={{ color: '#e63946' }}
                                                                >
                                                                    <CancelIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}

                    {/* Analytics Tab */}
                    {tabValue === 3 && (
                        <Box sx={{ p: 3 }}>
                            <Grid container spacing={3}>
                                {/* Request Trend Chart */}
                                <Grid item xs={12}>
                                    <RequestTrendChart 
                                        labels={getRequestChartData().labels}
                                        data={getRequestChartData().data}
                                    />
                                </Grid>

                                {/* Blood Group Distribution */}
                                <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', borderRadius: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                            <Box
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '50%',
                                                    background: 'linear-gradient(135deg, #e63946 0%, #a4161a 100%)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    fontSize: '1.2rem',
                                                }}
                                            >
                                                🩸
                                            </Box>
                                            <Typography variant="h6" fontWeight={700} color="#1d3557">
                                                Blood Group Distribution
                                            </Typography>
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            {Object.entries(stats.bloodGroupStats || {})
                                                .sort((a, b) => b[1].total - a[1].total)
                                                .map(([bg, bgStats]) => (
                                                    <Box key={bg}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                            <Typography variant="body2" fontWeight={600}>{bg}</Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {bgStats.total} donor{bgStats.total !== 1 ? 's' : ''} ({bgStats.available} available)
                                                            </Typography>
                                                        </Box>
                                                        <Box
                                                            sx={{
                                                                width: '100%',
                                                                height: 8,
                                                                bgcolor: '#e0e0e0',
                                                                borderRadius: 1,
                                                                overflow: 'hidden',
                                                            }}
                                                        >
                                                            <Box
                                                                sx={{
                                                                    height: '100%',
                                                                    width: `${stats.totalDonors > 0 ? (bgStats.total / stats.totalDonors) * 100 : 0}%`,
                                                                    background: 'linear-gradient(90deg, #457b9d 0%, #2a6a7a 100%)',
                                                                    transition: 'width 0.3s ease',
                                                                }}
                                                            />
                                                        </Box>
                                                    </Box>
                                                ))}
                                        </Box>
                                    </Paper>
                                </Grid>

                                {/* Request Status Summary */}
                                <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', borderRadius: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                            <Box
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '50%',
                                                    background: 'linear-gradient(135deg, #f77f00 0%, #d62828 100%)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    fontSize: '1.2rem',
                                                }}
                                            >
                                                📋
                                            </Box>
                                            <Typography variant="h6" fontWeight={700} color="#1d3557">
                                                Request Status Summary
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                            <Box
                                                sx={{
                                                    p: 2,
                                                    bgcolor: '#fff3e0',
                                                    borderRadius: 1,
                                                    textAlign: 'center',
                                                    borderLeft: '4px solid #f57c00',
                                                }}
                                            >
                                                <Typography variant="h5" fontWeight={700} color="#f57c00">
                                                    {requests.filter(r => r.status === 'pending').length}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">Pending</Typography>
                                            </Box>
                                            <Box
                                                sx={{
                                                    p: 2,
                                                    bgcolor: '#e8f5e9',
                                                    borderRadius: 1,
                                                    textAlign: 'center',
                                                    borderLeft: '4px solid #4caf50',
                                                }}
                                            >
                                                <Typography variant="h5" fontWeight={700} color="#4caf50">
                                                    {requests.filter(r => r.status === 'approved').length}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">Approved</Typography>
                                            </Box>
                                            <Box
                                                sx={{
                                                    p: 2,
                                                    bgcolor: '#ffebee',
                                                    borderRadius: 1,
                                                    textAlign: 'center',
                                                    borderLeft: '4px solid #f44336',
                                                }}
                                            >
                                                <Typography variant="h5" fontWeight={700} color="#f44336">
                                                    {requests.filter(r => r.status === 'rejected').length}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">Rejected</Typography>
                                            </Box>
                                            <Box
                                                sx={{
                                                    p: 2,
                                                    bgcolor: '#e3f2fd',
                                                    borderRadius: 1,
                                                    textAlign: 'center',
                                                    borderLeft: '4px solid #2196f3',
                                                }}
                                            >
                                                <Typography variant="h5" fontWeight={700} color="#2196f3">
                                                    {requests.length}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">Total</Typography>
                                            </Box>
                                        </Box>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </Paper>
            </Container>

            {/* Edit Dialog */}
            <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Donor Information</DialogTitle>
                <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '70vh', overflowY: 'auto' }}>
                    {selectedDonor && (
                        <>
                            <TextField
                                fullWidth
                                label="Full Name"
                                value={editFormData.fullName || ''}
                                onChange={(e) =>
                                    setEditFormData({ ...editFormData, fullName: e.target.value })
                                }
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={editFormData.email || ''}
                                onChange={(e) =>
                                    setEditFormData({ ...editFormData, email: e.target.value })
                                }
                            />
                            <TextField
                                fullWidth
                                label="Phone"
                                value={editFormData.phone || ''}
                                onChange={(e) =>
                                    setEditFormData({ ...editFormData, phone: e.target.value })
                                }
                            />
                            <TextField
                                fullWidth
                                label="WhatsApp"
                                value={editFormData.whatsapp || ''}
                                onChange={(e) =>
                                    setEditFormData({ ...editFormData, whatsapp: e.target.value })
                                }
                            />
                            <TextField
                                fullWidth
                                select
                                label="Gender"
                                value={editFormData.gender || ''}
                                onChange={(e) =>
                                    setEditFormData({ ...editFormData, gender: e.target.value })
                                }
                                SelectProps={{ native: true }}
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </TextField>
                            <TextField
                                fullWidth
                                label="Date of Birth"
                                type="date"
                                value={editFormData.dateOfBirth || ''}
                                onChange={(e) =>
                                    setEditFormData({ ...editFormData, dateOfBirth: e.target.value })
                                }
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                fullWidth
                                select
                                label="Blood Group"
                                value={editFormData.bloodGroup || ''}
                                onChange={(e) =>
                                    setEditFormData({ ...editFormData, bloodGroup: e.target.value })
                                }
                                SelectProps={{ native: true }}
                            >
                                <option value="">Select Blood Group</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                            </TextField>
                            <TextField
                                fullWidth
                                label="University"
                                value={editFormData.university || ''}
                                disabled
                            />
                            <TextField
                                fullWidth
                                label="Department"
                                value={editFormData.department || ''}
                                disabled
                            />
                            <TextField
                                fullWidth
                                label="Student ID"
                                value={editFormData.studentId || ''}
                                onChange={(e) =>
                                    setEditFormData({ ...editFormData, studentId: e.target.value })
                                }
                            />
                            <TextField
                                fullWidth
                                label="Session"
                                value={editFormData.session || ''}
                                onChange={(e) =>
                                    setEditFormData({ ...editFormData, session: e.target.value })
                                }
                            />
                            <TextField
                                fullWidth
                                label="Current Address"
                                multiline
                                rows={2}
                                value={editFormData.currentAddress || ''}
                                onChange={(e) =>
                                    setEditFormData({ ...editFormData, currentAddress: e.target.value })
                                }
                            />
                            <TextField
                                fullWidth
                                label="Permanent Address"
                                multiline
                                rows={2}
                                value={editFormData.permanentAddress || ''}
                                onChange={(e) =>
                                    setEditFormData({ ...editFormData, permanentAddress: e.target.value })
                                }
                            />
                            <TextField
                                fullWidth
                                select
                                label="Has Donated Before"
                                value={editFormData.hasDonatedBefore ? 'true' : 'false'}
                                onChange={(e) =>
                                    setEditFormData({
                                        ...editFormData,
                                        hasDonatedBefore: e.target.value === 'true',
                                    })
                                }
                                SelectProps={{ native: true }}
                            >
                                <option value="false">No</option>
                                <option value="true">Yes</option>
                            </TextField>
                            <TextField
                                fullWidth
                                label="Last Donation Date"
                                type="date"
                                value={editFormData.lastDonationDate || ''}
                                onChange={(e) =>
                                    setEditFormData({ ...editFormData, lastDonationDate: e.target.value })
                                }
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                fullWidth
                                select
                                label="Currently Available"
                                value={editFormData.isAvailable ? 'true' : 'false'}
                                onChange={(e) =>
                                    setEditFormData({
                                        ...editFormData,
                                        isAvailable: e.target.value === 'true',
                                    })
                                }
                                SelectProps={{ native: true }}
                            >
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </TextField>
                            <TextField
                                fullWidth
                                label="Medical Conditions"
                                multiline
                                rows={2}
                                value={editFormData.medicalConditions || ''}
                                onChange={(e) =>
                                    setEditFormData({ ...editFormData, medicalConditions: e.target.value })
                                }
                                helperText="Any allergies, diseases, or conditions"
                            />
                            <TextField
                                fullWidth
                                label="Emergency Contact"
                                value={editFormData.emergencyContact || ''}
                                onChange={(e) =>
                                    setEditFormData({ ...editFormData, emergencyContact: e.target.value })
                                }
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialog(false)}>Cancel</Button>
                    <Button onClick={handleSaveEdit} variant="contained" color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Credit Footer */}
            <Box
                sx={{
                    marginTop: 4,
                    paddingTop: 2,
                    borderTop: '1px solid #e0e0e0',
                    textAlign: 'center',
                    color: '#666',
                    fontSize: '0.875rem',
                }}
            >
                <p>
                    Admin Panel developed by{' '}
                    <a
                        href="https://github.com/Brainless-Loco"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            color: '#1976d2',
                            textDecoration: 'none',
                            fontWeight: 500,
                        }}
                        onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')}
                        onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
                    >
                        Tonmoy
                    </a>
                </p>
            </Box>
        </Box>
    );
};

export default AdminDashboard;
