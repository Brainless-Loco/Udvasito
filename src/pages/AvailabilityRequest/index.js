import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import InputAdornment from '@mui/material/InputAdornment';
import {
    School as SchoolIcon,
    Badge as BadgeIcon,
    Info as InfoIcon,
    CheckCircle as CheckIcon,
    Send as SendIcon,
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import {  useFirebase } from '../../context';
import { INSTITUTIONS, DEPARTMENTS_CU } from '../../config/constants';
import { SectionHeader } from '../../components';

const AvailabilityRequest = () => {
    // const { t } = useLanguage();
    const { addAvailabilityRequest } = useFirebase();
    const [formData, setFormData] = useState({
        institution: '',
        department: '',
        donorId: '',
        availabilityStatus: '',
    });
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setSuccessMessage('');
    };

    const validateForm = () => {
        if (!formData.institution) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Field',
                text: 'Please select your institution',
                confirmButtonColor: '#e63946',
            });
            return false;
        }
        if (!formData.department) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Field',
                text: 'Please select your department',
                confirmButtonColor: '#e63946',
            });
            return false;
        }
        if (!formData.donorId.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Field',
                text: 'Please enter your donor ID (Student ID)',
                confirmButtonColor: '#e63946',
            });
            return false;
        }
        if (!formData.availabilityStatus) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Field',
                text: 'Please select your availability status',
                confirmButtonColor: '#e63946',
            });
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const result = await addAvailabilityRequest({
                institution: formData.institution,
                department: formData.department,
                donorId: formData.donorId,
                availabilityStatus: formData.availabilityStatus === 'available',
                requestedAt: new Date().toISOString(),
                status: 'pending',
            });

            if (result.success) {
                setSuccessMessage('Request submitted successfully!');
                setFormData({
                    institution: '',
                    department: '',
                    donorId: '',
                    availabilityStatus: '',
                });

                await Swal.fire({
                    icon: 'success',
                    title: '✅ Request Submitted',
                    html: `
                        <div style="text-align: left; color: #333;">
                            <p style="font-size: 16px; margin-bottom: 15px;">
                                Your availability status change request has been submitted successfully!
                            </p>
                            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: left; margin-top: 15px;">
                                <p style="margin: 8px 0;"><strong>Institution:</strong> ${formData.institution}</p>
                                <p style="margin: 8px 0;"><strong>Department:</strong> ${formData.department}</p>
                                <p style="margin: 8px 0;"><strong>Donor ID:</strong> ${formData.donorId}</p>
                                <p style="margin: 8px 0;"><strong>New Status:</strong> ${formData.availabilityStatus === 'available' ? '✅ Available' : '❌ Not Available'}</p>
                            </div>
                            <p style="font-size: 14px; color: #666; margin-top: 15px;">
                                An admin will review your request and update your status within 24 hours.
                            </p>
                        </div>
                    `,
                    confirmButtonText: 'Done',
                    confirmButtonColor: '#1d3557',
                });
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: error.message || 'Something went wrong. Please try again.',
                confirmButtonColor: '#e63946',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ pt: 12, pb: 8, px: 2, background: 'linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)', minHeight: '100vh' }}>
            <Container maxWidth="lg">
                <SectionHeader
                    icon={InfoIcon}
                    title="Update Availability Status"
                    subtitle="Request to change your blood donor availability status"
                />

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 4 }}>
                    {/* Form Section */}
                    <Paper
                        sx={{
                            p: { xs: 3, md: 4 },
                            borderRadius: 3,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                }}
                            >
                                <InfoIcon />
                            </Box>
                            <Typography variant="h5" fontWeight={700} color="#1d3557">
                                Update Your Status
                            </Typography>
                        </Box>

                        {successMessage && (
                            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                                {successMessage}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                {/* Institution */}
                                <TextField
                                    fullWidth
                                    select
                                    label="Institution *"
                                    name="institution"
                                    value={formData.institution}
                                    onChange={handleChange}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SchoolIcon sx={{ color: '#457b9d' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {
                                                borderColor: '#e63946',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#e63946',
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value="" disabled>
                                        Select Institution
                                    </MenuItem>
                                    {INSTITUTIONS.map((inst) => (
                                        <MenuItem key={inst} value={inst}>
                                            {inst}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                {/* Department */}
                                <TextField
                                    fullWidth
                                    select
                                    label="Department *"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <BadgeIcon sx={{ color: '#457b9d' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {
                                                borderColor: '#e63946',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#e63946',
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value="" disabled>
                                        Select Department
                                    </MenuItem>
                                    {DEPARTMENTS_CU.map((dept) => (
                                        <MenuItem key={dept} value={dept}>
                                            {dept}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                {/* Donor ID */}
                                <TextField
                                    fullWidth
                                    label="Donor ID (Student ID) *"
                                    name="donorId"
                                    value={formData.donorId}
                                    onChange={handleChange}
                                    placeholder="e.g., 123456"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <BadgeIcon sx={{ color: '#457b9d' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {
                                                borderColor: '#e63946',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#e63946',
                                            },
                                        },
                                    }}
                                />

                                {/* Availability Status */}
                                <TextField
                                    fullWidth
                                    select
                                    label="New Availability Status *"
                                    name="availabilityStatus"
                                    value={formData.availabilityStatus}
                                    onChange={handleChange}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {
                                                borderColor: '#e63946',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#e63946',
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value="" disabled>
                                        Select Availability Status
                                    </MenuItem>
                                    <MenuItem value="available">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CheckIcon sx={{ color: '#28a745', fontSize: '1.2rem' }} />
                                            Available to Donate
                                        </Box>
                                    </MenuItem>
                                    <MenuItem value="unavailable">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box sx={{ color: '#dc3545', fontSize: '1.2rem' }}>✕</Box>
                                            Not Available
                                        </Box>
                                    </MenuItem>
                                </TextField>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                    startIcon={loading ? <CircularProgress size={24} /> : <SendIcon />}
                                    sx={{
                                        mt: 2,
                                        py: 1.5,
                                        borderRadius: 2,
                                        background: 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)',
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        boxShadow: '0 4px 15px rgba(230, 57, 70, 0.3)',
                                        '&:hover:not(:disabled)': {
                                            background: 'linear-gradient(135deg, #c1121f 0%, #a00d1a 100%)',
                                            boxShadow: '0 6px 20px rgba(230, 57, 70, 0.4)',
                                        },
                                        '&:disabled': {
                                            opacity: 0.7,
                                        },
                                    }}
                                >
                                    {loading ? 'Submitting...' : 'Submit Request'}
                                </Button>
                            </Box>
                        </form>
                    </Paper>

                    {/* Info Cards */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {/* How It Works Card */}
                        <Card
                            sx={{
                                borderRadius: 3,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                border: '1px solid #e9ecef',
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6" fontWeight={700} color="#1d3557" gutterBottom>
                                    📋 How It Works
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Typography
                                            sx={{
                                                width: 28,
                                                height: 28,
                                                borderRadius: '50%',
                                                bgcolor: '#e63946',
                                                color: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 700,
                                                flexShrink: 0,
                                            }}
                                        >
                                            1
                                        </Typography>
                                        <Box>
                                            <Typography variant="body2" fontWeight={600}>
                                                Fill the Form
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Enter your details and new availability status
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Typography
                                            sx={{
                                                width: 28,
                                                height: 28,
                                                borderRadius: '50%',
                                                bgcolor: '#e63946',
                                                color: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 700,
                                                flexShrink: 0,
                                            }}
                                        >
                                            2
                                        </Typography>
                                        <Box>
                                            <Typography variant="body2" fontWeight={600}>
                                                Submit Request
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Your request goes to admin for review
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Typography
                                            sx={{
                                                width: 28,
                                                height: 28,
                                                borderRadius: '50%',
                                                bgcolor: '#e63946',
                                                color: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 700,
                                                flexShrink: 0,
                                            }}
                                        >
                                            3
                                        </Typography>
                                        <Box>
                                            <Typography variant="body2" fontWeight={600}>
                                                Status Updated
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Admin approves and updates your profile
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>

                        {/* Important Info Card */}
                        <Card
                            sx={{
                                borderRadius: 3,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                border: '1px solid #fff3cd',
                                bgcolor: '#fffbf0',
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6" fontWeight={700} color="#856404" gutterBottom>
                                    ⏱️ Processing Time
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Requests are typically processed within <strong>24 hours</strong>. You will be notified once your status is updated.
                                </Typography>
                            </CardContent>
                        </Card>

                        {/* Contact Card */}
                        <Card
                            sx={{
                                borderRadius: 3,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                border: '1px solid #d1ecf1',
                                bgcolor: '#d1ecf1',
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6" fontWeight={700} color="#0c5460" gutterBottom>
                                    ❓ Need Help?
                                </Typography>
                                <Typography variant="body2" color="#0c5460" sx={{ mt: 1 }}>
                                    If you have any issues, please contact us at{' '}
                                    <Typography
                                        component="span"
                                        sx={{
                                            fontWeight: 600,
                                            color: '#e63946',
                                        }}
                                    >
                                        udvasito.official@gmail.com
                                    </Typography>
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default AvailabilityRequest;
