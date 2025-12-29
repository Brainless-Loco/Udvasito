import React from 'react';
import { Box, Typography, Button, Avatar } from '@mui/material';
import {
    PersonAdd as RegisterIcon,
    Search as SearchIcon,
    Favorite as HeartIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context';
import { ctaSectionStyles } from './styles';

const CallToAction = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();

    return (
        <Box sx={ctaSectionStyles}>
            {/* Background decoration */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '10%',
                    transform: 'translateY(-50%)',
                    opacity: 0.1,
                }}
            >
                <HeartIcon sx={{ fontSize: 200 }} />
            </Box>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    right: '10%',
                    transform: 'translateY(-50%)',
                    opacity: 0.1,
                }}
            >
                <HeartIcon sx={{ fontSize: 150 }} />
            </Box>

            <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Avatar
                    sx={{
                        bgcolor: 'rgba(255,255,255,0.2)',
                        width: 72,
                        height: 72,
                        mx: 'auto',
                        mb: 3,
                    }}
                >
                    <HeartIcon sx={{ fontSize: 36 }} />
                </Avatar>

                <Typography
                    variant="h4"
                    fontWeight={700}
                    gutterBottom
                    sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' } }}
                >
                    {t.about.ctaTitle || 'Ready to Make a Difference?'}
                </Typography>
                <Typography
                    variant="body1"
                    sx={{ opacity: 0.9, mb: 4, maxWidth: 600, mx: 'auto' }}
                >
                    {t.about.ctaDescription || 'Join our community of lifesavers. Register as a donor or find a donor in your area.'}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<RegisterIcon />}
                        onClick={() => navigate('/register-donor')}
                        sx={{
                            bgcolor: 'white',
                            color: '#fff',
                            fontWeight: 600,
                            px: 4,
                            py: 1.5,
                            borderRadius: 2,
                            '&:hover': {
                                bgcolor: 'rgba(255,255,255,0.9)',
                            },
                        }}
                    >
                        {t.nav.registerDonor || 'Register as Donor'}
                    </Button>
                    <Button
                        variant="outlined"
                        size="large"
                        startIcon={<SearchIcon />}
                        onClick={() => navigate('/find-donor')}
                        sx={{
                            borderColor: 'white',
                            color: 'white',
                            fontWeight: 600,
                            px: 4,
                            py: 1.5,
                            borderRadius: 2,
                            '&:hover': {
                                bgcolor: 'rgba(255,255,255,0.1)',
                                borderColor: 'white',
                            },
                        }}
                    >
                        {t.nav.findDonor || 'Find a Donor'}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default CallToAction;
