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
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { collection, getDocs, updateDoc, deleteDoc, doc, getDoc, increment } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { getDepartmentDisplayName } from '../../utils/departmentHelper';
import { DEPARTMENT_SHORT_FORMS } from '../../config/constants';
import Swal from 'sweetalert2';

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
        fetchData();
    }, [navigate]);

    // Helper function to sanitize university name for path
    const sanitizeId = (str) => str.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase().slice(0, 64);

    // Fetch all data
    const fetchData = async () => {
        try {
            setLoading(true);
            console.log('=== ADMIN DASHBOARD: Starting data fetch ===');
            console.log('New architecture: /donors/{uniName}/{deptShortForm}/{donorId}');
            console.time('Dashboard Load Time');
            
            // Fetch donors
            const donorsRef = collection(db, 'donors');
            const uniDocs = await getDocs(donorsRef);
            console.log('📚 Universities found:', uniDocs.docs.length);
            
            const allDonors = [];
            const universityStats = {};
            const departmentStats = {};
            const departmentShortForms = Object.values(DEPARTMENT_SHORT_FORMS);

            // Fetch all departments for all universities in parallel
            const allPromises = [];
            const uniDocMap = new Map();

            for (const uniDoc of uniDocs.docs) {
                const uniName = uniDoc.id;
                uniDocMap.set(uniName, uniDoc);
                universityStats[uniName] = { total: 0, available: 0 };
                
                // Create promises for all departments (parallel instead of sequential)
                for (const deptShortForm of departmentShortForms) {
                    const promise = getDocs(collection(uniDoc.ref, deptShortForm))
                        .then(donorDocs => ({
                            uniName,
                            deptShortForm,
                            donorDocs,
                        }))
                        .catch(() => ({
                            uniName,
                            deptShortForm,
                            donorDocs: { docs: [] }, // Return empty if collection doesn't exist
                        }));
                    
                    allPromises.push(promise);
                }
            }

            // Wait for all queries to complete in parallel
            const results = await Promise.all(allPromises);
            
            // Process results
            for (const result of results) {
                const { uniName, deptShortForm, donorDocs } = result;
                
                if (donorDocs.docs.length > 0) {
                    const fullDepartmentName = getDepartmentDisplayName(deptShortForm);
                    const deptKey = `${uniName}|${fullDepartmentName}`;
                    
                    if (!departmentStats[deptKey]) {
                        departmentStats[deptKey] = { total: 0, available: 0, university: uniName };
                    }

                    donorDocs.forEach((donorDocData) => {
                        const isAvailable = donorDocData.data().isAvailable === true;
                        const donorData = {
                            id: donorDocData.id,
                            university: donorDocData.data().university || uniName,
                            universitySanitized: uniName,
                            department: fullDepartmentName,
                            departmentShortForm: deptShortForm,
                            ...donorDocData.data(),
                        };
                        allDonors.push(donorData);
                        
                        // Update stats
                        universityStats[uniName].total++;
                        if (isAvailable) universityStats[uniName].available++;
                        
                        departmentStats[deptKey].total++;
                        if (isAvailable) departmentStats[deptKey].available++;
                    });
                }
            }

            // console.log('\n✅ Total donors fetched:', allDonors.length);
            console.timeEnd('Dashboard Load Time');

            // Fetch availability requests in parallel with stats
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

            // Calculate stats
            const stats = {
                totalDonors: allDonors.length,
                availableDonors: allDonors.filter((d) => d.isAvailable === true).length,
                pendingRequests: allRequests.filter((r) => r.status === 'pending').length,
                totalUniversities: Object.keys(universityStats).length,
                universityStats,
                departmentStats,
            };
            
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

    const handleLogout = async () => {
        try {
            const auth = getAuth();
            await signOut(auth);
            localStorage.removeItem('adminAuth');
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
            const { id, university, universitySanitized, department, departmentShortForm, ...updateData } = editFormData;
            const donorRef = doc(
                db,
                'donors',
                universitySanitized || sanitizeId(university),
                departmentShortForm,
                id
            );

            // Check if availability or blood group changed
            const oldIsAvailable = selectedDonor.isAvailable;
            const oldBloodGroup = selectedDonor.bloodGroup;
            const newIsAvailable = updateData.isAvailable;
            const newBloodGroup = updateData.bloodGroup;

            // Prepare stats updates
            const statsRef = doc(db, 'stats', 'global');
            const statsUpdates = {};

            // Handle availability change
            if (oldIsAvailable !== newIsAvailable) {
                if (newIsAvailable && !oldIsAvailable) {
                    // Became available
                    statsUpdates.availableDonors = increment(1);
                } else if (!newIsAvailable && oldIsAvailable) {
                    // Became unavailable
                    statsUpdates.availableDonors = increment(-1);
                }
            }

            // Handle blood group change
            if (oldBloodGroup !== newBloodGroup) {
                // Decrement old blood group
                statsUpdates[`byBloodGroup.${oldBloodGroup}`] = increment(-1);
                // Increment new blood group
                statsUpdates[`byBloodGroup.${newBloodGroup}`] = increment(1);
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
                    donor.universitySanitized || sanitizeId(donor.university),
                    donor.departmentShortForm,
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
            const requestRef = doc(db, 'availabilityRequests', request.id);
            await updateDoc(requestRef, {
                status: 'approved',
                approvedAt: new Date().toISOString(),
            });

            Swal.fire({
                icon: 'success',
                title: 'Request Approved',
                text: 'Availability request has been approved',
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

    const handleRejectRequest = async (request) => {
        try {
            const requestRef = doc(db, 'availabilityRequests', request.id);
            await updateDoc(requestRef, {
                status: 'rejected',
                rejectedAt: new Date().toISOString(),
            });

            Swal.fire({
                icon: 'success',
                title: 'Request Rejected',
                text: 'Availability request has been rejected',
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
                                        <SchoolIcon sx={{ color: '#1976d2' }} />
                                    </Box>
                                    <Box>
                                        <Typography color="text.secondary" variant="caption">
                                            Universities
                                        </Typography>
                                        <Typography variant="h5" fontWeight={700}>
                                            {stats.totalUniversities}
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
                                📊 University-wise Breakdown
                            </Typography>
                            {Object.entries(stats.universityStats)
                                .sort(([uniNameA], [uniNameB]) => uniNameA.localeCompare(uniNameB))
                                .map(([uniName, uniData]) => (
                                <Accordion key={uniName} sx={{ mb: 2 }}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                                            <SchoolIcon sx={{ color: '#457b9d' }} />
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                    {uniName}
                                                </Typography>
                                            </Box>
                                            <Chip
                                                label={`${uniData.total} total`}
                                                size="small"
                                                sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }}
                                            />
                                            <Chip
                                                label={`${uniData.available} available`}
                                                size="small"
                                                sx={{ bgcolor: '#e8f5e9', color: '#28a745' }}
                                            />
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Box>
                                            <Typography variant="body2" sx={{ mb: 2, fontWeight: 'bold' }}>
                                                Department Breakdown:
                                            </Typography>
                                            <Grid container spacing={2}>
                                                {Object.entries(stats.departmentStats)
                                                    .filter(([key]) => key.startsWith(uniName + '|'))
                                                    .sort(([keyA], [keyB]) => keyA.split('|')[1].localeCompare(keyB.split('|')[1]))
                                                    .map(([key, deptData]) => {
                                                        const deptName = key.split('|')[1];
                                                        return (
                                                            <Grid item xs={12} sm={6} md={4} key={key}>
                                                                <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                                                                    <CardContent sx={{ pb: 2 }}>
                                                                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                                                            {deptName}
                                                                        </Typography>
                                                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                                            <Chip
                                                                                label={`${deptData.total} total`}
                                                                                size="small"
                                                                                variant="outlined"
                                                                            />
                                                                            <Chip
                                                                                label={`${deptData.available} available`}
                                                                                size="small"
                                                                                color="success"
                                                                                variant="outlined"
                                                                            />
                                                                        </Box>
                                                                    </CardContent>
                                                                </Card>
                                                            </Grid>
                                                        );
                                                    })}
                                            </Grid>
                                        </Box>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
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
