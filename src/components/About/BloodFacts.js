import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import {
    Timer as TimerIcon,
    Replay as ReplayIcon,
    LocalHospital as HospitalIcon,
    Favorite as HeartIcon,
    Bloodtype as BloodIcon,
} from '@mui/icons-material';
import { useLanguage } from '../../context';
import { factCardStyles, factWrapperStyle } from './styles';

const BloodFacts = () => {
    const { t } = useLanguage();

    const facts = [
        {
            icon: <TimerIcon />,
            text: t.about.fact1,
            color: '#e63946',
            bgColor: 'rgba(230, 57, 70, 0.1)',
        },
        {
            icon: <HeartIcon />,
            text: t.about.fact2,
            color: '#457b9d',
            bgColor: 'rgba(69, 123, 157, 0.1)',
        },
        {
            icon: <HospitalIcon />,
            text: t.about.fact3,
            color: '#28a745',
            bgColor: 'rgba(40, 167, 69, 0.1)',
        },
        {
            icon: <ReplayIcon />,
            text: t.about.fact4,
            color: '#f4a261',
            bgColor: 'rgba(244, 162, 97, 0.1)',
        },
    ];

    return (
        <Paper
            sx={{
                p: { xs: 3, md: 5 },
                borderRadius: 4,
                background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                mb: 6,
            }}
        >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Avatar
                    sx={{
                        bgcolor: 'rgba(230, 57, 70, 0.1)',
                        width: 64,
                        height: 64,
                        mx: 'auto',
                        mb: 2,
                    }}
                >
                    <BloodIcon sx={{ fontSize: 32, color: '#e63946' }} />
                </Avatar>
                <Typography variant="h4" fontWeight={700} color="#1d3557">
                    {t.about.facts}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                    {t.about.factsSubtitle || 'Important things everyone should know about blood donation'}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1.5 }}>
                {facts.map((fact, index) => (
                    <Box key={index} sx={factWrapperStyle}>
                        <Box
                            sx={{
                                ...factCardStyles,
                                '&:hover .fact-icon': {
                                    transform: 'scale(1.15) rotate(5deg)',
                                },
                            }}
                        >
                            <Avatar
                                className="fact-icon"
                                sx={{
                                    bgcolor: fact.bgColor,
                                    color: fact.color,
                                    width: 56,
                                    height: 56,
                                    mx: 'auto',
                                    mb: 2,
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                {fact.icon}
                            </Avatar>
                            <Typography variant="body1" fontWeight={500} color="#1d3557">
                                {fact.text}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Paper>
    );
};

export default BloodFacts;
