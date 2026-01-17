import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import {
    Email as EmailIcon,
    Lock as LockIcon,
    VpnKey as AdminIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Query admins collection for email and password match
            const adminsRef = collection(db, 'admins');
            const q = query(adminsRef, where('email', '==', email.toLowerCase().trim()));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setError('Invalid email or password.');
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: 'Invalid email or password.',
                    confirmButtonColor: '#e63946',
                });
                setLoading(false);
                return;
            }

            // Check if password matches
            const adminDoc = querySnapshot.docs[0];
            const adminData = adminDoc.data();

            if (adminData.password !== password) {
                setError('Invalid email or password.');
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: 'Invalid email or password.',
                    confirmButtonColor: '#e63946',
                });
                setLoading(false);
                return;
            }

            // Admin verified - set session with 12 hour expiration
            const expiryTime = new Date().getTime() + (12 * 60 * 60 * 1000); // 12 hours
            localStorage.setItem('adminAuth', JSON.stringify({
                id: adminDoc.id,
                email: adminData.email,
                name: adminData.name || 'Admin',
                timestamp: new Date().getTime(),
                expiryTime: expiryTime,
            }));

            Swal.fire({
                icon: 'success',
                title: 'Welcome Admin!',
                text: `Logged in as ${adminData.email}`,
                confirmButtonColor: '#1d3557',
                timer: 1500,
            });

            navigate('/special/admin/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            setError(error.message || 'Login failed');
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: error.message || 'Something went wrong. Please try again.',
                confirmButtonColor: '#e63946',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #1d3557 0%, #457b9d 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
            }}
        >
            <Container maxWidth="xs">
                <Paper
                    sx={{
                        p: { xs: 3, sm: 4 },
                        borderRadius: 3,
                        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                    }}
                >
                    {/* Header */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Box
                            sx={{
                                width: 60,
                                height: 60,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                mx: 'auto',
                                mb: 2,
                            }}
                        >
                            <AdminIcon sx={{ fontSize: '2rem' }} />
                        </Box>
                        <Typography variant="h5" fontWeight={700} color="#1d3557" gutterBottom>
                            Admin Login
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            UDVASITO Administration Panel
                        </Typography>
                    </Box>

                    {/* Error Alert */}
                    {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                    {/* Login Form */}
                    <form onSubmit={handleLogin}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            {/* Email */}
                            <TextField
                                fullWidth
                                type="email"
                                label="Admin Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon sx={{ color: '#457b9d' }} />
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

                            {/* Password */}
                            <TextField
                                fullWidth
                                type={showPassword ? 'text' : 'password'}
                                label="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon sx={{ color: '#457b9d' }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Button
                                                onClick={() => setShowPassword(!showPassword)}
                                                disabled={loading}
                                                sx={{
                                                    minWidth: 'auto',
                                                    p: 0.5,
                                                    color: '#457b9d',
                                                    '&:hover': {
                                                        backgroundColor: 'transparent',
                                                    },
                                                }}
                                            >
                                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                            </Button>
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

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading || !email || !password}
                                startIcon={loading ? <CircularProgress size={24} /> : <AdminIcon />}
                                sx={{
                                    mt: 2,
                                    py: 1.5,
                                    background: 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)',
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    '&:hover:not(:disabled)': {
                                        background: 'linear-gradient(135deg, #c1121f 0%, #a00d1a 100%)',
                                    },
                                    '&:disabled': {
                                        opacity: 0.6,
                                    },
                                }}
                            >
                                {loading ? 'Logging in...' : 'Admin Login'}
                            </Button>
                        </Box>
                    </form>

                    {/* Security Notice */}
                    <Paper
                        sx={{
                            mt: 3,
                            p: 2,
                            background: '#f8f9fa',
                            border: '1px solid #dee2e6',
                            borderRadius: 2,
                        }}
                    >
                        <Typography variant="caption" display="block" color="text.secondary" gutterBottom>
                            🔒 <strong>Security Notice</strong>
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            This is a restricted admin panel. Only authorized administrators can access this area. All activities are logged.
                        </Typography>
                    </Paper>
                </Paper>
            </Container>
        </Box>
    );
};

export default AdminLogin;
