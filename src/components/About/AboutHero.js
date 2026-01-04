import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import {
    Favorite as HeartIcon,
    People as PeopleIcon,
    VolunteerActivism as VolunteerIcon,
    LocalHospital as HospitalIcon,
} from '@mui/icons-material';
import { useLanguage } from '../../context';
import { heroSectionStyles, statWrapperStyle, statBoxStyles } from './styles';

const HeroSection = ({ stats }) => {
    const { t } = useLanguage();

    const heroStats = [
        {
            icon: <PeopleIcon />,
            value: stats?.totalDonors || '500+',
            label: t.about.registeredDonors || 'Registered Donors',
        },
        {
            icon: <HeartIcon />,
            value: stats?.livesSaved || '1000+',
            label: t.about.livesSaved || 'Lives Saved',
        },
        {
            icon: <VolunteerIcon />,
            value: stats?.volunteers || '50+',
            label: t.about.volunteers || 'Volunteers',
        },
        {
            icon: <HospitalIcon />,
            value: stats?.partneredHospitals || '10+',
            label: t.about.partneredHospitals || 'Partnered Hospitals',
        },
    ];

    return (
        <Box sx={heroSectionStyles}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography
                    variant="h3"
                    fontWeight={800}
                    textAlign="center"
                    sx={{ mb: 2, fontSize: { xs: '2rem', md: '3rem' } }}
                >
                    {t.about.heroTitle || 'Saving Lives, One Drop at a Time'}
                </Typography>
                <Typography
                    variant="h6"
                    textAlign="center"
                    sx={{ mb: 5, opacity: 0.9, maxWidth: 700, mx: 'auto', fontWeight: 400 }}
                >
                    {t.about.heroSubtitle || 'UDVASITO connects blood donors with those in need, building a community of lifesavers'}
                </Typography>

                {/* Stats */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', mx: -1 }}>
                    {heroStats.map((stat, index) => (
                        <Box key={index} sx={statWrapperStyle}>
                            <Box sx={statBoxStyles}>
                                <Avatar
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.15)',
                                        width: 56,
                                        height: 56,
                                        mx: 'auto',
                                        mb: 1.5,
                                    }}
                                >
                                    {stat.icon}
                                </Avatar>
                                <Typography variant="h4" fontWeight={700}>
                                    {stat.value}
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                                    {stat.label}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default HeroSection;
