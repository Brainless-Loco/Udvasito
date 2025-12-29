import React from 'react';
import {
    Box,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
} from '@mui/material';
import {
    Favorite as HeartIcon,
    LocalHospital as HospitalIcon,
    SentimentSatisfied as HappyIcon,
    Replay as ReplayIcon,
    CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { useLanguage } from '../../context';

const BenefitsSidebar = () => {
    const { t } = useLanguage();

    const benefits = [
        { icon: <HeartIcon />, text: t.registration.benefit1 },
        { icon: <HospitalIcon />, text: t.registration.benefit2 },
        { icon: <HappyIcon />, text: t.registration.benefit3 },
        { icon: <ReplayIcon />, text: t.registration.benefit4 },
    ];

    const eligibility = [
        t.registration.ageRange,
        t.registration.minWeight,
        t.registration.minHemoglobin,
        t.registration.goodHealth,
        t.registration.noRecentSurgeries,
    ];

    return (
        <Box sx={{ width: { xs: '100%', md: '25%' }, flexShrink: 0 }}>
            <Paper
                sx={{
                    p: 3,
                    borderRadius: 3,
                    height: '100%',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                    position: { md: 'sticky' },
                    top: { md: 100 },
                }}
            >
                <Box sx={{ mb: 2 }}>
                    <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        gutterBottom
                        sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1d3557' }}
                    >
                        <HeartIcon sx={{ color: '#e63946', fontSize: 20 }} />
                        {t.registration.whyBecomeDonor}
                    </Typography>
                    <List dense disablePadding>
                        {benefits.map((benefit, index) => (
                            <ListItem key={index} sx={{ px: 0, py: 0.25 }}>
                                <ListItemIcon sx={{ color: '#e63946', minWidth: 28 }}>
                                    {benefit.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={benefit.text}
                                    primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box>
                    <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        gutterBottom
                        sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1d3557' }}
                    >
                        <CheckIcon sx={{ color: '#28a745', fontSize: 20 }} />
                        {t.registration.eligibility}
                    </Typography>
                    <List dense disablePadding>
                        {eligibility.map((criteria, index) => (
                            <ListItem key={index} sx={{ px: 0, py: 0.1 }}>
                                <ListItemText
                                    primary={`✓ ${criteria}`}
                                    primaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>

                <Box
                    sx={{
                        mt: 2,
                        p: 1.5,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)',
                        textAlign: 'center',
                    }}
                >
                    <Typography variant="caption" color="white" sx={{ opacity: 0.9 }}>
                        One donation saves up to
                    </Typography>
                    <Typography variant="h5" fontWeight={800} color="white">
                        3 Lives
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default BenefitsSidebar;
