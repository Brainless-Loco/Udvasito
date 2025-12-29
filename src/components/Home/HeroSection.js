import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Chip,
} from '@mui/material';
import {
    Search as SearchIcon,
    PersonAdd as PersonAddIcon,
    People as PeopleIcon,
    Bloodtype as BloodIcon,
    VolunteerActivism as VolunteerIcon,
    Favorite as HeartIcon,
    ArrowDownward as ArrowDownIcon,
} from '@mui/icons-material';
import { useLanguage, useFirebase } from '../../context';
import { ROUTES } from '../../config/constants';
import { AnimatedCounter } from './common';

const HeroSection = () => {
    const { t } = useLanguage();
    const { stats } = useFirebase();
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #e63946 0%, #c1121f 50%, #1d3557 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                pt: { xs: 8, md: 0 },
                pb: 6,
            }}
        >
            {/* Animated Floating Blood Drops with Parallax */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    overflow: 'hidden',
                    transform: `translateY(${scrollY * 0.3}px)`,
                }}
            >
                {[...Array(8)].map((_, i) => (
                    <Box
                        key={i}
                        sx={{
                            position: 'absolute',
                            width: 60 + i * 15,
                            height: 78 + i * 19.5,
                            backgroundColor: `rgba(255,255,255,${0.05 + i * 0.01})`,
                            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                            animation: `float ${4 + i}s ease-in-out infinite`,
                            animationDelay: `${i * 0.5}s`,
                            top: `${10 + (i * 12) % 80}%`,
                            left: `${5 + (i * 15) % 90}%`,
                            '@keyframes float': {
                                '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
                                '50%': { transform: 'translateY(-30px) rotate(10deg)' },
                            },
                        }}
                    />
                ))}
            </Box>

            {/* Animated DNA Helix Pattern */}
            <Box
                sx={{
                    position: 'absolute',
                    right: -100,
                    top: '50%',
                    transform: `translateY(-50%) rotate(${scrollY * 0.05}deg)`,
                    opacity: 0.1,
                    display: { xs: 'none', lg: 'block' },
                }}
            >
                {[...Array(10)].map((_, i) => (
                    <Box
                        key={i}
                        sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            backgroundColor: 'white',
                            position: 'absolute',
                            left: Math.sin(i * 0.8) * 50 + 50,
                            top: i * 40,
                            animation: `pulse 2s ease-in-out infinite`,
                            animationDelay: `${i * 0.1}s`,
                        }}
                    />
                ))}
            </Box>

            <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1, pt: { xs: 4, md: 6 }, pb:5 }}>
                {/* Animated Badge */}
                <Chip
                    icon={<HeartIcon sx={{ color: 'white !important' }} />}
                    label="Save Lives Today"
                    sx={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        mb: 3,
                        mt: 2,
                        animation: 'fadeInDown 0.8s ease-out',
                        '@keyframes fadeInDown': {
                            from: { opacity: 0, transform: 'translateY(-20px)' },
                            to: { opacity: 1, transform: 'translateY(0)' },
                        },
                    }}
                />

                <Typography
                    variant="h1"
                    sx={{
                        color: 'white',
                        mb: 1,
                        fontSize: { xs: '2.5rem', md: '4rem' },
                        textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                        animation: 'fadeInUp 0.8s ease-out 0.2s both',
                        '@keyframes fadeInUp': {
                            from: { opacity: 0, transform: 'translateY(30px)' },
                            to: { opacity: 1, transform: 'translateY(0)' },
                        },
                    }}
                >
                    {t.hero.title1}
                </Typography>
                <Typography
                    variant="h1"
                    sx={{
                        background: 'linear-gradient(90deg, #ffffff, #a8dadc, #ffffff)',
                        backgroundSize: '200% auto',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: { xs: '3rem', md: '5rem' },
                        fontWeight: 800,
                        mb: 3,
                        paddingTop: 2,
                        animation: 'fadeInUp 0.8s ease-out 0.4s both, shimmer 3s linear infinite',
                        '@keyframes shimmer': {
                            '0%': { backgroundPosition: '0% center' },
                            '100%': { backgroundPosition: '200% center' },
                        },
                    }}
                >
                    {t.hero.title2}
                </Typography>
                <Typography
                    variant="h6"
                    sx={{
                        color: 'rgba(255,255,255,0.9)',
                        mb: 5,
                        maxWidth: 600,
                        mx: 'auto',
                        fontWeight: 400,
                        animation: 'fadeInUp 0.8s ease-out 0.6s both',
                    }}
                >
                    {t.hero.subtitle}
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        gap: 2,
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        mb: 6,
                        animation: 'fadeInUp 0.8s ease-out 0.8s both',
                    }}
                >
                    <Button
                        component={Link}
                        to={ROUTES.FIND_DONOR}
                        variant="contained"
                        size="large"
                        startIcon={<SearchIcon />}
                        sx={{
                            backgroundColor: 'white',
                            color: '#1d3557',
                            px: 4,
                            py: 1.5,
                            borderRadius: 3,
                            fontWeight: 600,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                backgroundColor: '#1d3557',
                                color: 'white',
                                transform: 'translateY(-3px)',
                                boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                            },
                        }}
                    >
                        {t.hero.findDonor}
                    </Button>
                    <Button
                        component={Link}
                        to={ROUTES.DONOR_REGISTRATION}
                        variant="outlined"
                        size="large"
                        startIcon={<PersonAddIcon />}
                        sx={{
                            borderColor: 'white',
                            borderWidth: 2,
                            color: 'white',
                            px: 4,
                            py: 1.5,
                            borderRadius: 3,
                            fontWeight: 600,
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                backgroundColor: 'white',
                                color: '#e63946',
                                borderColor: 'white',
                                transform: 'translateY(-3px)',
                            },
                        }}
                    >
                        {t.hero.becomeDonor}
                    </Button>
                </Box>

                {/* Hero Stats with Animation */}
                <Grid container spacing={4} justifyContent="center">
                    {[
                        { icon: <PeopleIcon />, value: stats.total, label: t.hero.registeredDonors },
                        { icon: <BloodIcon />, value: 8, label: t.hero.bloodGroups },
                        { icon: <VolunteerIcon />, value: stats.available, label: t.hero.availableNow },
                    ].map((stat, index) => (
                        <Grid item xs={12} sm={4} key={index}>
                            <Box
                                sx={{
                                    textAlign: 'center',
                                    color: 'white',
                                    p: 2,
                                    borderRadius: 3,
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    backdropFilter: 'blur(10px)',
                                    animation: `fadeInUp 0.8s ease-out ${1 + index * 0.2}s both`,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255,255,255,0.2)',
                                        transform: 'scale(1.05)',
                                    },
                                }}
                            >
                                <Box sx={{ mb: 1 }}>{React.cloneElement(stat.icon, { sx: { fontSize: '2.5rem', opacity: 0.9 } })}</Box>
                                <Typography variant="h3" fontWeight={700}>
                                    <AnimatedCounter end={stat.value} />
                                </Typography>
                                <Typography variant="body1" sx={{ opacity: 0.8 }}>
                                    {stat.label}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Animated Scroll Indicator */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 30,
                    paddingTop: 22,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                    cursor: 'pointer',
                    animation: 'bounce 2s infinite',
                    '@keyframes bounce': {
                        '0%, 20%, 50%, 80%, 100%': { transform: 'translateX(-50%) translateY(0)' },
                        '40%': { transform: 'translateX(-50%) translateY(-10px)' },
                        '60%': { transform: 'translateX(-50%) translateY(-5px)' },
                    },
                }}
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            >
                <Typography variant="caption" sx={{ opacity: 0.7 }}>Scroll Down</Typography>
                <ArrowDownIcon sx={{ fontSize: '1.5rem' }} />
            </Box>
        </Box>
    );
};

export default HeroSection;
